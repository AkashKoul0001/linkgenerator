const mongoose = require("mongoose");

const URI = "mongodb+srv://akashkoul673:admin@cluster0.b8rs8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/myProject"

const dbConnection = async() =>{


    try {
        await mongoose.connect(URI);
        console.log("Connected to database successfully");


    }catch(error){
        console.log("Error while connecting to the database : " , error.message);
    }
    console.log()
}

module.exports = dbConnection;