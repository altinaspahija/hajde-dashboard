import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormBuilder, UntypedFormGroup, Validators, FormGroupName } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { from, Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import * as swal from "sweetalert2";
import { MustMatch } from '../../validators/must-math.validators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  private password = new UntypedFormControl('', [Validators.required, Validators.minLength(8)]);
  private comparePassword = new UntypedFormControl('', [Validators.required, Validators.minLength(8)]);
  public changePasswordFormGroup: UntypedFormGroup;
  public submitted = false;
  private unsubscribeAll: Subject<any> = new Subject<any>();
  private token:any;
  constructor(private changePasswordFormBuilder: UntypedFormBuilder, private router: Router, private authService: AuthService , private activeRoute: ActivatedRoute) {
    this.activeRoute.paramMap.subscribe(params => { 
      this.token = params.get("token");
    });

    this.changePasswordFormGroup = changePasswordFormBuilder.group({
      password: this.password,
      comparePassword: this.comparePassword
    }, {
      validators: MustMatch('password', 'comparePassword')
    });
  }

  ngOnInit(): void {
  }

  get getChangePasswordForm():any {return this.changePasswordFormGroup.controls;}

  changePassowrd() {
    this.submitted = true;
   if(this.changePasswordFormGroup.valid) {
    const data = {
      "newPassword": this.changePasswordFormGroup.get("password").value,
      "newPasswordConfirm": this.changePasswordFormGroup.get("comparePassword").value,
    }
    
    this.authService.resetPasswordApi(data, this.token)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data:any) => {
        swal.default.fire("Sukses", "Fjalëkalimi u ndryshua me sukses", 'success');
        this.router.navigate([""]);
      }, (error: any) => {
        swal.default.fire("Gabim", error.error.error, 'error');
      })
   }
  }

}
