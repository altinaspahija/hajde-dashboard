import { UntypedFormGroup } from '@angular/forms';

export function DateValidator(controlName: string, matchingControlName: string) {
    return (formGroup: UntypedFormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if(control.errors && !control.errors.dateValidator ) {
            return;
        }

        if(control.value < matchingControl.value) {
            control.setErrors({dateValidator: true});
        } else {
            control.setErrors(null);
        }
    }
}