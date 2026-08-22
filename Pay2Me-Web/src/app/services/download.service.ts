import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
    providedIn: 'root'
})
export class DownloadService {

    constructor(private httpClient : HttpClient) {
    }

    public download(spinner: NgxSpinnerService, fileURL: string) {
        spinner.show();
        const fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
        this.httpClient.get(fileURL, {responseType: 'blob' as 'json'})
          .subscribe((res: any) => {
            const file = new Blob([res], {type: res.type});
 
            const blob = window.URL.createObjectURL(file);
            const link = document.createElement('a');
            link.href = blob;
            link.download = fileName;
 
            // Version link.click() to work at firefox
            link.dispatchEvent(new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window
            }));
 
            setTimeout(() => { // firefox
              window.URL.revokeObjectURL(blob);
              link.remove();
            }, 100);
            spinner.hide();
          });
    }
}