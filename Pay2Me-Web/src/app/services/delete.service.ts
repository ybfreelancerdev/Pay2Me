import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Utils } from '../utils/utils';
import { ApiService } from './api.service';
import { MsgService } from './msg.service';

@Injectable({
    providedIn: 'root'
})
export class DeleteService {

    constructor() {
    }

    public deleteRecord(api: ApiService, url: string, title: string, text: string,
        confirmTxt: string, msgService: MsgService, classFile: any) {
        Swal.fire({
            title: title != '' ? title : 'Are you sure?',
            text: text != '' ? text : 'You won\'t be able to revert this!',
            showCancelButton: true,
            confirmButtonColor: '#EDB200',
            cancelButtonColor: '#f44336',
            confirmButtonText: confirmTxt != '' ? confirmTxt : 'Yes, delete it!',
            icon: 'warning'
        }).then((result) => {
            if (result.value) {
                api.delete(url).subscribe(data => {
                    classFile.ngOnInit();
                    msgService.success(data.message !== null ? data.message : 'Record successfully deleted');
                },
                    error => {
                        msgService.error(Utils.validationError(error));
                    });
            }
        });
    }
}