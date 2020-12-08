const express=require('express');
const app=express();
app.get('/',(req,res)=>res.send('api runing'));

const PORT=process.env.PORT||5000;
app.listen(PORT,()=>console.log('server started '+PORT));