const express = require("express");
const path = require("path");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const PORT = process.env.PORT || 5500;
const SECRET = "MY_SECRET_KEY";
const passport = require("passport");
const fs = require("fs");
const flash = require("express-flash");
const session = require("express-session");
const mongoose = require("mongoose");
const validUsers = require("../src/models/studentsCommomSchema");
const bookNotFound = require("../src/models/bookNotFound");
const bookRecommend = require("../src/models/bookRecommend");
const databaseNotFound = require("../src/models/databaseNotFound");
const compliment = require("../src/models/compliments");
const complaintAndGrievance = require("../src/models/complaintAndGrievance");
const complaintAndSuggestionAdminSchema = require("../src/models/complaintAndGrievance");

const RegisteredUser = require("../src/models/userSchema");
const Reviews = require("../src/models/review");
const FacultyPublication = require("../src/models/facultyPublication");
const initializePassport = require("../passport_config");
const MongoStore = require("connect-mongo");
var isLoggedIn = false;
const multer = require("multer");

var user = new RegisteredUser();
var complaintAndSuggestionAdmin = new complaintAndSuggestionAdminSchema()

require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

/*connecting to database*************************/
// pwd:UPU9v2Z4wGaKRgF
const uri =
  "mongodb://aishvary000:UPU9v2Z4wGaKRgF@cluster0-shard-00-00.thedj.mongodb.net:27017,cluster0-shard-00-01.thedj.mongodb.net:27017,cluster0-shard-00-02.thedj.mongodb.net:27017/LibraryPortal?ssl=true&replicaSet=atlas-y144ya-shard-0&authSource=admin&retryWrites=true&w=majority";

//const uri = process.env.DB_STRING
console.log(uri);
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
    const user = await RegisteredUser.findOne({ Email: email });
    console.log("Caaling from " + email);
    if (user) console.log("Got");
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
const review = require("../src/models/review");
app.use(express.static("../../public"));
//const upload = multer({dest:'uploads'})
// const storage = multer.diskStorage({
//   destination:"uploads",
//   filename:(req.file,cb)
// })

