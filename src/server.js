const express = require('express')
require('dotenv').config()
const filesRouter = require('./routes/file/')
const app = express()
const fetch = require('node-fetch')
app.use(express.json())
app.use(express.static(__dirname+'/../files'));
app.use('/files',filesRouter)
app.listen(process.argv[2], async ()=>{
    console.log('running on port ', process.argv[2])
    const registration = await fetch("http://localhost:4500/addmicroservice", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            url: "http://localhost:" + process.argv[2]
        })
    })
    console.log(registration)

    if (registration.ok){
        console.log("OK! I'm in")
    }
    else{
        console.log("SOMETHING WENT WRONG!")
    }
})