import { Injectable } from '@angular/core';
import { Observable, ObservableLike } from "rxjs";
import { of } from "rxjs";
import { Contact } from '../models/Contact';
import { Address } from '../models/Address';
import { Phone } from '../models/Phone';
import { Date } from '../models/Date';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}
@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contacts: Contact[];
  contactObservable: Observable<Contact[]>;

  getContactsUrl: string = "http://localhost:3000/contacts";
  getContactByIdUrl: string = "http://localhost:3000/contacts/";
  postContactUrl: string = "http://localhost:3000/contact";
  deleteUrl: string = "http://localhost:3000/contacts/";
  modifyUrl: string = "http://localhost:3000/contacts/";
  deleteDateUrl: string = "http://localhost:3000/contactsDates";
  deletePhoneUrl: string = "http://localhost:3000/contactsPhones";
  deleteAddressesUrl: string = "http://localhost:3000/contactsAddresses";
  searchUrl: string = "http://localhost:3000/contactsSearch/";
  constructor(private http: HttpClient) {

  }
  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.getContactsUrl);
  }
  getContact(id: number): Observable<Contact> {
    // console.log(`${this.getContactByIdUrl}${id}`);

    return this.http.get<Contact>(`${this.getContactByIdUrl}${id}`);
  }
  newContact(contact: Contact): Observable<Contact> {
    console.log(contact);
    return this.http.post<Contact>(this.postContactUrl, contact, httpOptions);
  }
  deleteContact(id: number):Observable<any> {
    // console.log(id);
    return this.http.delete(`${this.deleteUrl}${id}`, httpOptions);
  }
  modifyContact(contact: Contact): Observable<Contact> {
    // console.log("Contact modified" + contact);
    return this.http.put<Contact>(`${this.modifyUrl}${contact.contact_id}`, contact, httpOptions);
  }
  deleteAddresses(addressArr: Address[]): Observable<any> {
    // console.log(id);
    var addressJson = {
      addresses: addressArr
    }
    return this.http.post(this.deleteAddressesUrl, addressJson, httpOptions);
  }
  deletePhone(phoneArr: Phone[]): Observable<any> {
    // console.log(id);
    var phonesJson = { phones: phoneArr };
    return this.http.post(this.deletePhoneUrl, phonesJson, httpOptions);
  }
  deleteDate(dateArr: Date[]): Observable<any> {
    // console.log(id);
    var datesJson = {
      dates: dateArr
    }
    // console.log(datesJson);
    return this.http.post(this.deleteDateUrl, datesJson, httpOptions);
  }

  searchContacts(searchTerm: string): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.searchUrl}${searchTerm}`);

  }
}
