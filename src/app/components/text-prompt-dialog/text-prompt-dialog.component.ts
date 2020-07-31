import { Component, OnInit, Inject } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {  MatInputModule } from '@angular/material/input';
export interface DialogData {
  title: string;
  message: string;
  valueInput: string;
}

@Component({
  selector: 'app-text-prompt-dialog',
  templateUrl: './text-prompt-dialog.component.html',
  styleUrls: ['./text-prompt-dialog.component.css']
})
export class TextPromptDialogComponent  {
  constructor(
    public dialogRef: MatDialogRef<AppComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
    // public dialogRef: MatDialogRef<AppComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {}

  onNoClick(): void {
    this.data.valueInput = '';
    this.dialogRef.close();
  }

}
