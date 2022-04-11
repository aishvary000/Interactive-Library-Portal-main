const mongoose = require("mongoose")
const uri = "mongodb+srv://aishvary000:UPU9v2Z4wGaKRgF@cluster0.thedj.mongodb.net/LibraryPortal?retryWrites=true&w=majority";
mongoose.connect(uri,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
  

}).then(()=>{
    console.log("Conection is succesful")
}).catch((e)=>{
    console.log("Connection failed : "+e)
})
