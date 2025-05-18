import { getUser } from "../service/auth.js";
async function restrictToLoggedInUser(req, res, next) {


       //1. req typically represents the request object in a web server framework (like Express.js in Node.js)
       //2. cookies is a property of the request object that contains all cookies sent by the client
       //3. uid is the specific cookie name being accessed (likely stands for "user ID")

       // When a user visits a website, their browser sends cookies associated with that domain in the HTTP request headers. On the server side, the web framework parses these cookies and makes them available through the request object.
       const userUid = req.cookies?.uid;

       //if uid does not exist it will redirect user to the login page
       if (!userUid) {
              return res.redirect("/login");
       }
       // now to check if user comes with uid is valid or not we will check using getUser() function from auth.js(service)

       const user = getUser(userUid);
       if (!user) {
              return res.redirect("/login");
       }

       req.user = user;
       next();
}

async function checkAuth(req, res, next) {


       //1. req typically represents the request object in a web server framework (like Express.js in Node.js)
       //2. cookies is a property of the request object that contains all cookies sent by the client
       //3. uid is the specific cookie name being accessed (likely stands for "user ID")

       // When a user visits a website, their browser sends cookies associated with that domain in the HTTP request headers. On the server side, the web framework parses these cookies and makes them available through the request object.
       const userUid = req.cookies.uid;

      
       // now to check if user comes with uid is valid or not we will check using getUser() function from auth.js(service)

       const user = getUser(userUid);
       
       req.user = user;
       next();
}

export { restrictToLoggedInUser ,checkAuth };