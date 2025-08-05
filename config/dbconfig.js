const mongoose=require('mongoose');
const connect =mongoose.connect(process.env.MONGO_URL);
const connection=mongoose.connection;

connection.on('connected',()=>{
    console.log('mongodb is connected');
})

connection.on('error',(error)=>{
    console.log("error in mogodb connection",error);
});

module.exports=mongoose;