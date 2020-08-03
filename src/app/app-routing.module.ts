import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DocumentEditorComponent} from './components/document-editor/document-editor.component';
// import { HomeComponent } from './home/home.component';     // Add your component here
// import { AboutComponent } from './about/about.component';  // Add your component here


const routes: Routes = [
    { path: '', redirectTo: '/document-editor', pathMatch: 'full' }, // redirect
    { path: 'document-editor', component: DocumentEditorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }