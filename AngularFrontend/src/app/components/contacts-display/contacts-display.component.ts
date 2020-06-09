import { Component, OnInit } from '@angular/core';
import { Contact } from '../../models/Contact';
import { ContactService } from '../../services/contact.service';
import { Router } from "@angular/router";
import { FlashMessagesService } from "angular2-flash-messages";
@Component({
  selector: 'app-contacts-display',
  templateUrl: './contacts-display.component.html',
  styleUrls: ['./contacts-display.component.css']
})
export class ContactsDisplayComponent implements OnInit {
  contacts: Contact[];
  loaded: boolean;
  searchTerm: string = "";
  searchDisplayString:string = "";
  count : number = 0;
  constructor(private _contactService: ContactService, private router: Router,
    private flashMessage: FlashMessagesService) { }

  ngOnInit(): void {
    this._contactService.getContacts().subscribe(data => {
      this.contacts = data;
      this.loaded = true;
      this.count = this.contacts.length;
    });

  }

  onDeleteClick(id: number, name:string) {
    if (confirm(`Do you want to delete the contact: ${name} ?`)) {
      this._contactService.deleteContact(id).subscribe((value) => {
        console.log(value);
      });
      this.flashMessage.show("Contact removed", {
        cssClass: "alert-success",
        timeout: 4000
      });
      this.onSearch();
      // this.router.navigate(["/"]);
    }
  }

  onSearch() {
    this.contacts = [];
    this.loaded = false;
    if (this.searchTerm !== "") {
      this._contactService.searchContacts(this.searchTerm).subscribe(data => {
        console.log(data);
        this.contacts = data;
        this.loaded = true;
        this.count = this.contacts.length;
        this.searchDisplayString = "";
        var searchArr = this.searchTerm.replace("-"," ").split(" ");
        searchArr.forEach(searchVal => {
          this.searchDisplayString = this.searchDisplayString + "'" + searchVal + "' ";
        });
      });
      // console.log(this.searchTerm);}
    } else {
      this._contactService.getContacts().subscribe(data => {
        this.contacts = data;
        this.loaded = true;
        this.count = this.contacts.length;
        this.searchDisplayString ="";
      });

    }
  }

}
