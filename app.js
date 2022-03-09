const express = require('express')
const app = express()
const port = process.env.PORT || 8080;
const bodyParser = require('body-parser')
const mongoose = require('./config/db')
const router = require('./routes/index')

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use('/api/v1',router)
app.get('/test',(req,res)=>{
    res.json("test")
})

app.listen(port,()=>{
    console.log("Port is running at port", port)
})


