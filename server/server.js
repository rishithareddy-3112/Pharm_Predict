const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser') 
const dotenv = require('dotenv')

dotenv.config()
const app = express()

mongoose.connect(process.env.DATABASE,{})
.then(()=>{
    console.log('db is connected');
})
.catch(err => console.log('DB CONNECTION ERROR:', err));

const authRoutes = require('./routes/auth')
const pharmaRoutes = require('./routes/pharma')
const medicineRoutes = require('./routes/medicine')

app.use(bodyParser.json())
app.use(cors()); 

app.use('/pharma', authRoutes)
app.use('/pharma', pharmaRoutes)
app.use('/pharma', medicineRoutes)

app.get('/',(req,res)=>{
    res.json({
        data:"Welcome to PharmPredict"
    })
})

const port = process.env.PORT || 8000
app.listen(port,()=>{
    console.log(`Application running on port ${port}`)
})