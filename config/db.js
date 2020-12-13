const mongose=require('mongoose');
const config=require('config');
const db=config.get('mongourl');

const connectdb= async()=>{
    try{
         mongose.connect(db,{
             useNewUrlParser:true,useUnifiedTopology: true,useFindAndModify:false
         })
         console.log('db connected');
    }
    catch(e){
        console.log(e);
    }
}
module.exports =connectdb;