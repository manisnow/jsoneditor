import {NgModule}  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JsoneditorComponent } from '../jsoneditor/jsoneditor.component';
const routes: Routes = [
  { path : '', component : JsoneditorComponent }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
