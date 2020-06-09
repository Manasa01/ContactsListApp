import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import {ReactiveFormsModule} from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { FlashMessagesModule } from "angular2-flash-messages";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ContactsDisplayComponent } from './components/contacts-display/contacts-display.component';
import { ContactsAddComponent } from './components/contacts-add/contacts-add.component';
import { ContactsEditComponent } from './components/contacts-edit/contacts-edit.component';
import { NotfoundComponent } from './components/notfound/notfound.component';

import { ContactService } from "./services/contact.service";
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ContactsDisplayComponent,
    ContactsAddComponent,
    ContactsEditComponent,
    NotfoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FlashMessagesModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ContactService],
  bootstrap: [AppComponent]
})
export class AppModule { }
