const express = require("express")
const fs = require("fs-extra")
const fn = "microservices.json"
const cors = require("cors")
const fetch = require("node-fetch")

const server = express()

server.use(cors())
server.use(express.json())

server.post("/addmicroservice", async (req, res)=> {
    const nodes = JSON.parse(await fs.readFile(fn))
    if (!nodes.find(x => x === req.body.url)){
        nodes.push(req.body.url)
        console.log("MICROSERVICE ADDED => " + req.body.url)
        await fs.writeFile(fn, JSON.stringify(nodes))
    }
    res.send("OK")
} )

server.get("/:container", async (req, res) => {

    let result = 10
    do {
        const nodes = JSON.parse(await fs.readFile(fn))
        if(nodes.length === 0)
            return res.status(500).send("No available workers")
        const randomService = Math.floor(Math.random() * nodes.length)
        const node = nodes[randomService]
        console.log("Contacting node " + node)
        const url = node + "/files/" + req.params.containerName
        try{
            const response = await fetch(url)
            if (response.ok){
                const files = await response.json();
                return res.send(files)
            }
            else {
                const removed = nodes.filter(x => x !== node)
                await fs.writeFile(fn, JSON.stringify(removed))
                console.log(`Removing ${node} from the list!`)
            }
        }
        catch {

            const removed = nodes.filter(x => x !== node)
            await fs.writeFile(fn, JSON.stringify(removed))
            console.log(`Removing ${node} from the list!`)
            result --
        }

    } while (result > 0)
})

server.listen(4500, () => console.log("Server listening on 4500"))