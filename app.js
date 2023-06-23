//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const ejs = require("ejs");


const app = express();

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

userSchema = new mongoose.Schema({
    email : String,
    password : String
});
// Encryption - Should come before creating the model

userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedfields:['password']});

const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register", function(req,res){
    const newUser = new User({
        email:req.body.username,
        password :req.body.password
    });
    newUser.save().then(function(err){
       
            res.render("secrets");
        
    });
});

app.post("/login", function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username}).then(function(foundUser){
        if(foundUser.password === password){
            res.render("secrets");
        }
    });

});

app.listen(3000,function(req,res){
    console.log("listening port 3000");
});