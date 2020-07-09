const mongoose=require('mongoose');
const checkoutSchema=new mongoose.Schema({
name:{type:String,required:true},
address:{type:String,required:true},
creditCardName:{type:String,required:true},
creditCardNumber:{type:Number,required:true},
expireMonth:{type:Number,required:true},
expireyear:{type:Number,required:true},
cvc:{type:Number,required:true}

});
module.exports=mongoose.model('Checkout',checkoutSchema);