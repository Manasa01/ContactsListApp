//sql connection
const sql = require("./db.js");
const async = require("async");
//constructor
const Contact = function(contact) {
  this.first_name = contact.first_name;
  this.middle_name = contact.middle_name;
  this.last_name = contact.last_name;
  this.addresses = contact.addresses;
  this.phones = contact.phones;
  this.dates = contact.dates;
};

Contact.findById = (contactId, result) => {
  var newContact = {};
  sql.query(
    `SELECT * FROM CONTACT WHERE contact_id = ${contactId};
	 SELECT * FROM ADDRESS WHERE contact_id = ${contactId};
	 SELECT * FROM PHONE WHERE contact_id = ${contactId};
	 SELECT * FROM DATES WHERE contact_id = ${contactId} `,
    (err, res) => {
      if (err) {
        console.log("error", err);
        result(err, null);
        return;
      }

      if (
        res[0].length != 0 ||
        res[1].length != 0 ||
        res[2].length != 0 ||
        res[3].length != 0
      ) {
        console.log(res[0][0]);
        newContact.first_name = res[0][0].first_name;
        newContact.middle_name = res[0][0].middle_name;
        newContact.last_name = res[0][0].last_name;
        if (res[1].length) {
          newContact.addresses = res[1];
        } else {
          newContact.addresses = [];
        }
        if (res[2].length) {
          newContact.phones = res[2];
        } else {
          newContact.phones = [];
        }
        if (res[3].length) {
          newContact.dates = res[3];
        } else {
          newContact.dates = [];
        }
        console.log(newContact);
        result(null, newContact);
        return;
      }

      //not found Contact with the id
      result({ kind: "not_found" }, null);
    }
  );
};

Contact.getAll = (reqQuery, result) => {
  var limit = 0;
  if (reqQuery.$top !== undefined) {
    limit = parseInt(reqQuery.$top);
  }
  if (limit !== 0) {
    query = `SELECT * FROM CONTACT LIMIT ${limit};`;
    //query = `SELECT * FROM CONTACT WHERE contact_id IN (1, 2 ,3, 1022, 567);`;
  } else {
    query = "SELECT * FROM CONTACT;";
  }
  sql.query(query, (err, response) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    var finalResponse = [];
    async.eachOfSeries(
      response,
      (responseItem, index, callback) => {
        sql.query(
          `Select * FROM ADDRESS WHERE contact_id = ${responseItem.contact_id};
		  SELECT * FROM PHONE WHERE contact_id = ${responseItem.contact_id};
		  SELECT * FROM DATES WHERE contact_id = ${responseItem.contact_id}`,
          (err, res) => {
            if (err) {
              return callback(err);
            }

            if (res[0] === undefined) res[0] = [];
            if (res[1] === undefined) res[1] = [];
            if (res[2] === undefined) res[2] = [];

            finalResponse.push({
              contact_id: responseItem.contact_id,
              first_name: responseItem.first_name,
              middle_name: responseItem.middle_name,
              last_name: responseItem.last_name,
              addresses: res[0],
              phones: res[1],
              dates: res[2]
            });

            return callback();
          }
        );
      },
      err => {
        if (err) {
          result(err, null);
          return;
        }

        result(null, finalResponse);
        return;
      }
    );
  });
};
var distinct = (value, index, self) => {
  return self.indexOf(value) === index;
};
Contact.searchAll = (searchVal, result) => {
  //searchTerm = "'%" + searchTerm + "%'";

  var searchTerms = searchVal.replace("-", " ").split(" ");
  console.log(searchTerms);

  var searchResults = [];
  var finalResponse = [];
  async.eachOfSeries(
    searchTerms,
    (searchTerm, index, callback) => {
      searchTerm = "'%" + searchTerm + "%'";
      sql.query(
        `SELECT DISTINCT C.contact_id FROM CONTACT AS C LEFT JOIN PHONE AS P ON C.contact_id = P.contact_id LEFT JOIN ADDRESS AS A ON C.contact_id = A.contact_id LEFT JOIN DATES AS D ON C.contact_id = D.contact_id WHERE C.first_name LIKE ${searchTerm} OR C.middle_name LIKE ${searchTerm} OR C.last_name LIKE ${searchTerm} OR P.phone_type LIKE ${searchTerm} OR P.area_code LIKE ${searchTerm} OR P.phone_num LIKE ${searchTerm} OR A.address_type LIKE ${searchTerm} OR A.address LIKE ${searchTerm} OR A.city LIKE ${searchTerm} OR A.states LIKE ${searchTerm} OR A.zip LIKE ${searchTerm} OR D.date_type LIKE ${searchTerm} OR D.date_value LIKE ${searchTerm};`,
        (err, response) => {
          if (err) {
            return callback(err);
          }
          response.forEach(element => {
            searchResults.push(element.contact_id);
          });

          console.log(searchResults);
          console.log(index);
          return callback();
        }
      );
    },
    err => {
      if (err) {
        console.log(err);
        result(err, null);
        return;
      }
      if(searchResults.length !== 0){
      var searchSet = searchResults.filter(distinct);
      var searchString = "(";
      searchSet.forEach(element => {
        searchString = searchString + element + ","    
      });
      searchString = searchString.substring(0,searchString.length-1) + ")"
      console.log(searchString);
      //get all the distinct values
      sql.query(
        `SELECT * FROM CONTACT WHERE contact_id IN ${searchString};`,
        
        (err, response) => {
          if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
          }
          
          async.eachOfSeries(
            response,
            (responseItem, index, callback) => {
              sql.query(
                `Select * FROM ADDRESS WHERE contact_id = ${responseItem.contact_id};
               SELECT * FROM PHONE WHERE contact_id = ${responseItem.contact_id};
               SELECT * FROM DATES WHERE contact_id = ${responseItem.contact_id}`,
                (err, res) => {
                  if (err) {
                    return callback(err);
                  }

                  if (res[0] === undefined) res[0] = [];
                  if (res[1] === undefined) res[1] = [];
                  if (res[2] === undefined) res[2] = [];

                  finalResponse.push({
                    contact_id: responseItem.contact_id,
                    first_name: responseItem.first_name,
                    middle_name: responseItem.middle_name,
                    last_name: responseItem.last_name,
                    addresses: res[0],
                    phones: res[1],
                    dates: res[2]
                  });

                  return callback();
                }
              );
            },
            err => {
              if (err) {
                result(err, null);
                return;
              }

              result(null, finalResponse);
              return;
            }
          );
        }
      );}
      else{
        result(null, finalResponse);
              return;
      }
    }
  );
};

