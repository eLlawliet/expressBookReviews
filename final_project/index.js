const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next){
    const authToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
    const secret = '9jsdagg0912kdi'; // Replace with your actual secret
    jwt.verify(authToken, secret, function (err, decoded) {
      if(err){
        return res.status(401).send({message: 'Authentication failed'});
      }
      req.userId = decoded.id; // Corrected from decoded.di to decoded.id
      next();
    });
  });
  
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/customer/auth", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
