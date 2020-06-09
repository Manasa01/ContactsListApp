import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HeaderComponent } from './components/header/header.component';
import { ContactsDisplayComponent } from './components/contacts-display/contacts-display.component';
import { ContactsAddComponent } from './components/contacts-add/contacts-add.component';
import { ContactsEditComponent } from './components/contacts-edit/contacts-edit.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { from } from 'rxjs';
const routes: Routes = [
  { path: "", component: ContactsDisplayComponent },
  { path: "add", component: ContactsAddComponent },
  { path: "modify/:id", component: ContactsEditComponent },
  { path: "**", component: NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
