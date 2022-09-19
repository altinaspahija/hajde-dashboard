import { Component, OnInit } from '@angular/core';
import { from, Subject } from 'rxjs';
import { UntypedFormControl, UntypedFormBuilder, UntypedFormGroup, Validators, FormGroupName } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { takeUntil } from 'rxjs/operators';
import * as swal from "sweetalert2";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  public email = new UntypedFormControl('',[Validators.required, Validators.email]);
  public forgotPasswordForm : UntypedFormGroup;
  public submittedLogin = false;
  public errorMessage;

  constructor(public loginFormBuilder: UntypedFormBuilder, private authService: AuthService, private router: Router) { 
    this.forgotPasswordForm = loginFormBuilder.group({
      email: this.email
    });
  }

  get getforgotPasswordFormGroup(): any {return this.forgotPasswordForm.controls; }

  public forgotPassword() {
    this.submittedLogin = true;
    if(this.forgotPasswordForm.valid) {
      const reqBody = {
        "email":this.forgotPasswordForm.get("email").value
      }

      this.authService.forgot_password(reqBody)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data:any) => {
          if(data  != false) {
            swal.default.fire("Sukses", "Email për ndryshim fjalëkalimi është derguar", 'success');
             this.router.navigate(["/"]);
          } else {
            this.errorMessage = "Llogaria juaj nuk ekziston"
          }
        }, err =>{
          this.errorMessage = err.error.error;
        });
    } 
  }

  ngOnInit(): void {
  }

}
