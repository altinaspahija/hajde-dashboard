import { Component, OnInit } from '@angular/core';
import { from, Subject } from 'rxjs';
import { UntypedFormControl, UntypedFormBuilder, UntypedFormGroup, Validators, FormGroupName } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  public email = new UntypedFormControl('',[Validators.required, Validators.email]);
  public password = new UntypedFormControl('', [Validators.required, Validators.minLength(8)]);
  public loginFormGroup: UntypedFormGroup;
  public submittedLogin = false;
  public errorMessage;
  public qrCode;
  public otpCode;

  constructor(
    public loginFormBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private router: Router
  ) { 
    this.loginFormGroup = loginFormBuilder.group({
      email: this.email,
      password: this.password
    });
  }

  get getLoginFormGroup(): any {return this.loginFormGroup.controls; }

  public loginUser() {
    if(this.loginFormGroup.valid) {
      this.submittedLogin = true;
      const reqBody = {
        "email":this.loginFormGroup.get("email").value,
        "password":this.loginFormGroup.get("password").value
      }

      this.authService.authUser(reqBody)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data:any) => {
          if(data.status === "Sukses") {
            if (data.token) {
              this.authService.storeToken(data.token);
              const loggedinUser = this.authService.getUser();
              if(loggedinUser.role == "admin") { 
                this.router.navigate(["/admin/dashboard"]);
              }
              if(loggedinUser.role == "company") { 
                this.router.navigate(["/company/dashboard"]);
              } else if(loggedinUser.role == "restaurant") {
                this.router.navigate(["/restaurant/dashboard"]);
              }
            } else {  
              this.submittedLogin = false;
              if (data.next === 'otp') {
                this.router.navigate(["verification-login", {email: reqBody.email}]);
              } else if (data.next === 'setup-otp'){
                this.router.navigate(["verification-login", {email: reqBody.email, qrCode: data.qrCode, otpCode: data.otpCode}]);
              } else {
                this.errorMessage = "Ndodhi nje gabim !";
              }
            }
          } else {
            this.errorMessage = "Llogaria juaj nuk ekziston";
            this.submittedLogin = false;
          }
        }, err =>{
          this.errorMessage = err.error.error;
          this.submittedLogin = false;
        }, () => this.submittedLogin = false);
    } 
  }
}
