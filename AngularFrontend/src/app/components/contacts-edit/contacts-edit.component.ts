import { Component, OnInit, ViewChild } from '@angular/core';
import { ContactService } from '../../services/contact.service';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Contact } from '../../models/Contact';
import { FlashMessagesService } from "angular2-flash-messages";
import { FormBuilder, FormControl } from '@angular/forms';
import { DatePipe, formatDate } from '@angular/common';

@Component({
  selector: 'app-contacts-edit',
  templateUrl: './contacts-edit.component.html',
  styleUrls: ['./contacts-edit.component.css']
})
export class ContactsEditComponent implements OnInit {
  id: number;
  contact: Contact;
  loaded: boolean = false;
  pipe = new DatePipe('en_US');
  @ViewChild("contactEditForm", { static: false }) form: any;

  constructor(private _contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute,
    private flashMessage: FlashMessagesService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    //Get id from url
    this.id = this.route.snapshot.params["id"];
    this._contactService.getContact(this.id).subscribe(data => {
      this.contact = data;
      //change display format
      for (var i = 0; i < this.contact.dates.length; i++) {
        this.contact.dates[i].date_value = this.pipe.transform(this.contact.dates[i].date_value, 'yyyy-MM-dd');

      }

      this.loaded = true;
    });
  }

  addAddress(): void {
    this.contact.addresses.push({
      contact_id: 0,
      address_type: '',
      address: '',
      city: '',
      states: '',
      zip: 0

    });
  }
  deleteAddress(i: number) {
    var checkItem = this.contact.addresses[i];
    if (checkItem.address_type === "" && checkItem.address === "" && checkItem.city === "" && checkItem.states === "" && checkItem.zip === 0) {
      this.contact.addresses.splice(i, 1);
    }
    else {
      if (confirm("Do you want to delete this address?")) {
        this._contactService.deleteAddresses([checkItem]).subscribe((value) => {
          console.log(value);
          this.flashMessage.show(value.message, {
            cssClass: "alert-success",
            timeout: 4000
          });
          this.contact.addresses.splice(i, 1);
        });

      }
    }
  }

  //

  addPhone(): void {
    this.contact.phones.push({
      contact_id: 0,
      phone_type: "",
      area_code: 0,
      phone_num: 0

    });
  }
  deletePhone(i: number) {
    var phoneCheck = this.contact.phones[i];
    if (phoneCheck.phone_type === "" && phoneCheck.area_code === 0 && phoneCheck.phone_num === 0) { this.contact.phones.splice(i, 1); }
    else {
      if (confirm("Do you want to delete this phone number?")) {
        this._contactService.deletePhone([this.contact.phones[i]]).subscribe((value) => {
          console.log(value);
          this.flashMessage.show(value.message, {
            cssClass: "alert-success",
            timeout: 4000
          });
        });
        this.contact.phones.splice(i, 1);
      }
    }
  }
  //

  addDate(): void {
    this.contact.dates.push({
      contact_id: 0,
      date_type: "",
      date_value: ""
    });

  }
  deleteDate(i: number) {
    var datesCheck = this.contact.dates[i];
    if (datesCheck.date_type === "" && datesCheck.date_value === "") { this.contact.dates.splice(i, 1); }
    else {
      if (confirm("Do you want to delete this date?")) {
        // console.log(this.dates.at(i).value);
        this._contactService.deleteDate([this.contact.dates[i]]).subscribe((value) => {
          console.log(value);
        });
        this.flashMessage.show("Date removed", {
          cssClass: "alert-success",
          timeout: 4000
        });
        this.contact.dates.splice(i, 1);
      }
    }


  }

  onSubmit({ value, valid }: { value: Contact; valid: boolean }) {
    if (!valid) {
      //Show error

      var message: string = `Please fill out the form correctly 
      - Delete the empty Addresses section if present\n
      - Delete the empty Phones section if present\n
      - Delete the empty Dates section if present`;

      this.flashMessage.show(message, {
        cssClass: "alert-danger",
        timeout: 10000
      });

      confirm(message);
    } else {
      //to find new records 
      var newContact: Contact = {
        first_name: "",
        middle_name: "",
        last_name: "",
        addresses: [],
        phones: [],
        dates: []
      };
      //add address to contacts
      for (var i = 0; i < this.contact.addresses.length; i++) {

        if (this.contact.addresses[i].contact_id === 0) {
          this.contact.addresses[i].contact_id = this.id;
          newContact.addresses.push(this.contact.addresses[i]);
        }
      }
      value.addresses = this.contact.addresses;

      //add phones to contact
      //add address to contacts
      for (var i = 0; i < this.contact.phones.length; i++) {

        if (this.contact.phones[i].contact_id === 0) {
          this.contact.phones[i].contact_id = this.id;
          newContact.phones.push(this.contact.phones[i]);
        }
      }
      value.phones = this.contact.phones;

      //add dates to contact
      for (var i = 0; i < this.contact.dates.length; i++) {

        if (this.contact.dates[i].contact_id === 0) {
          this.contact.dates[i].contact_id = this.id;
          newContact.dates.push(this.contact.dates[i]);
        }
      }
      value.dates = this.contact.dates;

      value.contact_id = this.id;
      console.log(value);
      //Edit contact
      this._contactService.modifyContact(value).subscribe(result => {
        console.log(result);
      });

      //insertNewRecords
      if (newContact.addresses.length !== 0 || newContact.phones.length !== 0 || newContact.dates.length !== 0) {
        newContact.contact_id = this.id;
        this._contactService.newContact(newContact).subscribe(result => {
          console.log(result);
        });
      }

      //Show message
      this.flashMessage.show("Contact modified", {
        cssClass: "alert-success",
        timeout: 4000
      });
      //Redirect to dashboard
      this.router.navigate(["/"]);
    }
  }
}
