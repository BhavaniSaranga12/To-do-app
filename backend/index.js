const express= require("express");
const dotenv= require('dotenv');
const cors = require('cors')
const mongoose= require('mongoose');
const bcrypt= require('bcrypt')
const jwt= require('jsonwebtoken')
const {z}= require('zod')
var cookieParser = require('cookie-parser')
dotenv.config();
const app= express();

const corsoption= {
    origin:["https://to-do-app-frontend-seven.vercel.app", ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
}


app.use(cors(corsoption));
app.use(cookieParser())
app.use(express.json());
const dbConfig= require('./dbConfig.js');
const User= require('./models/userModel.js');
const port = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));

// const TodoDetailsValidation = async(req, res,next) => {
//     const TodoDetailsSchema= z.object({
//         title : z.string({
//             required_error: "Name is required"
//         }).min(3).max(50),
//         des:  z.string({
//             required_error: "Description is required"
//         }).min(5).max(180)
    
//     })

//     try {
//         await TodoDetailsSchema.parseAsync(req.body);
//         next(); 
//     } catch (error) {
//         console.log(error)
//         res.status(400).json({ error: error.errors, status:false});
//     }
// }





const checkAuthentication = async (req, res, next) => {
   
    const token = req.headers.authorization?.split(' ')[1]
               
    console.log(token)
    if (token==null) {
        return res.status(400).json({ status: false, message: "please Sign in/Sign up" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const checkuser = await User.findOne({ email: decoded.email });
         
        if (checkuser) {
            req.user = {
                name : checkuser.name,
                id:checkuser._id,
                todos: checkuser.todos
            }; 
            return next();
        } else {
            return res.status(401).json({ status: false, message: "token expired"});
        }
    } catch (error) {
        console.log(error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ status: false, message: "Token expired" });
        } else {
           
            return res.status(500).json({ status: false, message: "Internal server error" });
        }
    }
};







app.get('/api/', checkAuthentication,(req,res) => { 
    try {
        res.status(200).json({status: true, details: req.user})
    } catch (error) {
        res.status(500).json({ status: false, message: error });
    }
})







app.post('/api/signup',  async (req,res)=> {
    try {
        const checkUser= await User.findOne({email: req.body.email});
        if(checkUser){
            res.status(409).json({message: "user already exists", status:false})
        }
        else {
        const newUser=  new User( {
            name: req.body.name,
            email:req.body.email,
            password: await bcrypt.hash(req.body.password,10)
        })
        newUser.save().then(() => {
            console.log("user saved");
            const payload = {
                name: req.body.name,
                email:req.body.email, 
               
            }
           const token= jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
         
         
           
            res.status(201).json({message: "Sign Up Successful", status: true, details : {
                name : newUser.name,
                id:newUser._id,
                token:token
            }})
        }) } 
    } catch (error) {
        res.status(500).json({message:" Error in Signing Up", status: false}) 
    }
    
})


app.post('/api/signin',  async (req,res)=> {
    try {
        const checkUser= await User.findOne({email: req.body.email});
        if(!checkUser){
            return res.status(404).json({message: "user doesn't exist", status:false})
        }
      const matchPassword= await bcrypt.compare(req.body.password,checkUser.password ) 
      if(matchPassword) {
        const payload = {
            userId: checkUser._id, 
            username: checkUser.name,
            email: checkUser.email
        }
        
      
       const token= jwt.sign(payload, process.env.JWT_SECRET, { expiresIn:'1m' })
     ;
       
        res.status(200).json({message: "sign in successful", status: true,details : {
            name : checkUser.name,
            id:checkUser._id,
            todos: checkUser.todos,
            token:token
        }})
      }
      else {
        return res.status(401).json({ message: "Incorrect password" , status: false});
    }
    } catch (error) {
        res.status(500).json({message: error, status: false}) 
    }
    
})



// app.get('/api/signout', (req,res)=> {
//     res.clearCookie('token').status(200).json({message: "successfully signed out"})
// })




app.post('/api/add-task',checkAuthentication,async (req,res) => { 
try {
   
    const findUser= await User.findByIdAndUpdate(req.user.id, {
        $push: { todos: {title: req.body.title,
             description : req.body.des,}} 
    },  { new: true });
    res.status(200).json({message: "added", status: true, todos: findUser.todos});
} catch (error) {
   
        console.error('Error adding task:', error);
        res.status(500).json({ message: "Error adding task", status: false });
      
    
}
})



app.get('/api/updatetask/:id', checkAuthentication, async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found", status: false });
        }
        const task = user.todos.find(task => task._id.toString() === id);
        if (!task) {
            return res.status(404).json({ message: "Task not found", status: false });
        }
        task.completed = !task.completed;
        await user.save();
        res.status(200).json({ message: "Task updated successfully", status: true, todos: user.todos });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: "Error updating task", status: false });
    }
});

app.get('/api/deletetask/:id', checkAuthentication, async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found", status: false });
        }
        const tasks=await User.findByIdAndUpdate(req.user.id, {
            $pull: { todos: {_id: id}} 
        },  { new: true });
       
        res.status(200).json({ message: "Task deleted successfully", status: true, todos: tasks.todos });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: "Error deleting task", status: false });
    }
});






app.listen(port, () => {
    console.log(`Server is running on port `);
    
  });
