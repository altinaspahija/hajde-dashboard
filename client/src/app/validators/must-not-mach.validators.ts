import { UntypedFormGroup } from '@angular/forms';

export function MustNotMatch(controlName: string, matchingControlName: string) {
    return (formGroup: UntypedFormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if(matchingControl.errors && !matchingControl.errors.mustMatch ) {
            return;
        }

        if(control.value == matchingControl.value) {
            matchingControl.setErrors({mustNotMatch: true});
        } else {
            matchingControl.setErrors(null);
        }
    }
}
