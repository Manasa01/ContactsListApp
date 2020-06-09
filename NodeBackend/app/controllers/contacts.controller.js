const Contact = require("../models/contacts.model.js");

//Retrieve all contacts
exports.findAll = (req, res) => {
  Contact.getAll(req.query, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Error occurred while retrieving contacts."
      });
    else res.send(data);
  });
};

//Retrieve single contact on contactId
exports.findOne = (req, res) => {
  Contact.findById(req.params.contactId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Contact with id ${req.params.contactId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Contact with id " + req.params.contactId
        });
      }
    } else {
      res.send(data);
    }
  });
};

//Retrieve single contact on contactId
exports.searchAll = (req, res) => {
  Contact.searchAll(req.params.search, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found data for search term ${req.params.search}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving data with search term" + req.params.search
        });
      }
    } else {
      console.log(data);
      res.send(data);
    }
  });
};

// Create and Save a new Contact
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Contact can not be empty!"
    });
  }

  // Create a Contact
  const contact = new Contact({
    first_name: req.body.first_name,
    middle_name: req.body.middle_name,
    last_name: req.body.last_name,
    addresses: req.body.addresses,
    phones: req.body.phones,
    dates: req.body.dates
  });

  // Save Contact in the database
  Contact.create(contact, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "An error occurred while creating the Contact."
      });
    else res.send(data);
  });
};
//Update an existing contact
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "contact can not be empty!"
    });
  }
  var contactVal = {
    first_name: req.body.first_name,
    middle_name: req.body.middle_name,
    last_name: req.body.last_name,
    addresses: req.body.addresses,
    phones: req.body.phones,
    dates: req.body.dates
  };
  Contact.update(req.params.contactId, new Contact(contactVal), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Contact with id ${req.params.contactId}.`
        });
      } else {
        res.status(500).send({
          message: "Error updating Contact with id " + req.params.contactId
        });
      }
    } else {
      res.send(data);
    }
  });
};

//Delete an existing contact
exports.delete = (req, res) => {
  Contact.deleteContact(req.params.contactId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Contact with id ${req.params.contactId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Contact with id " + req.params.contactId
        });
      }
    } else {
      res.send({
        message: `Contact ${req.params.contactId} was deleted successfully!`
      });
    }
  });
};

exports.deleteAddresses = (req, res) => {
  Contact.deleteAddress(req.body.addresses, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Record Not found`
        });
      } else {
        res.status(500).send({
          message: "Could not delete the addresses"
        });
      }
    } else {
      res.send({
        message: `Addresses were deleted successfully!`
      });
    }
  });
};

exports.deletePhones = (req, res) => {
  Contact.deletePhone(req.body.phones, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Record Not found`
        });
      } else {
        res.status(500).send({
          message: "Could not delete the phone numbers"
        });
      }
    } else {
      res.send({
        message: `Phone numbers were deleted successfully!`
      });
    }
  });
};

exports.deleteDates = (req, res) => {
  Contact.deleteDate(req.body.dates, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Record Not found`
        });
      } else {
        res.status(500).send({
          message: "Could not delete the dates"
        });
      }
    } else {
      res.send({
        message: `Dates were deleted successfully!`
      });
    }
  });
};
