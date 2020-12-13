const express = require('express');
const router=express.Router();
const auth=require('../../middleware/auth');
const User=require('../../models/User');
const{check,validationResult}=require('express-validator');
const bcrypt=require('bcryptjs');
const gravatar=require('gravatar');
const jwt=require('jsonwebtoken');
const config=require('config');
router.get('/', auth ,async(req,res)=>{
  try{
    const user = await User.findById(req.user.id);
    res.json(user);
    //res.send('auth rout')
  }catch(err){
      console.log(err.message);
      res.status(401).json({msg:'user not authorized token'});

  }
   

});
// rout authenticate user and get token
//post api/auth

router.post('/',[
    check('email','please enter email').isEmail(),
    check('password','password required').exists()
],async(req,res)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){
return res.status(400).json({errors:error.array()});
    }
    
    //fetcing data from postman or clint
    const{password,email}=req.body;


    try{
        //see if user exist
        let user=await User.findOne({email});
        if(!user){
            return res.status(400).json({erros:[{msg:'Invalid Credentials'}]});
        }
        
        //compare bcrypted and orignal password for login
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({erros:[{msg:'Invalid Credentials'}]});
        }
        const payload={
            id:user.id,
        }


        //genrate jwt token
        jwt.sign(payload,
            config.get('jwtSecret'),
            {expiresIn:36000},
            (err,token)=>{
            if(err)throw err;
            res.json({token});
        });
        

    // res.send('User Register');
    }catch(err){
    console.log(err.message);
    res.status[500].send("server error responde");
    }
});


module.exports= router;