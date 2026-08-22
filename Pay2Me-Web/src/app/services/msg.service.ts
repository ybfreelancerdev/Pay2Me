import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MsgService {

    constructor(private toastr: ToastrService) {}

    success(message: string) {
        this.toastr.success(message, "Success!");
    }

    error(message: string) {
        this.toastr.error(message, "Error!");
    }

    warning(message: string) {
        this.toastr.warning(message, "Warning!");
    }

    info(message: string) {
        this.toastr.info(message, "Info!");
    }

    saving(message: string) {
        let sucessMsg = Swal.mixin({
            customClass : { popup : 'saving' },
            toast: true,
            icon: 'success',
            timer: 5000,
            title: 'General Title',
            position: 'top-right',
            showConfirmButton: false,
            timerProgressBar: false,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });
        sucessMsg.fire({
            title: message
        });
    }
}