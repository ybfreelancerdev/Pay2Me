import { Validators, FormControl, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';

export class CustomValidator extends Validators {

  public static nullCheckStringObj(data: any) {
    return data != null && data !== '' ? data.toString() : null;
  }

  public static emailValidation(control: FormControl) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,4}$/;
    return validate(control.value, regex);
  }

  public static passwordValidation(control: FormControl) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return validate(control.value, regex);
  }

  public static websiteValidation(control: FormControl) {
    const regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    return validate(control.value, regex);
  }

  public static numbersOnlyValidation(control: FormControl) {
    const regex = /^[0-9+-]{1,11}$/;
    return validate(control.value, regex);
  }

  public static integersandDecimalsOnlyValidation(control: FormControl) {
    const regex = /^(0\.[1-9]\d*|[1-9]\d*(\.\d+)?$)/;
    return validate(control.value, regex);
  }

  public static bankNumberValidation(control: FormControl) {
    const regex = /^\d{9,18}$/;
    return validate(control.value, regex);
  }

  public static otpValidation(control: FormControl) {
    const regex = /^[0-9]{6,6}$/;
    if (control.value) {
      return (!regex.test(control.value)) ? { pattern: { value: control.value } } : null;
    } else {
      return null;
    }
  }

  public static userNameValidation(control: FormControl) {
    const regex = /^[A-Za-z0-9_-]*$/;
    return validate(control.value, regex);
  }

  public static phoneNumberValidation(control: FormControl) {
    const regex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    return validate(control.value, regex);
  }

  public static fullNameValidation(control: FormControl) {
    const regex = /^[a-zA-Z\\s]+$/;
    return validate(control.value, regex);
  }

  public static nameValidation(control: FormControl) {
    const regex = /^[a-zA-Z ]+$/;
    return validate(control.value, regex);
  }

  public static cardnumberValidation(control: FormControl) {
    const regex = /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
    return validate(control.value, regex);
  }

  public static cvvcodeValidation(control: FormControl) {
    const regex = /^[0-9]{3,4}$/;
    return validate(control.value, regex);
  }

  public static expiredDateValidation(control: FormControl) {
    const regex = /((0[1-9]|1[0-2])\/[12]\d{3})/;
    return validate(control.value, regex);
  }

  public static ifsccodeValidation(control: FormControl) {
    const regex = /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/;
    return validate(control.value, regex);
  }

  public static ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl: any = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }


  public static oldPasswordValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl: any = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.oldPasswordValidator) {
        return;
      }
      if (control.value == matchingControl.value) {
        matchingControl.setErrors({ oldPasswordValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  public static forbiddenNamesValidator(names: any[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const index = names.findIndex(name => {
        return (new RegExp('\^' + name.meaning + '\$')).test(control.value);
      });
      return index < 0 ? { 'pattern': { value: control.value } } : null;
    };
  }

  public static convertToFormControl(absCtrl: AbstractControl | null): FormControl {
    const ctrl = absCtrl as FormControl;
    return ctrl;
  }

  public static validateImageExtension(fileName: string, osize: number) {
    let size;
    const validExtension = ['png', 'jpeg', 'jpg', 'gif'];
    const extension = fileName.substr(fileName.lastIndexOf('.') + 1);
    size = osize / 1048;
    size = size / 1048;
    if (validExtension.indexOf(extension.toLowerCase()) === -1) {
      return false;
    } else if (size > 2) {
      return false;
    } else {
      return true;
    }
  }

  public static websiteStringCheck(url: string) {
    const regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    if (regex.test(url)) {
      return false;
    }
    else {
      return true;
    }
  }
}

function validate(value: any, regex: any) {
  if (value) {
    return (!regex.test(value)) ? { pattern: { value: value } } : null;
  } else {
    return null;
  }
}