const mongoose=require('mongoose');
const bookschema= new mongoose.Schema({
    bookname:String,
    author:String,
    genre:String,
    borrowedBy: {
    type: String,
    default: null
}
})
module.exports=mongoose.model('book', bookschema)