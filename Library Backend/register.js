const mongoose=require('mongoose');
const registerschema= new mongoose.Schema({
    name:String,
    number:String,
    email:{type:String,unique:true},
    password:String,
    confirmpass:String

})
module.exports=mongoose.model('register', registerschema)