Contact.create = (newContact, result) => {
  var newContactName = {
    first_name: newContact.first_name,
    middle_name: newContact.middle_name,
    last_name: newContact.last_name
  };

  var id = 0;

  async.series(
    [
      function(callback0) {
        if (
          newContactName.first_name !== "" ||
          newContactName.middle_name !== "" ||
          newContactName.last_name !== ""
        ) {
          sql.query("INSERT INTO CONTACT SET ?", newContactName, (err, res) => {
            if (err) {
              console.log("error: ", err);

              return callback0(err, null);
            }
            id = res.insertId;
            return callback0(null, "contact created");
          });
        } else return callback0(null, "nothing to insert");
      },

      function(callback1) {
        if (newContact.addresses.length != 0) {
          async.eachOfSeries(
            newContact.addresses,
            (addressItem, index, callback) => {
              if (id !== 0) {
                addressItem.contact_id = id;
              }
              sql.query(
                "INSERT INTO ADDRESS SET ?",
                addressItem,
                (err, res) => {
                  if (err) {
                    return callback(err);
                  }
                  return callback();
                }
              );
            },
            err => {
              if (err) {
                return callback1(err, null);
              }

              return callback1(null, "Address inserted");
            }
          );
        } else return callback1(null, "nothing to insert");
      },
      function(callback2) {
        if (newContact.phones.length != 0) {
          async.eachOfSeries(
            newContact.phones,
            (phoneItem, index, callback) => {
              if (id !== 0) {
                phoneItem.contact_id = id;
              }
              sql.query("INSERT INTO PHONE SET ?", phoneItem, (err, res) => {
                if (err) {
                  return callback(err);
                }
                return callback();
              });
            },
            err => {
              if (err) {
                return callback2(err, null);
              }
              return callback2(null, "Phone numbers inserted");
            }
          );
        } else return callback2(null, "nothing to insert");
      },
      function(callback3) {
        if (newContact.dates.length != 0) {
          async.eachOfSeries(
            newContact.dates,
            (dateItem, index, callback) => {
              if (id !== 0) {
                dateItem.contact_id = id;
              }
              sql.query("INSERT INTO DATES SET ?", dateItem, (err, res) => {
                if (err) {
                  return callback(err);
                }
                return callback();
              });
            },
            err => {
              if (err) {
                return callback3(err, null);
              }
              return callback3(null, "Dates added");
            }
          );
        } else return callback3(null, "nothing to insert");
      }
    ],
    function(err, results) {
      console.log(results);
      result(null, { id: id, newContactName });
    }
  );
};

