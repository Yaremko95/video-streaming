const express = require('express')
const multer = require("multer")
require("dotenv").config()
const { BlobServiceClient, StorageSharedKeyCredential} = require("@azure/storage-blob")
const MulterAzureStorage = require('multer-azure-storage')
const router = express.Router()

const credentials = new StorageSharedKeyCredential("strivevideo", process.env.STORAGE_KEY)
const blobClient = new BlobServiceClient("https://strivevideo.blob.core.windows.net/", credentials)
const https = require('https')
router.get("/:container", async(req,res)=> {

     const container = await blobClient.getContainerClient('videos')
    const files = await container.listBlobsFlat()
    const toReturn = []
    for await (const file of files)
        toReturn.push(await container.getBlobClient(file.name).url)
    res.send(toReturn)

})

const multerOptions = multer({
    storage: new MulterAzureStorage({
        azureStorageConnectionString: process.env.STORAGE_CS,
        containerName: 'videos',
        containerSecurity: 'container'
    })
})

router.post("/uploadWithMulter", multerOptions.single("file"),   async (req, res)=>{
    res.send(req.file.url)
})

router.delete("/:containerName/:fileName", async (req, res)=>{
    const container = await blobClient.getContainerClient(req.params.containerName)
    await container.deleteBlob(req.params.fileName)

    res.send("ok")
})


module.exports =router