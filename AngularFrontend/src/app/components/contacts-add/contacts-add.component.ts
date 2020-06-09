import { Component, OnInit, ViewChild } from '@angular/core';
import { ContactService } from "../../services/contact.service";
import { Contact } from "../../models/Contact";
import { Router } from "@angular/router";
import { FlashMessagesService } from "angular2-flash-messages";
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ValueTransformer } from '@angular/compiler/src/util';
@Component({
  selector: 'app-contacts-add',
  templateUrl: './contacts-add.component.html',
  styleUrls: ['./contacts-add.component.css']
})
export class ContactsAddComponent implements OnInit {
  contact: Contact = {
    first_name: "",
    middle_name: "",
    last_name: "",
    addresses: [],
    phones: [],
    dates: []
  };
  contacts: Contact;
  @ViewChild("contactForm", { static: false }) form: any;
  constructor(private flashMessage: FlashMessagesService, private contactService: ContactService,
    private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.contacts =
      this.contact;
    this.addAddress();
    this.addDate();
    this.addPhone();
  }

  addAddress(): void {
    this.contacts.addresses.push({
      contact_id: 0,
      address_type: '',
      address: '',
      city: '',
      states: '',
      zip: 0
    });
  }

  deleteAddress(i: number) {

    this.contacts.addresses.splice(i, 1);
  }

  //

  addPhone(): void {
    this.contacts.phones.push(
      {
        contact_id: 0,
        phone_type: "",
        area_code: 0,
        phone_num: 0
      }
    );
  }
  deletePhone(i: number) {
    this.contacts.phones.splice(i, 1);
  }

  //

  addDate(): void {
    this.contacts.dates.push({
      contact_id: 0,
      date_type: "",
      date_value: ""
    });
  }
  deleteDate(i: number) {

    this.contacts.dates.splice(i, 1);
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
      value.addresses = [];
      value.phones = [];
      value.dates = [];
      //add address to contact
      var checkItemArr = this.contact.addresses;
      checkItemArr.forEach(checkItem => {
        if (checkItem.address_type !== "" || checkItem.address !== "" || checkItem.city !== "" || checkItem.states !== "" || checkItem.zip !== 0) {
          value.addresses.push(checkItem);
        }
      });


      //add phones to contact
      var phoneCheckArr = this.contact.phones;
      phoneCheckArr.forEach(phoneCheck => {
        if (phoneCheck.phone_type !== "" || phoneCheck.area_code !== 0 || phoneCheck.phone_num !== 0) {
          value.phones.push(phoneCheck);
        }

      });

      //add dates to contact
      var datesCheckArr = this.contact.dates;
      datesCheckArr.forEach(datesCheck => {
        if (datesCheck.date_type !== "" || datesCheck.date_value !== "") {
          value.dates.push(datesCheck);
        }
      });

      //Add new contact
      this.contactService.newContact(value).subscribe(contact => { console.log(contact) });
      //Show message
      this.flashMessage.show("Contact added", {
        cssClass: "alert-success",
        timeout: 4000
      });
      //Redirect to dashboard
      this.router.navigate(["/"]);
    }
  }

}
