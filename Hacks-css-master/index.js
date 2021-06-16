const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

require("dotenv").config();

app.set('view engine','ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))
app.use('/assets', express.static(__dirname + 'public/assets'))


const PORT = process.env.PORT || 3000;

//Mongoose connection
mongoose.connect("mongodb://localhost:27017/mycss",{
	useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false,
    useCreateIndex:true
}).then(()=>console.log('Connected to mongo server'))
	.catch(err => console.error(err));




app.get("/",(req,res)=>{
    res.render("landing");
});

const userRoutes = require("./routes/user");
app.use("/user",userRoutes);

app.listen(PORT,()=>{
    console.log("server started");
});
