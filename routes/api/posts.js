const express = require('express');
const router=express.Router();
const auth=require('../../middleware/auth');
const User=require('../../models/User');
const Profile=require('../../models/profile');
const { check, validationResult } = require('express-validator');
const profile = require('../../models/profile');
const Post = require('../../models/Posts');
 //@rout Post api/posts
//@dec  Create Post 
//@access private
router.post('/',[
    auth,
    [
        check('text','Text is required').not().isEmpty(),
    ]
],async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
    return res.status(401).json({errors:errors.array()});
    }
try {
    const user=await User.findById(req.user.id).select(-'password');
    const newPost=new Post({
        user:req.user.id,    
        name:req.body.name,
        text:req.body.text,
        avatar:req.body.avatar
    });

    const post=await newPost.save()
    res.json(post);
} catch (error) {
    console.log(error.message);
    res.status(500).send("server error responde");
}







    res.send('posts route')


});
//@rout Get api/posts
//@dec  Get all post
//@access private
router.get('/',auth,
    async(req,res)=>{
try {
    const post=await Post.find().sort({date:-1});
    res.json(post);


} catch (error) {
    console.log(error.message);
    res.status(500).send("server error responde");
}



});
//@rout Get api/post/:id
//@dec  Get post by id
//@access private
router.get('/:id',auth,
    async(req,res)=>{
   
try {
    const post=await Post.findById(req.params.id);
    if(!post){
        return res.status(500).json({msg:'Post not found'});
    }
    res.json(post);
} catch (error) {
    console.log(error.message);
    res.status(500).send("server error responde");
}



});
   //@rout Get api/post/:id
//@dec delete  post 
//@access private

router.delete('/:id',auth,async(req,res)=>{

    try {
        const post=await Post.findById(req.params.id);
        if(!post){
            return res.send('post not found');
        }else{
            post.remove();
        }
        res.json({'msg':"post removed"});    
    } catch (error) {
        console.log(error.message);
        res.status(500).send('There post not deleted for this user')
    }
    
    });
module.exports= router;