//this is basically a hash map that convert session Id to user and user to session Id
import jwt from "jsonwebtoken"
// const sessionIdtoUserMap = new Map();
const secret = "unil@1234"
function setUser(user){
       return jwt.sign({
              _id: user._id,
              email: user.email
       },secret);
}
function getUser(token){
       if(!token) return null
       return jwt.verify(token,secret);
}

export { setUser, getUser }; 