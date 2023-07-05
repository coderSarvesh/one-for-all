const mongoose = require('mongoose')
const Schema = mongoose.Schema

const noteSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title:{
        type: String,
        required:true
    },

    description:{
        type:String,
        required:true
    },
    tag:{
        type: String,
        required:false,
        default:'General'
    },

},{timestamps: true})

module.exports = mongoose.model('Note', noteSchema)