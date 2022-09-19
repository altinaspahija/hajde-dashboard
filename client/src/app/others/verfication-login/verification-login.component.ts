import { Component, Input, OnInit } from "@angular/core";
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-verification-login',
    templateUrl: './verification-login.component.html',
    styleUrls: ['./verification-login.component.css']
  })
  export class VerificationLoginComponent implements OnInit {
      constructor(
          private fb: UntypedFormBuilder,
          private authService: AuthService,
          private router: Router,
          private route: ActivatedRoute,
          public domSanitizationService: DomSanitizer 
        ) {
          this.email = this.route.snapshot.params["email"];
          this.otpCode = this.route.snapshot.params["otpCode"];
          
          const qrCode = this.route.snapshot.params["qrCode"];
          if (qrCode) {
            const qrCodeDecoded = atob(qrCode);
            this.qrCode = this.domSanitizationService.bypassSecurityTrustResourceUrl(qrCodeDecoded);
          }
        }

    ngOnInit(): void {
        this.myForm = this.fb.group({
            code: new UntypedFormControl("", [Validators.required])
        });
    }

    public email: string;
    public qrCode: any;
    public otpCode: string;
    public myForm: UntypedFormGroup;
    public submitted: boolean;
    public error: string = "";

    onSubmit() {
        if(this.myForm.valid) {
          this.submitted = true;
          this.error = "";

            this.authService.verifyLoginCode(this.email, this.myForm.get("code").value, this.otpCode)
            .subscribe((data: any) => {
                if (data) {
                    this.authService.storeToken(data.token);
                    const loggedinUser = this.authService.getUser();
                    if(loggedinUser.role == "admin") {
                      this.router.navigate(["/admin/dashboard"]);
                    } else if(loggedinUser.role == "company") { 
                      this.router.navigate(["/company/dashboard"]);
                    } else if(loggedinUser.role == "restaurant") {
                      this.router.navigate(["/restaurant/dashboard"]);
                    }
                }
            }, (err: any) => {
              this.error = err.error.error;
              this.submitted = false;
            }, () => {
              this.submitted = false;
            });
        }
    }
  }