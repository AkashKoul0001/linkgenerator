const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Url = require("../models/urlModel");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register User
const createUser = asyncHandler(async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            mobile,
            password: hashedPassword,
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error(error); 
        res.status(400).json({ success: false, message: "Unable to create user", error: error.message });
    }
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }
        console.log("logged in successfully");
        res.json({
            success: true,
            message: "Successfully logged in",
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Unable to login", error: error.message });
        console.log("unable to login")
    }
});



const updateUser = asyncHandler(async (req, res) => {
    const { name, email, mobile } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if email is updated → Force logout
    if (email && email !== user.email) {
        user.email = email;
        await user.save();
        return res.status(200).json({ success: true, message: "Email updated, please log in again" });
    }

    // Update other fields
    user.name = name || user.name;
    user.mobile = mobile || user.mobile;

    await user.save();

    res.json({ success: true, message: "Profile updated successfully" });
});

// Delete Account
// const deleteUser = asyncHandler(async (req, res) => {
//     const user = await User.findById(req.user.id);
//     if (!user) {
//         return res.status(404).json({ success: false, message: "User not found" });
//     }

//     await Url.deleteMany({ userId: user._id });
//     await user.remove();
//     res.json({ success: true, message: "Account deleted successfully" });
// });



const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    // Delete all URLs associated with the user
    await Url.deleteMany({ userId: user._id });

    // Use deleteOne to remove the user from the database
    await User.deleteOne({ _id: user._id });

    res.json({ success: true, message: "Account deleted successfully, you have been logged out" });
});

// const deleteUser = asyncHandler(async (req, res) => {
//     const user = await User.findById(req.user.id);
//     if (!user) {
//         return res.status(404).json({ success: false, message: "User not found" });
//     }

//     // Delete all URLs associated with the user
//     await Url.deleteMany({ userId: user._id });

//     // Remove user from database
//     await user.remove();

//     res.json({ success: true, message: "Account deleted successfully, you have been logged out" });
// });

module.exports = { createUser, loginUser, updateUser, deleteUser };





// const asyncHandler = require("express-async-handler");
// const User = require("../models/userModel");



// //function for creating new user
// const createUser = asyncHandler(async(req , res)=>{

//     try{
//         console.log("The data we are getting is : " , req.body);

//         await User.create({
//             name:req.body.name,
//             email:req.body.email,
//             mobile:req.body.mobile,
//             password:req.body.password
//         })


//         res.status(201).send({
//             success:true,
//             message:"user data received successfully",
            
//         })

//     }catch(error){
//         console.log("error in creating new user" , error);
//         res.status(400).send({
//             success:false,
//             message:"Unable to create user",
//             error: error.message
//         })
//     }
// })


// const loginUser = asyncHandler(async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // Check if email exists
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).send({
//                 success: false,
//                 message: "Invalid email"
//             });
//         }

//         // Check if password matches 
//         if (password !== user.password) {
//             return res.status(400).send({
//                 success: false,
//                 message: "Invalid password"
//             });
//         }

//         // If email and password are correct, log in the user
//         res.status(200).send({
//             success: true,
//             message: "Successfully logged in"
//         });

//     } catch (error) {
//         return res.status(500).send({
//             success: false,
//             message: "Unable to login user",
//             error: error.message
//         });
//     }
// });


// //function for login
// // const loginUser = asyncHandler(async(req,res)=>{
// //     try{
// //         const userEmail = req.body.email;
        

// //         const emailResponse = await User.findOne({email:userEmail});
// //         if(!emailResponse){
// //             return res.status(400).send({
// //                 success:false,
// //                 message:"Invalid email"
// //             })
// //         }

// //         const password = req.body.password;

// //         if(!password){
// //             return res.status(400).send({
// //                 success:false,
// //                 message:"Invalid password"
// //             })
// //         }

// //         const data = {
// //             user:{
// //                 id:emailResponse.id
// //             }
// //         };

// //         res.status(200).send({
// //             success:true,
// //             message:"successfully logged in"
// //         })


// //     }catch(error){
// //         return res.status(400).send({
// //             success:false,
// //             message:"unable to login user",
// //             error:error.message
// //         })
// //     }
// // })

// module.exports = {createUser , loginUser};