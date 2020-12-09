const express = require('express');
const router=express.Router();
const auth=require('../../middleware/auth');
const User=require('../../models/User');


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

module.exports= router;