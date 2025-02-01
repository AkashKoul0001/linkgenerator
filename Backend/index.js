const express = require("express");
const dbConnection = require("./db.js")
const cors = require("cors")
require("dotenv").config();


const app = express();

app.use(cors());

// app.use(cors({
//     origin: 'http://localhost:3000', // your front-end URL
//     methods: 'GET, POST, PUT, DELETE',
//     allowedHeaders: 'Content-Type, Authorization'
//   }));


app.use(express.json());


dbConnection();

//backend testing
app.get("/",(req , res)=>{
    res.send("hello world")
})

//apis

//user api
app.use("/api/v1/users", require("./routes/userRoutes"))

//url shortner api
app.use("/api/v1/url" ,require("./routes/urlRoutes.js") )


app.listen(8000 , ()=>{
    console.log("Server is listening on port 8000");
})