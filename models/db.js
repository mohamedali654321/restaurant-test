const mongoose=require('mongoose');
mongoose.connect('mongodb+srv://mohamedali:123456mohamedali@cluster0.619p5.mongodb.net/restaurant?retryWrites=true&w=majority',{useNewUrlParser:true ,useUnifiedTopology:true},(err)=>{
if (err) {
      console.log('Error In DB Connection:' +err);
} else {
    console.log('connected to DB successfully');
    
}



});