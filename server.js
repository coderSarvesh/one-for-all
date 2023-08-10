const express = require('express');
const mongoose = require('mongoose')
require('dotenv').config()
var cors = require('cors')

const app = express();

app.use(cors())
app.use(express.json())

//routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("Connected to DB & Listening to port  :", process.env.PORT)
        })
    })
    .catch((error) => { console.log(error) })
