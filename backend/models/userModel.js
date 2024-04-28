const mongoose= require('mongoose');
const toDoSchema=require('./toDoModel')
const userSchema= new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    todos: [toDoSchema],
})


const userModel=  mongoose.model('users',userSchema);

module.exports= userModel;