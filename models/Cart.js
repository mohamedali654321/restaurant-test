const mongoose=require('mongoose');
const cartSchema=new mongoose.Schema({
    _id:{
        type:String ,
        required:true
    },
    quantity:{
        type:Number ,
        required:true
    },
    totalPrice:{
        type:Number,
        required:true
    },
    selectedProduct:{
        type: Array ,
        required:true
    }
});
module.exports=mongoose.model('Cart',cartSchema);