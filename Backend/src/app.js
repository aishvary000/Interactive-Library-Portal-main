const express = require("express");
const path = require("path");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const PORT = process.env.PORT || 5500;
const SECRET = "MY_SECRET_KEY";
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const mongoose = require("mongoose");
const validUsers = require("../src/models/studentsCommomSchema")
const RegisteredUser = require("../src/models/userSchema")
const initializePassport = require("../passport_config");
const MongoStore = require("connect-mongo");
var multer = require('multer');
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

/*connecting to database*************************/
// pwd:UPU9v2Z4wGaKRgF
const uri ="mongodb://aishvary000:UPU9v2Z4wGaKRgF@cluster0-shard-00-00.thedj.mongodb.net:27017,cluster0-shard-00-01.thedj.mongodb.net:27017,cluster0-shard-00-02.thedj.mongodb.net:27017/LibraryPortal?ssl=true&replicaSet=atlas-y144ya-shard-0&authSource=admin&retryWrites=true&w=majority"

//const uri = process.env.DB_STRING
  console.log(uri)
const connection = mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conection is succesful");
  })
  .catch((e) => {
    console.log("Connection failed : " + e);
  });
/**
 * -------------- SESSION SETUP ----------------
 */

/**
 * The MongoStore is used to store session data.  We will learn more about this in the post.
 *
 * Note that the `connection` used for the MongoStore is the same connection that we are using above
 */
const sessionStore = new MongoStore({
  collectionName: "session",
  mongoUrl: uri,
});

initializePassport(
  passport,
  async (email) => {
    const user = await RegisteredUser.findOne({Email:email})
    console.log("Caaling from "+email)
    if(user)
    console.log("Got")
    return user;
  },
  async (id) => {
    const user = await RegisteredUser.find({ _id: id });
    //console.log("Called : "+user)
    return user;
  }
);
const app = express();
app.set("views", path.join(__dirname, "../../views"));
app.set("view engine", "ejs");

//const userModel = require("../src/models/userSchema");
const { nextTick } = require("process");
app.use(express.static("../../public"));
app.use(flash());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(
  express.urlencoded({
    extended: false,
  })
);

// const static_path = path.join(__dirname,"../../")
// app.use(express.static(static_path))
app.use(express.static(path.join(__dirname, "../../")));
app.listen(PORT, () => {
  console.log("Listening on port 3000");
});
/*setting up multer for image storage */

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../../public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
var uploadImage = multer({ storage: storage });
/**...................................................... */
app.get("/", (req, res) => {
  if (req.isAuthenticated) {
    var  toDisplay = ""
    //console.log("Fine")
    if(req.user != null)
    {
      console.log("OKAY"+req.user[0].Email)
      toDisplay = "Welcome, "+req.user[0].Name+" !"
    }
    // if(req.user != null)
    //   toDisplay = "Welcome "+req.user[0].Email
    else
      toDisplay = "Login/Register"
    console.log("anme is : "+toDisplay)
    res.render("pages/index.ejs", { name: toDisplay});
  } else res.render("pages/index.ejs",{name:"Login/Register"});

  // res.redirect('../../index')
  //console.log(res.error)
  //res.redirect('../../views/pages/index.ejs')
  // app.set('view engine', 'ejs');
});
app.get("/researchTools",(req,res)=>{
  res.render("partials/researchTools.ejs")
})
app.get("/login", (req, res) => {
  //res.render('../../login.html')
  console.log("Getting here")
  res.render("pages/login.ejs",{name:"Login/Register"});
 
  // nextTick()
});
app.post("/uploadImage",function(req,res,next){
var success = req.file.filename+"Uploaded Successfully"

})
app.get("/userRegisterPage", (req, res) => {
  console.log("Getting here 1")
  res.render("pages/userRegister.ejs");
});
app.get("/borrowingprivileges", (req, res) => {
  res.render("partials/borrowingprivileges.ejs");
});
app.get("/ill", (req, res) => {
  res.render("partials/ill.ejs");
});
app.get("/cddvds", (req, res) => {
  res.render("partials/cddvds.ejs");
});
app.get("/collectionExpanded", (req, res) => {
  res.render("partials/collectionExpanded.ejs");
});
//registering user
app.post("/userRegister",async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;
    const username = req.body.username;
    const email = req.body.email;
    console.log("Email is : "+email);
    const user1 = await isValid(email);
    // var img = fs.readFileSync(req.file.path);
    // var encode_img = img.toString('base64');
    // var final_img = {
    //     contentType:req.file.mimetype,
    //     image:new Buffer(encode_img,'base64')
    // };
    console.log("hello")
    if(user1)
    {
      console.log("User is present");
      var existingUser = await RegisteredUser.findOne({ Email: email });
      if (existingUser)
        return res
          .status(400)
          .json({ msg: "An account with this email already exists." });
      console.log("YEPE")
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
      const user = new RegisteredUser({
        Email: email,
        Password: passwordHash,
        Name: username,
        //Image:final_img
      });
      const registeredUser = await user.save();

      res.render("pages/login.ejs",{name:"Login/Register"});
    // } else {
    //   res.send("Password mismatch");
    // }
  }
  else
  {
    return res
          .status(400)
          .json({ msg: "Sorry only organization emails are allowed." });
  }
} 
  catch (error) {
    res.status(400).send(error);
  }
});

// Login
app.post(
 
  "/login",
 
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
async function isValid(email)
{
  console.log(email)
  const user = await validUsers.findOne({EMAIL:email})
  return user
  

}
// function checkAuthenticated(req,res,next)
// {
//   if(res.isAuthenticated())
//   {

//   }
// }

// try {
//   const { email, password } = req.body; //
//   // validateif
//   if (!email || !password)
//     return res.status(400).json({ msg: "Not all fields have been entered." });
//   const user = await userModel.findOne({ Email: email });
//   if (!user)
//     return res
//       .status(400)
//       .json({ msg: "No account with this email has been registered." });
//   const isMatch = await bcrypt.compare(password, user.Password);
//   if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });
//   const token = jwt.sign({ id: user._id }, SECRET);
//console.log(__dirname)
//return <Redirect to ='/'></Redirect>

//   return res.redirect("../../index.html");
// } catch (err) {
//   res.status(500).json({ error: err.message });
