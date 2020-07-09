var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/user');
const passport=require('passport');
const csrf=require('csurf');
router.use(csrf());
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.get('/signUp', isNotsignin,function (req, res, next) {
  var massagesError = req.flash('errors');
  console.log(massagesError);
  res.render('user/signUp', { massages: massagesError,token:req.csrfToken() });
});
router.post(
  '/signup',
  [
    check('email').not().isEmpty().withMessage('please enter your email'),
    check("email")
      .isEmail()
      .withMessage('your email is invalid ,please enter valid email'),
    check('password').not().isEmpty().withMessage('please enter your password'),
    check('password')
      .isLength({ min: 5 })
      .withMessage("password must be longer than 5 chacters"),
    check('confirm-password').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('password and confirm-password are not matching');
      } else {
        return true;
      }
    }),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      

      var validationMassages = [];
      for (var i = 0; i < errors.errors.length; i++) {
        validationMassages.push(errors.errors[i].msg);
      }
      
      req.flash('errors', validationMassages);
      res.redirect('signup');
      return;
    }
    next();
    
  },passport.authenticate('local-signup',{
    session:false,
    successRedirect:'signin',
    failureRedirect:'signup',
    failureFlash:true
  })
);
router.get('/profile',isSignin,(req,res,next)=>{
 
  
 console.log(req.user);
 var quant=null;
 if(req.user.cart)
 {
   quant=req.user.cart.quantity;
 }
 else{
   quant=0;
 }
 
  res.render('user/profile',{chekuser:true, checkprofile:true,totalquantity:quant});
});

router.get('/signin', isNotsignin,(req, res, next) => {
  var singinErrors=req.flash('signinError');
  console.log(req.csrfToken());

  res.render('user/signIn', {errorMasseges:singinErrors,token:req.csrfToken()} );
});
router.post('/signin',[
  check('email').not().isEmpty().withMessage('please enter your email'),
    check("email")
      .isEmail()
      .withMessage('your email is invalid ,please enter valid email'),
    check('password').not().isEmpty().withMessage('please enter your password'),
    check('password')
      .isLength({ min: 5 })
      .withMessage("password must be longer than 5 chacters")
],(req,res,next)=>{
  var errors=validationResult(req);
  if(!errors.isEmpty())
  {
    var errorValidatiion=[];
    for(var i=0;i<errors.errors.length;i++){
      errorValidatiion.push(errors.errors[i].msg);

    }
    req.flash('signinError',errorValidatiion);
    res.redirect('signin');
    return;
   
  }
  next();
},passport.authenticate('local-signin',{
  
  successRedirect: '/',
  failureRedirect:'signin',
  failureFlash:true
}));
router.get('/logout',isSignin,(req,res,next)=>{
  req.logOut();
  res.redirect('/');
 
});
 function isSignin(req,res,next){
   if(! req.isAuthenticated()){
     res.redirect('signin');
     return;
   }
   next();
   
 }
 function isNotsignin(req,res,next){
   if(req.isAuthenticated()){
     res.redirect('/');
     return;
   }
   next();
 }

module.exports = router;
