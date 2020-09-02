const express = require('express')
require('dotenv').config()
const filesRouter = require('./routes/file/')
const app = express()

app.use(express.json())
app.use(express.static(__dirname+'/../files'));
app.use('/files',filesRouter)
app.listen(process.env.PORT || 3000, ()=>console.log('listening'))