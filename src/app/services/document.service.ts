import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  baseApiUrl = 'http://localhost:8000';
  constructor(private http: HttpClient) { }

  getConnectionTest(): any {
    return this.http.get(this.baseApiUrl + '/testConnectivity/');
  }

  generatePdf(htmlSource: string, targetPdfFileName: string, title: string, sourceReferenceNumber: string){

    const body = {
      htmlSource:  '<html><head></head><body>' + htmlSource + '</body></html>',
      targetPdfFileName:  targetPdfFileName,
      title: title,
      sourceReferenceNumber: sourceReferenceNumber
    };
    // const body = { htmlTemplate:  htmlTemplateS ,  jsonData:  jsonDataS};

    // let body = new HttpParams();
    // body = body.set('htmlTemplate', htmlTemplate);
    // body = body.set('jsonData', jsonData);
    console.log("******************************************************PDF Request Body");
    console.log(body);
    console.log("******************************************************PDF Requet Body");

    const options = {
      responseType: 'blob' as 'json',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    };
    return this.http.post<any>(this.baseApiUrl + '/document/generate/pdf/', body, options
    );
    // return this.http.post<any>(this.baseApiUrl + '/document/generate/pdf/', body, {observe: 'response', responseType: 'blob' as 'json'}
    // );
  }
  /** POST: generate html document */
  generateHtml(htmlTemplateS: string, jsonDataS: string): Observable<any> {
    // const headers = { 'Authorization': 'Bearer my-token', 'My-Custom-Header': 'foobar' };
    const body = { htmlTemplate: JSON.stringify(htmlTemplateS),  jsonData: JSON.stringify(jsonDataS) };
    // const body = { htmlTemplate:  htmlTemplateS ,  jsonData:  jsonDataS};

    // let body = new HttpParams();
    // body = body.set('htmlTemplate', htmlTemplate);
    // body = body.set('jsonData', jsonData);
    // console.log("******************************************************BODY")
    // console.log(body)
    // console.log("******************************************************BODY")
    return this.http.post<any>(this.baseApiUrl + '/document/generate/html/', body );
    // return this.http.post<any>(this.baseApiUrl + '/document/generate/html/', body, { headers });

    // return this.http.post<any>(this.baseApiUrl + '/document/generate/html/', {htmlTemplate: htmlTemplate)
    //   .pipe(
    //     catchError(this.handleError('addHero', hero))
    //   );
  }

}
