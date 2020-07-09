const mongoose=require('mongoose');
var productSchema=new mongoose.Schema({
imagePath:{
    type:String ,
    required :true
},
productName:{
    type:String ,
    required :true
},
information:{
    type : String,
    required:false
    


},
price:{
    type : Number ,
    required :true
}



});
module.exports=mongoose.model('Product',productSchema);