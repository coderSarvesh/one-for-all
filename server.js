const express = require('express');
const mongoose = require('mongoose')
require('dotenv').config()

const app = express();

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
