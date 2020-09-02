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
module.exports =router