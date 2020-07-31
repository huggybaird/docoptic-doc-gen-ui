import { NgModule } from '@angular/core';
import {
    MatTabsModule
} from '@angular/material/tabs';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog'; 
import {  MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip'; 

@NgModule({
    imports: [MatTabsModule, MatSelectModule, MatFormFieldModule, MatIconModule, MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatTooltipModule  ],
    exports: [MatTabsModule, MatSelectModule, MatFormFieldModule, MatIconModule, MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatTooltipModule  ]
})

export class AngularMaterialModule { }