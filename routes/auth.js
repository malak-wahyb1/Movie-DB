const router =require('express').Router();
const User=require('../model/user')
const bcrypt=require('bcryptjs')
const Joi = require('@hapi/joi');
 const jwt=require('jsonwebtoken');
 const dotenv = require('dotenv');
 const valid=require('./verifyToken')
dotenv.config();
const { process } = require('@hapi/joi/lib/errors');

// register
   const schema=Joi.object({
    name: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
}); 

 

//add user
router.post('/register', async (req, res) => {
    //let validate schema
       const  {error} = schema.validate(req.body);
    if(error)return res.status(400).send(error.details[0].message)
  //check if the user is already registered
  const nameExit= await User.findOne({name:req.body.name})
    if(nameExit)return res.status(400).send("the name is already registered")

    //hash the password
    const PasswordB=req.body.password
    const hashPassword= await bcrypt.hash(PasswordB,10)

    const user = new User({
        name: req.body.name,
        password: hashPassword
    })
    try{
        const saveUser=await user.save();
        res.send({user:user.id})
    }catch(err){
        res.status(400).send(err)
    }
})
// log in

     const Schema=Joi.object({
      name: Joi.string().required().min(6),
      password: Joi.string().min(6).required(),
  }); 
  //login rout
  router.post('/login', async (req, res) => {
    //let validate schema
       const  {error} = Schema.validate(req.body);
       if(error)return res.status(400).send(error.details[0].message)
       //check if user exist
       const user=await User.findOne({name:req.body.name})
       if(!user) return res.status(400).send('user nam is not exist')
       //check password is correct
       const validPass=await bcrypt.compare(req.body.password,user.password)
        if(!validPass)return res.status(400).send('password is incorrect')

        // create and assign a token
        const admin={
            user:"malak",
            password:"1234567"
        }
        const token=jwt.sign({_id:user._id},admin)
        res.header('auth-token',token).send(token)
      
  })
 


module.exports =router;