import dotenv from "dotenv";
import express from "express";
import pkg from 'body-parser';
import mongoose from "mongoose";
import ejs from "ejs";
import encrypt from "mongoose-encryption";
const { urlencoded } = pkg;

dotenv.config();
const app = express();


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(pkg.json({limit: "30mb", extended: true}));
app.use(pkg.urlencoded({limit: "30mb", extended: true}));


/* MONGODB SETUP */

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/userDB");

// mongoose password encryption
const userSchema =  new mongoose.Schema({
    email: String,
    password:String
});



userSchema.plugin( encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] } );


const User = new mongoose.model("User", userSchema);


app.get("/", (req, res) =>{
    res.render("home")
})

app.get("/login", (req, res) =>{
    res.render("login")
})


app.get("/register", (req, res) =>{
    res.render("register")
})


app.post("/register", (req, res) => {
    const newUser = new  User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save( (err) =>{
        if(err){
            console.log(err)
        }else{
            res.render("secrets")
        }
    });
});


app.post("/login", (req, res) => {
    const username = req.body.username;
    const password =  req.body.password;

    User.findOne({email: username}, (err, foundUser) =>{
        if(err){
            console.log(err)
        }else{
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets")
                }else{
                    console.log("login failed")
                }
            }
        }
    })


})


app.listen(3000, () =>{
    console.log("Server started on port 3000.")
})