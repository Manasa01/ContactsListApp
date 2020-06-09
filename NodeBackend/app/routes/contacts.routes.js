module.exports = app => {
  const contact = require("../controllers/contacts.controller.js");
  const cors = require("cors");

  //Get or Retrieve all Contacts
  app.get("/contacts", cors(), contact.findAll);

  //Get a single Contact with contactId
  app.get("/contacts/:contactId", cors(), contact.findOne);
  
   //Get search list
   app.get("/contactsSearch/:search", cors(), contact.searchAll);

  //Create a new Contact
  app.post("/contact", cors(), contact.create);

  //Update an existing Contact
  app.put("/contacts/:contactId", cors(), contact.update);

  //Delete an existing Contact
  app.delete("/contacts/:contactId", cors(), contact.delete);

  //Delete an existing Address
  app.post("/contactsAddresses", cors(), contact.deleteAddresses);

  //Delete an existing phone number
  app.post("/contactsPhones", cors(), contact.deletePhones);

  //Delete an existing date
  app.post("/contactsDates", cors(), contact.deleteDates);
};
