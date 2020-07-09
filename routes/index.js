var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");
const Cart = require("../models/Cart");
const {check,validationResult}=require('express-validator');

/* GET home page. */
router.get("/", function (req, res, next) {
  var quant = null;
  if (req.isAuthenticated()) {
    if (req.user.cart) {
      quant = req.user.cart.quantity;
    } else {
      quant = 0;
    }
  }
  Product.find({}, (err, docs) => {
    if (err) {
      console.log(err);
    } else {
      var productGrid = [];
      var colgrid = 3;
      for (var i = 0; i < docs.length; i += colgrid) {
        productGrid.push(docs.slice(i, i + colgrid));
      }
      res.render("index", {
        products: productGrid,
        chekuser: req.isAuthenticated(),
        totalquantity: quant,
      });
    }
  });
});
router.get("/addToCart/:_id/:price/:name", (req, res, next) => {
  const cartID = req.user.id;
  var newPriceProduct = parseInt(req.params.price);
  const newProduct = {
    _id: req.params._id,
    price: newPriceProduct,
    name: req.params.name,
    quantity: 1,
  };
  Cart.findById(cartID, (err, cart) => {
    if (err) {
      console.log(err);
    }
    if (!cart) {
      const newCart = new Cart({
        _id: cartID,
        totalPrice: newPriceProduct,
        quantity: 1,
        selectedProduct: [newProduct],
      });
      newCart.save((err, docs) => {
        if (err) {
          console.log(err);
        }
        console.log(docs);
        console.log(cart);

        res.redirect("/");
      });
    }
    if (cart) {
      var indexOfProduct = -1;
      for (var i = 0; i < cart.selectedProduct.length; i++) {
        if (req.params._id === cart.selectedProduct[i]._id) {
          indexOfProduct = i;
          break;
        }
      }
      if (indexOfProduct >= 0) {
        cart.selectedProduct[indexOfProduct].price =
          cart.selectedProduct[indexOfProduct].price + newPriceProduct;
        cart.selectedProduct[indexOfProduct].quantity =
          cart.selectedProduct[indexOfProduct].quantity + 1;
        cart.quantity = cart.quantity + 1;
        cart.totalPrice = cart.totalPrice + newPriceProduct;
        Cart.updateOne({ _id: cartID }, { $set: cart }, (err, docs) => {
          if (err) {
            console.log(err);
          } else {
            console.log(docs);
            console.log(cart);
          }
        });
        res.redirect("/");
      } else {
        cart.totalPrice = cart.totalPrice + newPriceProduct;
        cart.quantity = cart.quantity + 1;
        cart.selectedProduct.push(newProduct);
        Cart.updateOne({ _id: cartID }, { $set: cart }, (err, docs) => {
          if (err) {
            console.log(err);
          } else {
            console.log(docs);
            console.log(cart);
            res.redirect("/");
          }
        });
      }
    }
  });
});
router.get("/cart", (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect("users/signin");
    return;
  }
  if (!req.user.cart) {
    res.render("user/shopping-cart", {
      
      chekuser: true,
      totalquantity:0,
    });
    return;
  }
  const newCart = req.user.cart;
  var quant=null;
  if(newCart)
  {
    quant=req.user.cart.quantity;
  }
  else{
    quant=0
  }

  res.render("user/shopping-cart", {
    products: newCart,
    chekuser: true,
    totalquantity: quant,
  });
});
router.get("/pluse/:index", (req, res, next) => {
  console.log(req.params.index);
  const index = req.params.index;
  const userCart = req.user.cart;
  const priceOfProduct =
    userCart.selectedProduct[index].price /
    userCart.selectedProduct[index].quantity;
  console.log(priceOfProduct);
  userCart.selectedProduct[index].quantity =
    userCart.selectedProduct[index].quantity + 1;
  userCart.selectedProduct[index].price =
    userCart.selectedProduct[index].price + priceOfProduct;
  userCart.totalPrice = userCart.totalPrice + priceOfProduct;
  userCart.quantity = userCart.quantity + 1;

  Cart.updateOne({ _id: userCart._id }, { $set: userCart }, (err, docs) => {
    if (err) {
      console.log(err);
    }
    console.log(docs);
    console.log(userCart);
  });
  res.redirect("/cart");
});
router.get("/minus/:index", (req, res, next) => {
  console.log(req.params.index);
  const index = req.params.index;
  const userCart = req.user.cart;
  const priceOfProduct =
    userCart.selectedProduct[index].price /
    userCart.selectedProduct[index].quantity;
  console.log(priceOfProduct);
  if(userCart.selectedProduct[index].quantity>1)
  {
  userCart.selectedProduct[index].quantity =
    userCart.selectedProduct[index].quantity - 1;
  userCart.selectedProduct[index].price =
    userCart.selectedProduct[index].price - priceOfProduct;
  userCart.totalPrice = userCart.totalPrice - priceOfProduct;
  userCart.quantity = userCart.quantity - 1;
  }
  

  Cart.updateOne({ _id: userCart._id }, { $set: userCart }, (err, docs) => {
    if (err) {
      console.log(err);
    }
    console.log(docs);
    console.log(userCart);
  });

  res.redirect("/cart");
});
router.get("/delete/:index", (req, res, next) => {
  const index = req.params.index;
  const userCart = req.user.cart;
  console.log(userCart.selectedProduct.length);
  
  
 if( userCart.selectedProduct.length<=1){
   Cart.deleteOne({_id:userCart._id},(err,docs)=>{
     if(err){
       console.log(err);
     }
     console.log(docs);
     
   });


 }
 else{
  userCart.quantity=userCart.quantity - userCart.selectedProduct[index].quantity;
  userCart.totalPrice=userCart.totalPrice - userCart.selectedProduct[index].price;
  userCart.selectedProduct.splice(index,1);
  
  }
  Cart.updateOne({ _id: userCart._id }, { $set: userCart }, (err, docs) => {
    if (err) {
      console.log(err);
    }
    console.log(docs);
    console.log(userCart);
  });

 

  res.redirect("/cart");

  
});
router.get('/checkout',(req,res,next)=>{
  if(!req.isAuthenticated()){
   res.redirect('users/signin');
   return ;

  }
  if(!req.user.cart)
  {
    res.redirect('/cart');

    return ;
  }
const quant=req.user.cart.quantity;

const massages=req.flash('checkFlash');
console.log(massages);

  res.render('user/checkout',{ chekuser: true,
    totalquantity: quant,
  price:req.user.cart.totalPrice,massages:massages});
});
router.get('/search',(req,res,next)=>{
  var quant = null;
  if (req.isAuthenticated()) {
    if (req.user.cart) {
      quant = req.user.cart.quantity;
    } else {
      quant = 0;
    }
  }
Product.find({"productName":{"$regex":req.query['search'],"$options":"1"}},(err,docs)=>{
  if (err) {
    console.log(err);
  } 
    var productGrid = [];
    var colgrid = 3;
    for (var i = 0; i < docs.length; i += colgrid) {
      productGrid.push(docs.slice(i, i + colgrid));
    }
    console.log(docs);
    res.render("index", {
      products: productGrid,
      chekuser: req.isAuthenticated(),
      totalquantity: quant,
    });
  
  


})




});
router.post('/checkout',[
  check('name').not().isEmpty().withMessage('Enter Your Name'),
  check('address').not().isEmpty().withMessage('Enter Your Address'),
  check('credit-card-name').not().isEmpty().withMessage('Enter Your Credit Card Name'),
  check('credit-card-number').not().isEmpty().withMessage('Enter Your Credit Card Number'),
  check('credit-card-number').isLength({min:16,max:16}).withMessage(' Credit Card Number Is 16 Number'),
  check('expire-month').not().isEmpty().withMessage('Enter Expire Month'),
  check('expire-month').custom((value)=>{
    if(value >30){throw new Error('Month Date Must Be Less Than Or Equal 30')}
    return true;
  }),
  check('expire-year').not().isEmpty().withMessage('Enter Expire Year'),
  check('expire-year').custom((value)=>{
    if(value<2020){throw new Error('This Date Is Expired')}
    return true;
  }),
  check('cvc').not().isEmpty().withMessage('Enter CVC Number'),
  check('cvc').isLength({min:3,max:3}).withMessage('CVC Must Be 3 Numbers')
  
],(req,res,next)=>{
const errors=validationResult(req);

//console.log(errors.errors);
if(!errors.isEmpty()){
  const validErrors=[];
  for(var i=0;i<errors.errors.length;i++)
  {
    validErrors.push(errors.errors[i].msg);
  }
  req.flash('checkFlash',validErrors);
 // console.log(req.flash('checkFlash'))
  res.redirect('/checkout');
  return;
}
else{
  const id=req.user.id;
Cart.findByIdAndDelete(id,(err,docs)=>{
  if(err){
    console.log(err)
  }
  console.log(docs);
})
res.redirect('/thankyou');

}





})
router.get('/thankyou',Auth,(req,res,next)=>{
  res.render('thankyou');



})
function Auth(req,res,next){
  if(!req.isAuthenticated()){
    res.redirect('/users/signin');
  }
  next();

}
module.exports = router;
