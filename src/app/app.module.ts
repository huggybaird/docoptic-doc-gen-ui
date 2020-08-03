import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatSelectModule } from '@angular/material/select';
// import { MatFormFieldModule } from '@angular/material/form-field';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { CKEditorModule } from 'ckeditor4-angular';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { TextPromptDialogComponent } from './components/text-prompt-dialog/text-prompt-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DocumentEditorComponent } from './components/document-editor/document-editor.component';
import { AppRoutingModule } from './app-routing.module'; // Added here
import { HttpClientModule } from '@angular/common/http';
import { SafeHtmlPipe } from './safe-html.pipe';

@NgModule({
  declarations: [
    AppComponent,
    TextPromptDialogComponent,
    DocumentEditorComponent,
    SafeHtmlPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    NgJsonEditorModule,
    MatDialogModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [TextPromptDialogComponent]
})
export class AppModule { }
