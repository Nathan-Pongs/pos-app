const mongoose = require('mongoose')
const itemSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    category: {
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    } 
}, {timestamp: true});

const Items = mongoose.model("Items", itemSchema)
module.exports = Items;