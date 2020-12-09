const express=require('express');
const connectdb=require('./config/db')
const app=express();
//conect database
connectdb();
//init middleware
app.use(express.json({exteneded:false}));

//routes
app.get('/',(req,res)=>res.send('api runing'));
app.use('/api/users',require('./routes/api/users'));
app.use('/api/auth',require('./routes/api/auth'));
app.use('/api/posts',require('./routes/api/posts'));
app.use('/api/profile',require('./routes/api/profile'));
const PORT=process.env.PORT||5000;
app.listen(PORT,()=>console.log('server started now '+PORT));