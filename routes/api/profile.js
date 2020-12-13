const express = require('express');
const router=express.Router();
const auth=require('../../middleware/auth');
const User=require('../../models/User');
const Profile=require('../../models/profile');
const { check, validationResult } = require('express-validator');
const profile = require('../../models/profile');
//@rout api/profile/me
//@dec get current user
//@access private
router.get('/me',[
    auth,
    [
        check('status','status is required').not().isEmpty(),
        check('skills','skills required').not().isEmpty(),
    ]
],async(req,res)=>
{
    try{
   const profile=await Profile.findOne({user:req.user.id}).populate('user',['name','avatar']);
   //profile not found
   if(!profile){
       return res.status(401).json({msg:'There is no profile for this user'});
   }
   //get json profile data
   return res.json(profile);
    }catch(err){
        console.log(err.message);
        res.status(500).send("server error responde");

    }
}
);
//@rout Post api/profile
//@desc create or update user profile
//@access private

    router.post(
    '/',
    auth,
async(req,res) => {
const errors=validationResult(req);
if(!errors.isEmpty()){
res.status(401).json({errors:errors.array()});
}
//fetching data from clint/postman

const {company,website,location,
bio,status,gihubusername,skills,youtube,
facebook,twitter,instagram,linkedin}=req.body;

//build profile obect

const profileFields={};
profileFields.user=req.user.id;
if(status) profileFields.status=status;
if(company) profileFields.company=company;
if(website) profileFields.website=website;
if(location) profileFields.location=location;
if(bio) profileFields.bio=bio;
if(gihubusername) profileFields.gihubusername=gihubusername;
if(skills){
    profileFields.skills=skills.split(',').map(skill=>skill.trim());
}
//Build Social Object
profileFields.social={};
if(youtube) profileFields.social.youtube=youtube;
if(twitter) profileFields.social.twitter=twitter;
if(facebook) profileFields.social.facebook=facebook;
if(linkedin) profileFields.social.linkedin=linkedin;
if(instagram) profileFields.social.instagram=instagram;


            try{
            let profile=await Profile.findOne({user:req.user.id});
            
            //if found profile
            if(profile){
            //Update
            console.log('profile till');

            profile=await Profile.findOneAndUpdate(
                {user:req.user.id},
                {$set:profileFields},
                {new:true}
                );
                return res.json(profile);

                console.log('profile found and updated');
            }

            // if not found Create
            profile=new Profile(profileFields);
            await profile.save();
             res.json(profile);


            }catch(err){
                console.log(err.message);
                return res.status(500).send("server error");
            }



console.log(err.message);
res.status(500).send("server error at responde @rout Post api/profile");

});

//@rout Get api/profile
//@dec get all profiles
//@access publc

router.get('/',async(req,res)=>{

try {
     const profiles=await Profile.find().populate('user',['name','avatar']);
     
     res.json(profiles);

} catch (error) {
    console.log(error.message);
     res.status(500).send('server error get all profiles')
}

});
//@rout Get api/profile/user/:uer_id
//@dec get user profile by user id
//@access public

router.get('/user/:user_id',async(req,res)=>{

    try {
         const profile=await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);
         if(!profile){
            return res.status(401).json({msg:'There is no profile for this user'});
        }
        res.json(profile);
    
    } catch (error) {
        console.log(error.message);
        res.status(500).send('There is no profile for this user')
    }
    
    });
    //@rout Get api/profile/
//@dec delete user, profile, posts 
//@access private

router.delete('/',auth,async(req,res)=>{

    try {
        //Remove profile
         await Profile.findOneAndRemove({user:req.user.id});
         //remover user
         await User.findOneAndRemove({_id:req.user.id});
        res.json({msg:'User profile deleted'});
    
    } catch (error) {
        console.log(error.message);
        res.status(500).send('There profile not deleted for this user')
    }
    
    });
  //@rout PUT api/profile/experience
//@dec add profile experience 
//@access private
router.put('/experience',[auth,
    [
        check('title','Title is required').not().isEmpty(),
        check('company','company is required').not().isEmpty(),
    ]
],async(req,res)=>{
const errors=validationResult(req);

if(!errors.isEmpty){
    return res.status(400).json({errors:errors.array()});
}

const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
}=req.body;

const newExp={};
newExp.title=title;
newExp.company=company;
newExp.location=location;
newExp.from=from;
newExp.current=current;
newExp.description=description;

//create
try {
    const profile=await Profile.findOne({user:req.user.id});

    profile.experience.unshift(newExp);

    await profile.save();
    res.json(profile);

} catch (error) {
    console.log(error.message);
        res.status(500).send('server error rout PUT api/profile/experience')
}


});
 //@rout delete api/profile/experience/:exp_id
//@dec  delete profile experience 
//@access private

router.delete('/experience/:exp_id',auth,async(req,res)=>{

    try {

         const profile=await Profile.findOne({user:req.user.id});
         //get removeindex

const removeindex=profile.experience
.map(item=>item.id)
.indexOf(req.params.exp_id);
console.log(removeindex);
profile.experience.splice(removeindex,1);
await profile.save();

res.json(profile);




    } catch (error) {
        console.log(error.message);
        res.status(500).send('There profile not  for this user')
    }
    
    });


module.exports= router;