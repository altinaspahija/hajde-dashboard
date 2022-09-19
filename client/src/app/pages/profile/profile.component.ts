import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormBuilder, UntypedFormGroup, Validators, FormGroupName } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { from, Subject } from 'rxjs';
import { Router } from '@angular/router';
import * as swal from "sweetalert2";
import { MustMatch } from '../../validators/must-math.validators';
import { MustNotMatch } from '../../validators/must-not-mach.validators';
import { AccountService } from "../../services/account.service";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  // Change password
  private password = new UntypedFormControl('', [Validators.required, Validators.minLength(8)]);
  private oldPassword = new UntypedFormControl('', [Validators.required, Validators.minLength(8)]);
  private comparePassword = new UntypedFormControl('', [Validators.required, Validators.minLength(8)]);
  public changePasswordFormGroup: UntypedFormGroup;
  public submitted = false;

  // Update info
  private name = new UntypedFormControl('', [Validators.required]);
  private lastName = new UntypedFormControl('', [Validators.required]);
  public userFormGroup:UntypedFormGroup;
  public submittedUser = false;

  public id:any;

  private unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private changePasswordFormBuilder: UntypedFormBuilder, 
    private userFormBuilder: UntypedFormBuilder, 
    private accountService: AccountService, 
    private authService: AuthService
    ) { 

      this.id = authService.getUser()._id;
      
      this.userFormGroup = userFormBuilder.group({
        name:  this.name,
        lastName: this.lastName
      });

      this.getUser();

      this.changePasswordFormGroup = changePasswordFormBuilder.group({
        oldPassword: this.oldPassword,
        password: this.password,
        comparePassword: this.comparePassword,
      }, {
        validators: [
          MustMatch('password', 'comparePassword'),
          MustNotMatch('oldPassword','password')
        ]
      });
  }

  get getChangePasswordForm():any {return this.changePasswordFormGroup.controls;}
  get getUserForm():any {return this.userFormGroup.controls;}

  changePassowrd() {
    this.submitted = true;
     if(this.changePasswordFormGroup.valid) {
      const data = {
        "oldPassword": this.changePasswordFormGroup.get("oldPassword").value,
        "password": this.changePasswordFormGroup.get("password").value
      }
  
      this.accountService.changePassword(data)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data:any) => {
          swal.default.fire("Sukses", "Fjalëkalimi u ndryshua me sukses", 'success');
          this.changePasswordFormGroup.reset();
          this.submitted = false;
        }, (error: any) => {
          swal.default.fire("Gabim", error.error.error, 'error');
        })
     }

  }

  ngOnInit(): void {
  }

  getUser() {
    this.accountService.getAccountById(this.id)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe(data => {
            this.name.setValue(data.account.firstName);
            this.lastName.setValue(data.account.lastName);
        })
  }

  updateInfo() {
      this.submittedUser = true;
      const data = {
        firstName:this.userFormGroup.get("name").value,
        lastName:this.userFormGroup.get("lastName").value
      }
      this.accountService.updateUser(data)
      .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data:any) => {
          swal.default.fire("Sukses", "Informatat e juaj jan ndryshuar", 'success');
          this.changePasswordFormGroup.reset();
          this.submitted = false;
          this.getUser();
        }, (error: any) => {
          swal.default.fire("Gabim", error.error.error, 'error');
        })
  }

}
