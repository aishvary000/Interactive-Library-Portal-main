const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport,getUserByEmail)
{
    const authenticateUser = async (email,password,done)=>{
        const user = getUserByEmail(email)
        console.log("No found")
        if(user == null)
        {
            console.log("No found")
            return done(null,false,{message:"No user with that email"}) //error,userFound,
        }
        try{
            console.log("User found: "+user.Email)
            if(await bcrypt.compare(password,user.Password))
            {
                console.log("User found: "+user.Email)
                return done(null,user)
            }
            else{
                return done(null,false,{message:'Password Incorrect'})
            } 
        }
        catch(e){
            console.log("No found")
            return done(e)
        }
    }
    passport.use(new localStrategy({
        usernameField:'Email'
    },authenticateUser))
    passport.serializeUser((user,done)=>{

    })
    passport.deserializeUser((id,done)=>{
        
    })
}
module.exports = initialize