const passport=require('passport');
const localStrategy=require('passport-local').Strategy;
const User =require('../models/user');
const Cart=require('../models/Cart');
passport.serializeUser((user,done)=>{
    return done(null,user.id);
});
passport.deserializeUser((id,done)=>{
    User.findById(id,('email'),(err,user)=>{
        Cart.findById(id,(err,cart)=>{
            if(!cart){
                return done(err,user);
            }
            user.cart=cart;
            return done(err,user)
        });

       
    })
});




passport.use('local-signin', new localStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
},(req,email,password,done)=>{
User.findOne({email:email},(err,user)=>{
    if(err)
    {
        return done(err);
    }
    if(user===null)
    {
        return done(null,false,req.flash('signinError','This Email Not Found'));
    }
    if(!user.coparePassword(password))
    {
        return done(null,false,req.flash('signinError','Wrong Password'));
    }
    return done(null,user);
})


}));



passport.use('local-signup',new localStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
},(req,email,password,done)=>{
User.findOne({email:email},(err,user)=>{
    if(err){
        return done(err);
    }
    if(user !==null){
        return done(null,false,req.flash('errors','This User alraedy exist'));
    }
    const users=new User({
        email:email ,
        password:new User().hashPassword(password)
    });
    users.save((err,user)=>{
        if(err){
            return done(err);
        }
        return done(null,user);
    });
});



}));