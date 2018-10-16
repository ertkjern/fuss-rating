/**
 * Created by orjanertkjern on 02/05/2017.
 */
import {Injectable} from '@angular/core';
import {FormControl} from '@angular/forms';

@Injectable()
export class ValidationService {

  constructor() {
  }

  emailValidator(control: FormControl) {
    const EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    if (control.value !== '' && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
      return {'incorrectMailFormat': true};
    }
    return null;
  }
}
