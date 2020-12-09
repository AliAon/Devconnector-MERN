const express = require('express');
const router=express.Router();
const{check,validationResult}=require('express-validator');
const User=require('../../models/User');
const bcrypt=require('bcryptjs');
const gravatar=require('gravatar');
const jwt=require('jsonwebtoken');
const config=require('config');

router.post('/',[
    check('name','please enter name').not().isEmpty(),
    check('email','please enter email').isEmail(),
    check('password','please enter password').isLength({min:6})
],async(req,res)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){
return res.status(400).json({errors:error.array()});
    }
    
    //fetcing data from postman or clint
    const{name,password,email}=req.body;


    try{
        //see if user exist
        let user=await User.findOne({email});
        if(user){
            return res.status(400).json({erros:[{msg:'User aready exist'}]});
        }
        //get user gavatar
        const avatar=gravatar.url(email,{
            s:'200',
            r:'pg',
            d:'mm'
        });
        user=User({
            name,
            email,
            avatar,
            password
        });
        //Encrypt password
        const salt =await bcrypt.genSalt(10);
        user.password=await bcrypt.hash(password,salt);
        await user.save();
        const payload={
            id:user.id,
        }
        jwt.sign(payload,config.get('jwtSecret'),{expiresIn:36000},(err,token)=>{
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