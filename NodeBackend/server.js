const express = require("express"); //--used to build the rest apis
const cors = require("cors");
const bodyParser = require("body-parser"); //--to parse the request and create a req.body object that will be accessed in the routes

const app = express();

//parse requests of content-type: application/json
app.use(bodyParser.json()); //--these are the body parser middlewares

//parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//allow OPTIONS on all resources
app.options('*', cors());

//simple route
app.get("/", cors(), (req, res) => {
  res.json({ message: "Welcome!" });
});

require("./app/routes/contacts.routes.js")(app);

//set port, listen for requests
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
