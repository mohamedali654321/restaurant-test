const Product=require('../models/product');
const mongoose=require('mongoose');
 const db=require('../models/db');
var products=[
new Product({
    imagePath:'/images/products/p3.jpg',
    productName:'Pizza Margrita',
    information:'',
    price: 15



}),
new Product({
    imagePath:'/images/products/p4.jpg',
    productName:'Pizza Mix-Chease',
    information:'',
    price: 70



}),
new Product({
    imagePath:'/images/products/p15.jpg',
    productName:'Pizza Browniz',
    information:'',
    price: 45



}),
new Product({
    imagePath:'/images/products/M1 - Copy.jpg',
    productName:'Kofta Beef',
    information:'',
    price: 66



}),
new Product({
    imagePath:'/images/products/M10.jpg',
    productName:'Hot Ducks',
    information:'',
    price: 100



}),
new Product({
    imagePath:'/images/products/M7.jpg',
    productName:'Fahita Chekine Ana Beef',
    information:'',
    price: 107



}),
new Product({
    imagePath:'/images/products/M15.jpg',
    productName:'stack Beef',
    information:'',
    price: 90



}),
new Product({
    imagePath:'/images/products/M5 - Copy.jpg',
    productName:'Kabab Haty ',
    information:'',
    price: 230



}),
new Product({
    imagePath:'/images/products/M16.jpg',
    productName:'Meshakel Beef ',
    information:'',
    price: 300



}),
new Product({
    imagePath:'/images/products/p10.jpg',
    productName:'Dominus Pizza',
    information:'',
    price: 66



}),
new Product({
    imagePath:'/images/products/p2.jpg',
    productName:'Susis Pizza',
    information:'',
    price: 50



}),
new Product({
    imagePath:'/images/products/p12.jpg',
    productName:'Crown Craft Pizza',
    information:'',
    price: 69



}),






];
var count=0;
for(var i=0;i<products.length;i++)
{
   
 products[i].save((err,docs)=>{
     if (err) {
         console.log('Error in insert data :'+err);
         
     } else {
       
         console.log('data :' + docs);
         count++;
         if(count === products.length)
         {
             mongoose.disconnect();
            
         }
     }
 });

}