import { UntypedFormGroup } from "@angular/forms";

export function RequiredChecked(controlName: string, otherControlName: string) {
  return (formGroup: UntypedFormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[otherControlName];

   
    if(matchingControl.value == true) {
      if(control.value == "") {
        control.setErrors({requiredChecked: undefined})
      } else {
        control.setErrors(null);
      }
    } else {
      control.setErrors(null);
    }
    
  }
}