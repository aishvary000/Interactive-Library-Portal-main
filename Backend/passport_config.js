const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')


function initialize(passport,getUserByEmail,getUserById)
{
    const authenticateUser = async (email,password,done)=>{
        const user = await getUserByEmail(email)
        //console.log("No found")
        if(user == null)
        {
           // console.log("No found")
            return done(null,false,{message:"No user with that email"}) //error,userFound,
        }
        try{
          //  console.log("User found: "+user)
            console.log(password+":"+user.Password)
            if(await bcrypt.compare(password,user.Password))
            {
               // console.log("User found: "+user.Email)
                return done(null,user)
            }
            else{
                //console.log("Password")
                return done(null,false,{message:'Password Incorrect'})
            } 
        }
        catch(e){
            //console.log("No found")
            return done(e)
        }
    }
    passport.use(new localStrategy({
        usernameField:'email'
    },authenticateUser))
    //console.log("No found again")
    passport.serializeUser((user,done)=>done(null,user.id))
    passport.deserializeUser(async (id,done)=>{
        const user = await getUserById(id)
        return done(null,user)
    })
}
module.exports = initialize