import { Component, ViewChild, OnInit, Inject, EventEmitter, Output, IterableDiffers  } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs'; 
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { CKEditor4 } from 'ckeditor4-angular/ckeditor';
import { LocalStorageService } from '../../services/local-storage.service';
import { DocumentService } from '../../services/document.service';
import {FormControl} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon'; 
import { TextPromptDialogComponent } from '../text-prompt-dialog/text-prompt-dialog.component';
import {MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
// import { SafeHtml } from "../../safe-html.pipe";

interface Document {
  folderName: string;
  documentName: string;
  innerHtml: string;
  jsonData: any;
}
interface DocumentList {
  folderName: string;
  documentName: string;
}

@Component({
  selector: 'app-document-editor',
  templateUrl: './document-editor.component.html',
  styleUrls: ['./document-editor.component.css']
})
export class DocumentEditorComponent implements OnInit {
  //innerHtml = 'Loading....'; 
  title = 'docoptic-gen-ui';
  htmlEditorVisible = true;
  folderList: string[] = ['Loan Agreement', 'Welcome Letter', 'Appraisal'];
  documentList: DocumentList[] = [
    {folderName: 'Loan Agreement',
      documentName: 'Letter Of Credit 1A'},
    {folderName: 'Loan Agreement',
      documentName: 'Letter Of Credit 2A'},
    {folderName: 'Welcome Letter',
      documentName: 'Welcome To PNC (Real Estate)'},
    {folderName: 'Welcome Letter',
      documentName: 'Welcome To PNC (Treasury)'}
    ];
  document: Document;
  // {folderName: 'Loan Agreement',
  //     documentName: 'Letter Of Credit 1A',
  //     innerHtml : '<p>Hello LoC</p>',
  //     jsonData: {one: 'two'}};
  selectedFolder: string;
  selectedDocument: string;
  filteredDocuments: DocumentList[]; // = this.documents.filter(t => t.folderName === this.selectedFolder);
  previewHtml: string;
  viewSourceHtml = false; 
  // @Output() jsonChange = new EventEmitter<any>();

  public jsonEditorOptions: JsonEditorOptions;

  localStorageChanges$ = this.localStorageService.changes$;

  @ViewChild(JsonEditorComponent, { static: false }) editor: JsonEditorComponent;



  constructor(private localStorageService: LocalStorageService,
              private documentService: DocumentService,
              private matDialog: MatDialog,
              private route: ActivatedRoute,
              private router: Router
    ) {
    this.jsonEditorOptions = new JsonEditorOptions();
    // this.jsonEditorOptions.modes =   ['code', 'text', 'tree', 'view']; // set all allowed modes
    // this.jsonEditorOptions.mainMenuBar.valueOf
    this.jsonEditorOptions.mode = 'code'; //set only one mode
    this.jsonEditorOptions.mainMenuBar = false;
  }

  ngOnInit(): void {
    this.folderList = this.localStorageService.get('folderList');
    if(this.folderList === null){
      this.folderList = [];
    }
    this.documentList = this.localStorageService.get('documentList');
    if(this.documentList === null){
      this.documentList = [];
    }

    this.route
    .queryParams
    .subscribe(params => {
      // Defaults to 0 if no query param provided.
      // this.page = +params['page'] || 0;
        console.log(params); // { order: "popular" } 

        if(params.selectedFolder !== undefined){
          console.log('loading folder');
          this.selectedFolder = params.selectedFolder;
          this.onFolderChange({value: params.selectedFolder});
        }

        if(params.selectedDocument !== undefined){
          console.log('loading document');
          this.selectedDocument = params.selectedDocument;
          this.onDocumentChange({value: params.selectedDocument});
        }
    });
    // this.route.queryParams
    //   .filter(params => params.order)
    //   .subscribe(params => {
    //     console.log(params); // { order: "popular" }
    //     this.selectedFolder = params.selectedFolder;
    //     this.selectedDocument = params.selectedDocument;
    //   }
    // );
    //this.innerHtml = this.localStorageService.get('documentTemplate');  // '<p>Hello, world! From Angular</p>';
    //console.log("doc:",this.innerHtml);
    // tslint:disable-next-line: max-line-length 
  }


  onFolderChange(ob): void {
    console.log('Folder changed...', ob.value);
    // if(this.selectedFolder === ob.value){
    //   console.log('Nothing changed:', this.selectedFolder, '>', ob.value);
    //   return; // nothing to change 
    // }
    this.selectedFolder = ob.value;
    this.filteredDocuments = this.documentList.filter(t => t.folderName === this.selectedFolder);
    this.selectedDocument = '';
    this.router.navigate(['/document-editor'],
      { queryParams: { selectedFolder: this.selectedFolder, selectedDocument: null},
      queryParamsHandling: 'merge' });

  }

  openFolderDialog(): void {
    console.log('Open Folder Add Dialog');
    this.selectedFolder = '';
    this.selectedDocument = '';
    console.log('selectedFolder', this.selectedFolder);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {title: 'folder name', message: 'please enter a folder name', inputValue: ''}
    const dialogRef = this.matDialog.open(TextPromptDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(value => {
      console.log(`Dialog sent: ${value}`); 
      if(value !== undefined && value !== ''){
        console.log(`Not Empty`);
        this.selectedFolder = value;
        this.folderList.push(value);
        this.localStorageService.set('folderList', this.folderList);
      }
      else{
        console.log(`Empty`);
        //this.selectedFolder = undefined;
      }
    });
  }

  onDocumentChange(ob): void {


    if(this.selectedDocument !== ob.value){
      console.log('**********************************************',this.selectedDocument, '>', ob.value);
      console.log('Document changed...',this.selectedDocument, '>', ob.value);
      if(this.document !==  undefined && this.editor !== undefined){
        console.log('Saving original document...', this.document.documentName);
        this.document.jsonData = JSON.parse(this.editor.getText());
        this.localStorageService.set(this.document.folderName + '_' + this.document.documentName + '_document', this.document);
      }
    }
    this.selectedDocument = ob.value;

    this.document = this.localStorageService.get(this.selectedFolder + '_' + this.selectedDocument + '_document');
    if(this.selectedDocument !== 'add_new'){
      this.router.navigate(['/document-editor'],
        { queryParams: { selectedDocument: this.selectedDocument },
        queryParamsHandling: 'merge' });
    }
  }

  openDocumentDialog(): void {
    console.log('Open Document Add Dialog');
    this.selectedDocument = '';
    this.htmlEditorVisible = false;
    console.log('selectedDocument',this.selectedDocument);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {title: 'document name', message: 'please enter a document name', inputValue: ''}
    const dialogRef = this.matDialog.open(TextPromptDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(value => {
      console.log(`Dialog sent: ${value}`); 
      if(value !== undefined && value !== ''){
        console.log(`Not Empty`);
        this.selectedDocument = value;
        this.documentList.push( {folderName: this.selectedFolder,
          documentName: this.selectedDocument});
        this.localStorageService.set('documentList', this.documentList);

        this.document = {folderName: this.selectedFolder,
          documentName: this.selectedDocument,
        innerHtml : `
        <p><img alt="pnc bank" src="https://1000logos.net/wp-content/uploads/2019/12/PNC-Bank-Logo.png" style="height:113px; width:200px" /></p>
        <h1>` + this.selectedDocument + `</h1>
        <p>
          Here is an example of how to populate the price of {{{exampleValue1}}} for the product.
          </p><p>
          Here is another <b>{{{exampleValue2}}}</b>
        </p>
        <p>
        {{{IF state IN [NY,PA,OH]}}}</p><p>

          Here is some verbiage specific to states NY, PA, OH
          </p><p>
          {{{END IF state}}}
          </p><p> 
          {{{##paragraph_number}}}.  This is the first paragraph
          </p><p>
          {{{##paragraph_number}}}.  This is the second paragraph
          </p><p>
          {{{##paragraph_number}}}.  This is the third paragraph
          </p><p>
          Here is an example of a list:
          </p><p>

          {{{FOR EACH loans}}}
          </p><p>

          Account number {{{loans.loanNumber}}}} has a balance of {{{loans.loanBalance}}} and matures on {{{loans.loanMaturity}}}
          </p><p>

          {{{END FOR EACH loans}}}
        </p>`,
        jsonData: {message: 'This is where you put the data that populates the template',
                  exampleValue1: '$200.99',
                  exampleValue2: 'Sally Smith',
                  state: 'OH',
                  loans:[
                    {loanNumber: '12345', loanBalance: '$125,000,000', loanMaturity: '6/30/2027'},
                    {loanNumber: '67890', loanBalance: '$33,599,421.45', loanMaturity: '1/1/2035'}
                  ]
                }};

        this.localStorageService.set(this.selectedFolder + '_' + this.selectedDocument + '_document', this.document);

        this.filteredDocuments = this.documentList.filter(t => t.folderName === this.selectedFolder);
        this.htmlEditorVisible = true;

        this.router.navigate(['/document-editor'],
        { queryParams: { selectedDocument: this.selectedDocument },
        queryParamsHandling: 'merge' });
      }
      else{
        console.log(`Empty`);
        //this.selectedFolder = undefined;
      }
    });
  }
  // jsonChangeEvent(event): void {
  //   // alert(event);
  //   this.jsonData = event;
  //   this.localStorageService.set('jsonSampleInput', this.jsonData);
  //   console.log("set json to",this.jsonData);
  //   console.log(event);
  // }
 saveJson(): void {
  console.log('Json Editor lost focus, SAVING...',  JSON.parse(this.editor.getText()));
  this.document.jsonData = JSON.parse(this.editor.getText());
  this.localStorageService.set(this.document.folderName + '_' + this.document.documentName + '_document', this.document);
 }

  jsonChangeEvent(): void {
    // alert(event);

    // console.log("set json to",  JSON.parse(this.editor.getText())) 
    // this.document.jsonData = JSON.parse(this.editor.getText());
    // this.localStorageService.set(this.selectedFolder + '_' + this.selectedDocument + '_document', this.document);

  }
  onTabChange(event: MatTabChangeEvent): void {
    // alert();

    // this.document.jsonData = JSON.parse(this.editor.getText());
    // this.localStorageService.set(this.selectedFolder + '_' + this.selectedDocument + '_document', this.document);
    // console.log(event);
    // console.log("Document is",  this.document.jsonData);
    if (event.index === 0){
      this.htmlEditorVisible = true;
    }
    else {
      this.htmlEditorVisible = false;
    }

    if(event.index === 2){
      // this.renderHtmlPreview();
      this.generateHtml();
    }

    // this.innerHtml = '<p>Tab changed</p>';
  }
  onDocumentTemplateChange( event: CKEditor4.EventInfo ): void {
    console.log( event.editor.getData() );
    //this.localStorageService.set('documentTemplate', event.editor.getData());

    this.localStorageService.set(this.selectedFolder + '_' + this.selectedDocument + '_document', this.document);
  }

  // renderHtmlPreview(): void{
  //   this.previewHtml = this.document.innerHtml;
  //   console.log(this.document.jsonData);
  //   for (var prop in this.document.jsonData) {
  //         console.log("Key:" + prop + ", Value:" +  this.document.jsonData[prop]);

  //         //Replace the token {{{jsonField}}}
  //         let strToken = '{{{' + prop + '}}}'; 
  //         this.previewHtml = this.previewHtml.replace(strToken, this.document.jsonData[prop]);

  //         //Verify IF statements {{{IF jsonField in [value1, value2]}}}
  //         // while (this.previewHtml.indexOf('{{{IF ' + prop + ' in') > 0) {
  //         //   acceptableValues = 
  //         // }

  //         //console.log("Value:" + this.document.jsonData[prop]);
  //     }
  //   //  this.document.jsonData.forEach(obj => {
  //   //       Object.entries(obj).forEach(([key, value]) => {
  //   //           console.log(`${key} ${value}`);
  //   //       });
  //   //       console.log('-------------------');
  //   //   });
  // }
  generateHtml(): void{
    this.previewHtml = "";

    this.documentService.generateHtml(this.document.innerHtml, this.document.jsonData)
    .subscribe((data: any) => {
      // console.log('**********************************************************');
      // console.log(data);
      // console.log('**********************************************************');
      const strMe  = '{\"html\":' + data + '}';
      // console.log('**********************************************************strMe');
      // console.log(strMe);
      // console.log('**********************************************************strMe');
      const myJson = JSON.parse(strMe);
      this.previewHtml = myJson.html;
      // this.previewHtml = data; 
    });
  }

  generatePdf(): void{
    console.log("Todo: generate a pdf using iText or python ")
    // this.documentService.getConnectionTest()
    // .subscribe((data: any) => {
    //   console.log('**********************************************************');
    //   console.log(data);
    //   console.log('**********************************************************');
    //     // heroesUrl: data.heroesUrl,
    //     // textfile:  data.textfile
    // });

    this.documentService.generatePdf(this.previewHtml,
      this.document.documentName + '.pdf',
      this.document.documentName,
      '12345')
    .subscribe((data: any) => {
      console.log('********************************************************** PDF');
      console.log(data);
      console.log('********************************************************** PDF');
      const pdf = new Blob([data], { type: 'application/pdf' });
      const filename = "test.pdf";
      window.open(URL.createObjectURL(data));
      // const file = new Blob([data], {type: 'application/pdf'});
      // const fileURL = URL.createObjectURL(file);
      // window.open(fileURL);
        // heroesUrl: data.heroesUrl,
        // textfile:  data.textfile
    });
  }

}