Contact.update = (id, newContact, result) => {
  console.log(newContact);
  var newContactName = {
    first_name: newContact.first_name,
    middle_name: newContact.middle_name,
    last_name: newContact.last_name
  };

  sql.query(
    "UPDATE CONTACT SET first_name = ?, middle_name = ?, last_name = ? WHERE contact_id = ?",
    [newContact.first_name, newContact.middle_name, newContact.last_name, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Contact with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated contact: ", { newContactName });
      async.series(
        [
          function(callback1) {
            if (newContact.addresses.length != 0) {
              async.eachOfSeries(
                newContact.addresses,
                (addressItem, index, callback) => {
                  sql.query(
                    "UPDATE ADDRESS SET address_type = ?, address =? , city =?, states =?, zip =? WHERE address_id = ? AND contact_id = ?",
                    [
                      addressItem.address_type,
                      addressItem.address,
                      addressItem.city,
                      addressItem.states,
                      addressItem.zip,
                      addressItem.address_id,
                      id
                    ],
                    (err, res) => {
                      if (err) {
                        return callback(err);
                      }
                      if (res.affectedRows == 0) {
                        // not found Contact with the id
                        return callback({ kind: "not_found" });
                      }
                      return callback();
                    }
                  );
                },
                err => {
                  if (err) {
                    return callback1(err, null);
                  }
                  return callback1(null, "Addresses updated");
                }
              );
            } else return callback1(null, "nothing to update");
          },
          function(callback2) {
            if (newContact.phones.length != 0) {
              async.eachOfSeries(
                newContact.phones,
                (phoneItem, index, callback) => {
                  sql.query(
                    "UPDATE PHONE SET phone_type = ?, area_code = ? , phone_num = ? WHERE phone_id = ? AND contact_id = ?",
                    [
                      phoneItem.phone_type,
                      phoneItem.area_code,
                      phoneItem.phone_num,
                      phoneItem.phone_id,
                      id
                    ],
                    (err, res) => {
                      if (err) {
                        return callback(err);
                      }
                      if (res.affectedRows == 0) {
                        // not found Contact with the id

                        return callback({ kind: "not_found" });
                      }
                      return callback();
                    }
                  );
                },
                err => {
                  if (err) {
                    return callback2(err, null);
                  }
                  return callback2(null, "Phone numbers updated");
                }
              );
            } else return callback2(null, "nothing to update");
          },
          function(callback3) {
            if (newContact.dates.length != 0) {
              async.eachOfSeries(
                newContact.dates,
                (dateItem, index, callback) => {
                  sql.query(
                    "UPDATE DATES SET date_type = ?, date_value = ? WHERE date_id = ? AND contact_id = ?",
                    [
                      dateItem.date_type,
                      dateItem.date_value,
                      dateItem.date_id,
                      id
                    ],
                    (err, res) => {
                      if (err) {
                        return callback(err);
                      }
                      if (res.affectedRows == 0) {
                        // not found Contact with the id
                        return callback({ kind: "not_found" });
                      }
                      return callback();
                    }
                  );
                },
                err => {
                  if (err) {
                    return callback3(err, null);
                  }
                  return callback3(null, "Dates updated");
                }
              );
            } else return callback3(null, "nothing to update");
          }
        ],
        function(err, results) {
          console.log(results);
          result(null, { newContactName });
        }
      );
    }
  );
};

Contact.deleteContact = (id, result) => {
  sql.query("DELETE FROM CONTACT WHERE contact_id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Contact with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted contact");
    result(null, "deleted contact" + id);
    return;
  });
};
Contact.deleteAddress = (addresses, result) => {
  async.eachOfSeries(
    addresses,
    (addressItem, index, callback) => {
      sql.query(
        "DELETE FROM ADDRESS WHERE address_id = ? AND contact_id = ?",
        [addressItem.address_id, addressItem.contact_id],
        (err, res) => {
          if (err) {
            console.log(err);
            return callback(err);
          }
          if (res.affectedRows == 0) {
            // not found Contact with the id
            return callback({ kind: "not_found" });
          }
          console.log("deleted address: ", addressItem.address_id);
          callback();
        }
      );
    },
    err => {
      if (err) {
        console.log(err);
        result(err, null);
        return;
      }
      result(null, "deleted addresses");
      return;
    }
  );
};
Contact.deletePhone = (phones, result) => {
  async.eachOfSeries(
    phones,
    (phoneItem, index, callback) => {
      sql.query(
        "DELETE FROM PHONE WHERE phone_id = ? AND contact_id = ?",
        [phoneItem.phone_id, phoneItem.contact_id],
        (err, res) => {
          if (err) {
            console.log(err);
            return callback(err);
          }
          if (res.affectedRows == 0) {
            // not found Contact with the id
            return callback({ kind: "not_found" });
          }
          console.log("deleted phone: ", phoneItem.phone_id);
          callback();
        }
      );
    },
    err => {
      if (err) {
        console.log(err);
        result(err, null);
        return;
      }
      result(null, "deleted phone");
      return;
    }
  );
};
Contact.deleteDate = (dates, result) => {
  async.eachOfSeries(
    dates,
    (dateItem, index, callback) => {
      sql.query(
        "DELETE FROM DATES WHERE date_id = ? AND contact_id = ?",
        [dateItem.date_id, dateItem.contact_id],
        (err, res) => {
          if (err) {
            console.log(err);
            return callback(err);
          }
          if (res.affectedRows == 0) {
            // not found Contact with the id
            return callback({ kind: "not_found" });
          }
          console.log("deleted date: ", dateItem.date_id);
          callback();
        }
      );
    },
    err => {
      if (err) {
        console.log(err);
        result(err, null);
        return;
      }
      result(null, "deleted date");
      return;
    }
  );
};

module.exports = Contact;
