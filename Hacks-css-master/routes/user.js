const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cryptoRandomString = require('crypto-random-string');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const router = express.Router();
const User = require("../models/user");
const session = require("express-session");
const jwt = require("jsonwebtoken");

//use of modules
router.use(bodyParser.json());
router.use(cookieParser('secret_passcode'));
router.use(bodyParser.urlencoded({extended:true}));
router.use(session({
    secret: "secret_passcode",
    cookie: {
      maxAge: 4000000
    },
    resave: false,
    saveUninitialized: false
  }));


//nodemailer code
var transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:465,
    secure:true,
    auth: {
      user: process.env.NODEMAILER_EMAIL,           //email id
      pass: process.env.NODEMAILER_PASSWORD       //my gmail password
    }
});


//new registration
router.get("/register",(req,res)=>{
    res.render("register");
});

router.post("/register",(req,res)=>{
    
    bcrypt.hash(req.body.password, 10).then((hash) => {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hash
        });
        user.save().then((response) => {
            //nodemailer
            rand=cryptoRandomString({length: 100, type: 'url-safe'});
            host=req.get('host');
            link="http://"+req.get('host')+"/user/verify/"+user._id+"?tkn="+rand;
            mailOptions={ 
                from: process.env.NODEMAILER_EMAIL,
                to: user.email,
                subject : "Please confirm your Email account",
                html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
            }
            // console.log(mailOptions);
            transporter.sendMail(mailOptions, function(error, response){
             if(error){
                    console.log(error);
                res.end("error");
             }else{
                //  console.log(response);
                    console.log("Message sent: " + response.accepted);
                 }
            });
        //nodemailer ends
            //res.locals.flashMessages = req.flash("success", user.name + " Email has been sent to you for verification");
            // res.redirect("/dsc/");
        }).catch(error => {
            // res.status(500).json({
            //     error: error
            // });
            console.log(error);
            //res.locals.flashMessages = req.flash("error", "Email already in use try logging in");
            // res.redirect("/dsc/");
        });
    });

    res.send("user successfully created");
});

//login 
router.get("/login",(req,res)=>{
    res.render("login");
});

router.post("/login", (req, res) => {
    let getUser;
    User.findOne({
        email: req.body.email
    }).then(user => {
        if (!user) {
            // req.flash("error","User not found try creating a new account");
            // res.redirect("/dsc/");
            res.send("user not found");
        }
        getUser = user;
        // console.log(getUser);
        return bcrypt.compare(req.body.password, user.password);
    }).then(response => {
        if (!response) {
            // req.flash("error","You have entered wrong password");
            // res.redirect("/dsc/");
            res.send("wrong password");
        }
        // console.log(getUser+"hello");
        // console.log(response);
        if(getUser.active)
        {
            var token = jwt.sign({
                name: getUser.name,
                email: getUser.email,
                userId: getUser._id
            },process.env.JWT_SECRET, {
                expiresIn: "1d"
            });
            res.cookie( 'authorization', token,{ maxAge: 24*60*60*1000, httpOnly: false });
            // console.log(token);
        }
        if(getUser.active)
        {
            // req.flash("success",getUser.name + " you are logged in");
            // res.redirect("/dsc/");
            res.send("you are logged in successfully");
        }
        else
        {
            rand=cryptoRandomString({length: 100, type: 'url-safe'});
                host=req.get('host');
                link="http://"+req.get('host')+"/user/verify/"+getUser._id+"?tkn="+rand;
                mailOptions={ 
                    from: process.env.NODEMAILER_EMAIL,
                    to: getUser.email,
                    subject : "Please confirm your Email account",
                    html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
                }
                // console.log(mailOptions);
                transporter.sendMail(mailOptions, function(error, response){
                 if(error){
                        console.log(error);
                    res.end("error");
                 }else{
                        console.log("Message sent: " + response.accepted);
                     }
                });
            // req.flash("error",getUser.name + " your email is not verified we have sent you an email");
            // res.redirect("/dsc/");
            res.send("verify your email");
        }
        
    }).catch(err => {
        // req.flash("error",err);
        // res.redirect("/dsc/");
        console.log("err is here");
        console.log(err);
    });
});

//verification of logged user
router.get('/verify/:id',function(req,res){
    // console.log(req.protocol+":/"+req.get('host'));
    
        if((req.protocol+"://"+req.get('host'))==("http://"+host))
        {
            console.log("Domain is matched. Information is from Authentic email");
    
            User.findById(req.params.id,function(err,user){
                if(err)
                    console.log(err);
                else
                {
                    date2 = new Date();
                    date1 = user.created_at;
                    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                    var diffhrs = Math.ceil(timeDiff / (1000 * 60));
                    console.log(diffhrs);
    
                    if(diffhrs <= 3)
                    {
                        User.findByIdAndUpdate(user._id,{active:true},function(err,user){
                            if(err)
                                console.log(err);
                            else
                            {
                                console.log("email is verified");
                                // res.end("<h1>Email "+mailOptions.to+" is been Successfully verified");
                                // res.render("verify");
                                res.send("verified");
                            }
                              
                        });
    
                    }
                    else
                    {
                        User.findByIdAndUpdate(user._id,{created_at: new Date()},function(err,user){
                            if(err)
                                console.log(err);   
                        });
                        console.log("Link has expired try logging in to get a new link");
                        // res.end("<h1>Link has expired try logging in to get a new link</h1>");
                        // res.render("notverified");
                        res.send("notverified");
                    }
                }
            });
        }
        else
        {
            res.end("<h1>Request is from unknown source");
        }
    });

//logout
router.get("/logout",function(req,res){
    res.clearCookie('authorization');
    req.flash("success", "You are successfully logged out");
      res.redirect("/dsc/");
  });



module.exports = router;