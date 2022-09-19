import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormBuilder, UntypedFormGroup, Validators, FormGroupName, UntypedFormArray } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { from, Subject } from 'rxjs';
import { Router } from '@angular/router';
import * as swal from "sweetalert2";
import { MustMatch } from '../../validators/must-math.validators';
import { MustNotMatch } from '../../validators/must-not-mach.validators';
import { AccountService } from "../../services/account.service";
import { AuthService } from '../../services/auth.service';
import { CompanyService } from "../../services/company.service";
import { environment } from 'environments/environment';

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


  public company = new UntypedFormControl('', [Validators.required]);
  public description = new UntypedFormControl("", [Validators.required]);
  public phone = new UntypedFormControl("", [Validators.required]);
  public addresses = new UntypedFormArray([]);
  public currencyType = new UntypedFormControl("", [Validators.required]);
  public urlImage = new UntypedFormControl("");
  public url = new UntypedFormControl("", []);
  public deliveryTime = new UntypedFormControl("", [Validators.required]);
  public companyFormGroup: UntypedFormGroup;
  public submittedCompany = false;
  public errorMessage;
  public companyData;
  private companyId;
  public imageUrl;

  // Update info
  private name = new UntypedFormControl('', [Validators.required]);
  private lastName = new UntypedFormControl('', [Validators.required]);
  public userFormGroup:UntypedFormGroup;
  public submittedUser = false;

  public id:any;

  private unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    public companyFormBuilder: UntypedFormBuilder, 
    private companyService: CompanyService,
    private changePasswordFormBuilder: UntypedFormBuilder, 
    private userFormBuilder: UntypedFormBuilder, 
    private accountService: AccountService, 
    private authService: AuthService
    ) { 

      this.id = authService.getUser()._id;
      this.companyId = authService.getUser().companyId;
      
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

      this.reload();
      this.companyFormGroup = companyFormBuilder.group({
        company: this.company,
        description: this.description,
        phone:this.phone,
        urlImage:this.urlImage,
        url:this.url,
        currencyType:this.currencyType,
        deliveryTime:this.deliveryTime,
        addresses: this.addresses
      });

     


      
  }

  get getChangePasswordForm():any {return this.changePasswordFormGroup.controls;}
  get getUserForm():any {return this.userFormGroup.controls;}
  get getCompanyFormGroup():any {return this.companyFormGroup.controls};

  reload() {
    this.companyService.getCompanyById(this.companyId)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data) => {
          this.companyData = data.company;
          this.company.setValue(this.companyData.company);
          this.description.setValue(this.companyData.description);
          this.phone.setValue(this.companyData.phone);
          this.url.setValue(this.companyData.url);
          this.currencyType.setValue(this.companyData.currency);
          this.deliveryTime.setValue(this.companyData.deliveryTime);

          for(let add of this.companyData.address) {
            this.addresses.push(new UntypedFormGroup({
              country : new UntypedFormControl(add.country, [Validators.required]),
              city: new UntypedFormControl(add.city, [Validators.required]),
              street: new UntypedFormControl(add.street, [Validators.required]),
              latitude: new UntypedFormControl(add.latitude, [Validators.required]),
              longitude: new UntypedFormControl(add.longitude, [Validators.required])
            }))
          }
        })
  }

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
    this.imageUrl = '';
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


  addCompany() {
    this.submittedCompany = true;
    const addresses = this.companyFormGroup.get('addresses') as UntypedFormArray;
    if(this.companyFormGroup.valid) {
      const reqBody = {
        company:{
          company: this.companyFormGroup.get("company").value,
          address: addresses.value,
          phone: this.companyFormGroup.get("phone").value,
          description: this.companyFormGroup.get("description").value,
          url: this.companyFormGroup.get("url").value,
          currency: this.companyFormGroup.get("currencyType").value
        }
      };
      if(this.companyFormGroup.get("urlImage").value) {
        reqBody.company['urlImage'] = this.companyFormGroup.get("urlImage").value
      }
      this.companyService.updateCompanyUser(reqBody)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data:any) => {
          swal.default.fire("Sukses","Kompania u ndryshua me sukses", 'success');
          this.reload()
        }, 
        error =>{
          swal.default.fire("Njoftim",error.error.error, 'warning');
        })
    }
  }

  public onFileChange(event, inputName) {
    const reader = new FileReader();
  
    if(event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);
        let fls ={}
        reader.onload = () => {
          
        this.companyFormGroup.patchValue({
          'urlImage':reader.result
        });
        }  
    }
  }

  get addressesList(): UntypedFormArray {
    return this.companyFormGroup.get('adresses') as UntypedFormArray;
  }

  addAddress(e) {
    e.preventDefault();
    this.addresses.push(new UntypedFormGroup({
      country : new UntypedFormControl("", [Validators.required]),
      city: new UntypedFormControl("", [Validators.required]),
      street: new UntypedFormControl("", [Validators.required]),
      latitude: new UntypedFormControl("", [Validators.required]),
      longitude: new UntypedFormControl("", [Validators.required])
    }))
  }

  removeAddress(e, i) {
    e.preventDefault();
    if(i != 0) {
      this.addresses.removeAt(i);
    }
  }

}
