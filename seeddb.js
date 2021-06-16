const express = require("express");
const app = express();
const mongoose = require("mongoose");
const user = require("./models/user");
const org = require("./models/organization");

require("dotenv").config();

const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI,{
	useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false,
    useCreateIndex:true
}).then(()=>console.log('Connected to mongo server'))
    .catch(err => console.error(err));
    
// let name = ['Nabanita Bania','Debanjana purkayastha']
// let email = ['nabanitabania78@gmail.com','debanjana@gmail.com']
// let password = ['bania','debu']
// let city = ['silchar','guwahati']
// let state = ['Assam','Assam']
// let address = ['Joy kumar road','Ganeshguri']
// console.log(name.length,email.length,password.length,city.length,state.length,address.length);

// let name = ['KindWe','Your Help','Together Us','Lets Change','Save Us','Refactor World','Regain Humanity','Helping PPl','wE Help','jOIN us']
// let email = ['kindwe@gmail.com','togetherusa@gmail.com','change@gmail.com','worldwithin@gmail.com','humanity@gmail.com','helping@gmail.com','wehelp@gmail.com','joinus@gmail.com','hwlpingHande@gmail.com','refactoring@gmail.com']
// let password = ['bania123','srivatava123','yadav123','debu123','shrivatava123','pelchowdhury123','guptaji123','roy123','kemprai123','ahmed123',]
// let city = ['silchar','Silchar','silchar','silchar','guwahati','guwahati','guwahati','guwahati','dibrugarh','dibrugarh']
// let state = ['Assam','Assam','Assam','Assam','Assam','Assam','Assam','Assam','Assam','Assam']
// let category = ['poor','animals','both','poor','both','poor','both','animals','animals','poor']
// console.log(name.length,email.length,password.length,city.length,state.length,category.length);



try {
    // const seedDB = async () =>{
    //     // await org.deleteMany();
        
    //     for(let i = 0; i<10; i++)
    //     {
    //         const u = new org({
    //             name: name[i],
    //             email: email[i],
    //             password: password[i],
    //             active: true,
    //             contact: '9678211331',
    //             address: 'St Road, 123 ',
    //             city: city[i],
    //             state: state[i],
    //             description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ',
    //             category: category[i]
    //         })
    
    //         await u.save();
    //     }
    // }

    
  }
  catch(e) {
    console.log('Catch an error: ', e)
  } 

// const seedDB = async () =>{
//     await user.deleteMany();
    
//     for(let i = 0; i<2; i++)
//     {
//         const u = new user({
//             name: name[i],
//             email: email[i],
//             password: password[i],
//             active: true,
//             phone: '9678211331',
//             address: 'St Road, 123 ',
//             city: city[i],
//             state: state[i],
//         })

//         await u.save();
//     }
// }

app.get("/",(req,res)=>{
    seedDB();
    res.send("It might have worked")
})

app.listen(PORT,()=>{
    console.log("server started at Port " + PORT);
});