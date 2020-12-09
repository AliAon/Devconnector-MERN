const jwt=require('jsonwebtoken');
const config=require('config');

module.exports=function(req,res,next){
    //Get Token From header
    const token=req.header('x-auth-token');
    //if not token
    if(!token){
        return res.status(404).json({msg:"token not found"});
    }
    //verifu token
    try{
        const decoded=jwt.verify(token,config.get('jwtSecret'));
        req.user=decoded;
        next();
        
        console.log('token is valid '+req.user);
    }catch(err){
        console.log(err.message);
    res.status(500).json("token is not valid");

    }
    

}