/*defining storage for multer*/
const storageUserReviews = multer.diskStorage({
  destination: function (request, file, callback) {
    console.log(__dirname);
    callback(null, path.join(__dirname, "../../public/images/userReviews"));
  },

  //add back the extension
  filename: function (request, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});
/*upload parameters for multer*/
const uploadUserReviews = multer({
  storage: storageUserReviews,
});

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
/**...................................................... */
app.get("/", async (req, res) => {
  var facultyPublications = new Array();
  if (req.isAuthenticated) {
    var toDisplay = "";
    facultyPublications = await FacultyPublication.find()
      .sort({ created_at: -1 })
      .limit(4);

    console.log("Fine");
    if (req.user != null) {
      user = req.user[0];
      console.log(facultyPublications);
      userName = "Welcome, " + req.user[0].Name + " !";
      isLoggedIn = true;
      //FacultyPublications = getFacultyPublications()
      //console.log("OKAY"+user.Email)
      user.Name = "Welcome, " + user.Name + " !";
    }
    // if(req.user != null)
    //   toDisplay = "Welcome "+req.user[0].Email
    else {
      isLoggedIn = false;
      user.Name = "Login/Register";
      //toDisplay = "Login/Register"
      //userName = toDisplay
    }

    //res.locals.name = userName;
    res.render("pages/index.ejs", {
      User: user,
      LoggedIn: isLoggedIn,
      FacultyPublications: facultyPublications,
    });
  } else
    res.render("pages/index.ejs", {
      User: user,
      LoggedIn: isLoggedIn,
      FacultyPublications: facultyPublications,
    });
  // res.render("pages/uploadphoto.ejs")

  // res.redirect('../../index')
  //console.log(res.error)
  //res.redirect('../../views/pages/index.ejs')
  // app.set('view engine', 'ejs');
});
app.get("/uploadPhoto", (req, res) => {
  res.render("pages/uploadphoto.ejs");
});
app.get("/currentAwarenessServices",(req,res)=>{
  res.render("partials/currentAwarenessServices",{ User: user, LoggedIn: isLoggedIn });
})
app.get("/circulationService",(req,res)=>{
  res.render("partials/circulationService",{ User: user, LoggedIn: isLoggedIn });
})
app.get("/databaseNotFound", (req, res) => {
  res.render("partials/databasenotfound", { User: user, LoggedIn: isLoggedIn });
});
app.get("/researchTools", (req, res) => {
  res.render("partials/researchTools.ejs", {
    User: user,
    LoggedIn: isLoggedIn,
  });
});
app.get("/digitalLibraryService", (req, res) => {
  res.render("partials/digitalLibraryService", {
    User: user,
    LoggedIn: isLoggedIn,
  });
});
app.get("/referenceService", (req, res) => {
  res.render("partials/referenceServices", {
    User: user,
    LoggedIn: isLoggedIn,
  });
});
app.get("/libraryTeamMembers", (req, res) => {
  res.render("partials/libraryTeamMembers", {
    User: user,
    LoggedIn: isLoggedIn,
  });
});
app.get("/login", (req, res) => {
  //res.render('../../login.html')

  console.log("Getting here i am lgin");
  //console.log("hello " +userName)
  res.render("pages/login.ejs", { User: user, LoggedIn: isLoggedIn });

  // nextTick()
});
app.get("/userRegisterPage", (req, res) => {
  console.log("Getting here 1");
  res.render("pages/userRegister.ejs", { User: user, LoggedIn: isLoggedIn });
});
app.get("/borrowingprivileges", (req, res) => {
  res.render("partials/borrowingprivileges.ejs", {
    User: user,
    LoggedIn: isLoggedIn,
  });
});
app.get("/books", (req, res) => {
  res.render("partials/books.ejs", { User: user, LoggedIn: isLoggedIn });
});
app.get("/ebooks", (req, res) => {
  res.render("partials/ebooks.ejs", { User: user, LoggedIn: isLoggedIn });
});
app.get("/ill", (req, res) => {
  res.render("partials/ill.ejs", { User: user, LoggedIn: isLoggedIn });
});
app.get("/cddvds", (req, res) => {
  res.render("partials/cddvds.ejs", { User: user, LoggedIn: isLoggedIn });
});
app.get("/collectionExpanded", (req, res) => {
  res.render("partials/collectionExpanded.ejs", {
    User: user,
    LoggedIn: isLoggedIn,
  });
});
// hello cheking
app.get("/libdatabases", (req, res) => {
  res.render("partials/libdatabases.ejs", { User: user, LoggedIn: isLoggedIn });
});
app.get("/openAcessEbooks", (req, res) => {
  res.render("partials/openAcessEbooks.ejs", { User: user, LoggedIn: isLoggedIn });
})
app.get("/askus", (req, res) => {
  res.render("partials/askus.ejs", { User: user, LoggedIn: isLoggedIn });
});
app.get("/reviewinput", (req, res) => {
  res.render("partials/reviewinput.ejs", { User: user, LoggedIn: isLoggedIn });
});
app.get("/compliments", (req, res) => {
  res.render("partials/compliments.ejs", { User: user, LoggedIn: isLoggedIn });
});
app.get("/userReview", (req, res) => {
  res.render("partials/userReview.ejs", { User: user, LoggedIn: isLoggedIn });
});
app.get("/bookNotFound", (req, res) => {
  res.render("partials/booknotfound.ejs", { User: user, LoggedIn: isLoggedIn });
});
app.get("/complaintsAdmin", async (req, res) => {

  var complaintList = new Array();
  complaintList = await complaintAndSuggestionAdminSchema.find()
  res.render("partials/Admin/complaint_suggestion.ejs", { User: user, LoggedIn: isLoggedIn,complaintAndSuggestionAdmin:complaintList});
});
app.get("/facultypublications", (req, res) => {
  res.render("partials/facultypublications.ejs", {
    User: user,
    LoggedIn: isLoggedIn,
  });
});
app.post("/filterTask", async (req, res) => {
  console.log("here\n");
  var complaintList = new Array();
  var type =  req.body.type;
  var status = req.body.status;
  var numeric;
  if(status=="pending")
  {
    numeric=0;
  }
  else
  numeric=1;
  
  if(type=="default" && status=="default")
  {
    complaintList = await complaintAndSuggestionAdminSchema.find();
  }
  else if(type=="default")
  {
    complaintList = await complaintAndSuggestionAdminSchema.find({status:numeric})

  }
  else if(status=="default")
  {
    complaintList = await complaintAndSuggestionAdminSchema.find({type:type})
  }
  else
  complaintList = await complaintAndSuggestionAdminSchema.find({type:type,status:numeric})
  res.render("partials/Admin/complaint_suggestion.ejs", { User: user, LoggedIn: isLoggedIn,complaintAndSuggestionAdmin:complaintList});
});
app.get("/complaints", (req, res) => {
  res.render("partials/complaints.ejs", {
    User: user,
    LoggedIn: isLoggedIn,
  });
});
app.get("/askAbook", (req, res) => {
  res.render("partials/askabook.ejs", { User: user, LoggedIn: isLoggedIn });
});
app.post("/facultyPublication", async (req, res) => {
  const facultyName = req.body.facultyName;
  const title = req.body.title;
  const link = req.body.link;
  const fp = new FacultyPublication({
    facultyName: facultyName,
    titleOfPublication: title,
    link: link,
  });
  const fps = await fp.save();
  setUser(req);
  var fp1 = await FacultyPublication.find().sort({ created_at: -1 }).limit(4);
  console.log("OKAY" + user.Email);
  res.render("pages/index.ejs", {
    User: user,
    LoggedIn: isLoggedIn,
    FacultyPublications: fp1,
  });
});
app.post("/askAbook", async (req, res) => {
  const title = req.body.title;
  const author = req.body.author;
  const publisher = req.body.publisher;
  const year = req.body.year;
  const edition = req.body.edition;
  const bookRecommende = new bookRecommend({
    title: title,
    author: author,
    publisher: publisher,
    year: year,
    edition: edition,
  });
  const brs = await bookRecommende.save();
  setUser(req);
  var fp1 = await FacultyPublication.find().sort({ created_at: -1 }).limit(4);
  //console.log("OKAY"+user.Email)
  res.render("pages/index.ejs", {
    User: user,
    LoggedIn: isLoggedIn,
    FacultyPublications: fp1,
  });
});
app.post("/compliments", async (req, res) => {
  const explanation = req.body.explanation;
  const complimente = new compliment({
    explanation: explanation,
  });
  const cs = await complimente.save();
  setUser(req);
  var fp1 = await FacultyPublication.find().sort({ created_at: -1 }).limit(4);
  //console.log("OKAY"+user.Email)
  res.render("pages/index.ejs", {
    User: user,
    LoggedIn: isLoggedIn,
    FacultyPublications: fp1,
  });
});
app.post("/changeStatusComplaints", async (req, res) => {
  var status;
  
  if(req.body.checkbox)
  {
    status = 1;
  }
  else
  status = 0;
  //console.log("Id is : "+req.body.id)
  await complaintAndSuggestionAdminSchema.updateOne(
    
    {_id:req.body.id},
    { $set: {status:status}}
  )
  var complaintList = new Array();
  complaintList = await complaintAndSuggestionAdminSchema.find()
  res.render("partials/Admin/complaint_suggestion.ejs", { User: user, LoggedIn: isLoggedIn,complaintAndSuggestionAdmin:complaintList});
  
});
app.post("/databaseNotFound", async (req, res) => {
  const name = req.body.name;
  const title = req.body.title;
  const location = req.body.location;
  const databaseNotFoundSave = new databaseNotFound({
    Database_Name: name,
    Journal_title: title,
    location: location,
  });
  const dnfs = await databaseNotFoundSave.save();
  setUser(req);
  var fp1 = await FacultyPublication.find().sort({ created_at: -1 }).limit(4);
  //console.log("OKAY"+user.Email)
  res.render("pages/index.ejs", {
    User: user,
    LoggedIn: isLoggedIn,
    FacultyPublications: fp1,
  });
});
app.post("/bookNotFound", async (req, res) => {
  const title = req.body.title;
  const author = req.body.author;
  const accessionNumber = req.body.accessionNumber;
  const bookNotFoundSave = new bookNotFound({
    title: title,
    author: author,
    accessionNumber: accessionNumber,
  });
  const bnfs = await bookNotFoundSave.save();
  setUser(req);
  var fp1 = await FacultyPublication.find().sort({ created_at: -1 }).limit(4);
  //console.log("OKAY"+user.Email)
  res.render("pages/index.ejs", {
    User: user,
    LoggedIn: isLoggedIn,
    FacultyPublications: fp1,
  });
});
app.post("/complaints", async (req, res) => {
  const Name = req.body.inlineRadioOptions;
  const explanation = req.body.explanation;
  const type = getType(req);
  var complaintAndGrievancee = new complaintAndGrievance({
    explanation:explanation,
    complaintAndSuggestion:type,
    status:0,
    type:type

  });
  const cags = await complaintAndGrievancee.save();
  setUser(req);
  var fp1 = await FacultyPublication.find().sort({ created_at: -1 }).limit(4);
  //console.log("OKAY"+user.Email)
  res.render("pages/index.ejs", {
    User: user,
    LoggedIn: isLoggedIn,
    FacultyPublications: fp1,
  });
});
app.post("/userReview", uploadUserReviews.single("image"), async (req, res) => {
  try {
    console.log(req.file);
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const feedback = req.body.feedback;
    console.log("Feed back : " + feedback);
    const rev = new Reviews({
      firstName: firstName,
      lastName: lastName,
      email: email,
      feedback: feedback,
      image: req.file.filename,
    });

    const savedrev = await rev.save();
    if (req.isAuthenticated) {
      //console.log("Fine")
      if (req.user != null) {
        user = req.user[0];
        //userName = "Welcome, "+req.user[0].Name+" !"
        isLoggedIn = true;
        console.log("OKAY" + user.Email);
        user.Name = "Welcome, " + user.Name + " !";
      }
      // if(req.user != null)
      //   toDisplay = "Welcome "+req.user[0].Email
      else {
        isLoggedIn = false;
        user.Name = "Login/Register";
        //toDisplay = "Login/Register"
        //userName = toDisplay
      }
      console.log("user : " + user.Name);
      res.render("pages/index.ejs", { User: user, LoggedIn: isLoggedIn });
    } else {
      isLoggedIn = false;
      user.Name = "Login/Register";
      res.render("pages/index.ejs", { User: user, LoggedIn: isLoggedIn });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
//registering user
app.post("/userRegister", async (req, res) => {
  try {
    //console.log(req.file);
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;
    const username = req.body.username;
    const email = req.body.email;
    if(password.localeCompare(cpassword) != 0)
    {
      //console.log("HERE in mismatch\n")
      res.render('pages/error.ejs', { err_msg: "Password Mismatch"} );
    }
    // console.log("Email is : " + email);
    const user1 = await isValid(email);
    
    // var img = fs.readFileSync(req.file.path);
    // var encode_img = img.toString('base64');
    // var final_img = {
    //     contentType:req.file.mimetype,
    //     image:new Buffer(encode_img,'base64')
    // };
    // console.log("hello");
    if (user1) {
      // console.log("User is present");
      var existingUser = await RegisteredUser.findOne({ Email: email });
      if (existingUser)
        return res
          .status(400)
          .json({ msg: "An account with this email already exists." });
      // console.log("YEPE");
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
      const user = new RegisteredUser({
        Email: email,
        Password: passwordHash,
        Name: username,
        Type: "Student",
        //Image:final_img
      });
      const registeredUser = await user.save();

      res.render("pages/login.ejs", { User: user, LoggedIn: isLoggedIn });
      // } else {
      //   res.send("Password mismatch");
      // }
    } else {
      return res
        .status(400)
        .json({ msg: "Sorry only organization emails are allowed." });
    }
  } catch (error) {
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
async function isValid(email) {
  console.log(email);
  const user = await validUsers.findOne({ EMAIL: email });
  return user;
}
async function getFacultyPublications() {
  var list = [];
  FacultyPublication.find({}, function (err, data) {
    data.forEach(function (item, index) {
      // console.log(data)
      list.push(data);
    });
    //console.log(list.length)
    return list;
  });
}
function setUser(req) {
  if (req.isAuthenticated) {
    if (req.user != null) {
      user = req.user[0];
      isLoggedIn = true;
      console.log("OKAY" + user.Email);
      user.Name = "Welcome, " + user.Name + " !";
    } else {
      isLoggedIn = false;
      user.Name = "Login/Register";
    }
  } else {
    isLoggedIn = false;
    user.Name = "Login/Register";
    //res.render("pages/index.ejs", {User:user,LoggedIn:isLoggedIn});
  }
}
function getType(req)
{
  if(req.body.inlineRadioOptions=="Suggestions")
  return "suggestion";

  return "complaint"
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
