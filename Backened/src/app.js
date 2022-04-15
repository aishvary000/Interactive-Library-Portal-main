const express = require("express");
const path = require("path");
const ejs = require('ejs')
const dotenv = require('dotenv');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const PORT = process.env.PORT || 3000;
const SECRET = "MY_SECRET_KEY";
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const initializePassport = require("../passport_config")
initializePassport(passport,async email=>{
  const user = await userModel.findOne({ Email: email });
  return user

})
require("./db/conn");
dotenv.config();

const app = express();
app.use(express.static('../../public'));
app.set('views', path.join(__dirname, '../../views'))
app.set('view engine', 'ejs');

const userModel = require("../src/models/userSchema");
app.use(express.static('../../public'))
app.use(flash())
app.use(session({
  secret:"secret",
  resave:false,
  saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())


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

app.get("/", (req, res) => {
  // res.redirect('../../index')
  //console.log(res.error)
  //res.redirect('../../views/pages/index.ejs')
 // app.set('view engine', 'ejs');

  res.render('pages/index.ejs')
});

app.get("/login", (req, res) => {
  //res.render('../../login.html')
  res.render('pages/login.ejs')
  // nextTick()
});

app.get("/userRegister", (req, res) => {
  res.render('pages/userRegister.ejs')
});

//registering user
app.post("/userRegister", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;
    const username = req.body.username;
    const email = req.body.email;
    if (password == cpassword) {
      var existingUser = await userModel.findOne({ Email: email });
      if (existingUser)
        return res
          .status(400)
          .json({ msg: "An account with this email already exists." });
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
      const user = new userModel({
        Email: email,
        Password: passwordHash,
        Name: username,
      });
      const registeredUser = await user.save();
      res.status(201).sendFile(path.join(__dirname, "../../index.html"));
    } else {
      res.send("Password mismatch");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

// Login
app.post("/login", passport.authenticate('local',{
  
  successRedirect:'/',
  failureRedirect:'../../views/pages/login.ejs',
  failureFlash:true
}))

  
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

