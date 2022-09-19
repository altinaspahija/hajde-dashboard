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
import { RestaurantsService } from '../../services/restaurants.service';
import { environment } from 'environments/environment';
import { RequiredChecked } from '../../validators/required-checked.validators'

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
  public logo = new UntypedFormControl("");
  public url = new UntypedFormControl("", []);
  public deliveryTime = new UntypedFormControl("", [Validators.required]);
  public companyFormGroup: UntypedFormGroup;
  public submittedCompany = false;
  public errorMessage;
  public companyData;
  private companyId;
  public imageUrl;


  public availabilityHanOpenHour = new UntypedFormControl("", []);
  public availabilityHanOpenMinutes = new UntypedFormControl("", []);
  public availabilityHanCloseHour = new UntypedFormControl("", []);
  public availabilityHanCloseMinutes = new UntypedFormControl("", []);
  public availabilityHanIsOpen = new UntypedFormControl(false, []);

  public availabilityMarOpenHour = new UntypedFormControl("", []);
  public availabilityMarOpenMinutes = new UntypedFormControl("", []);
  public availabilityMarCloseHour = new UntypedFormControl("", []);
  public availabilityMarCloseMinutes = new UntypedFormControl("", []);
  public availabilityMarIsOpen = new UntypedFormControl(false, []);

  public availabilityMerOpenHour = new UntypedFormControl("", []);
  public availabilityMerOpenMinutes = new UntypedFormControl("", []);
  public availabilityMerCloseHour = new UntypedFormControl("", []);
  public availabilityMerCloseMinutes = new UntypedFormControl("", []);
  public availabilityMerIsOpen = new UntypedFormControl(false, []);

  public availabilityEjnOpenHour = new UntypedFormControl("", []);
  public availabilityEjnOpenMinutes = new UntypedFormControl("", []);
  public availabilityEjnCloseHour = new UntypedFormControl("", []);
  public availabilityEjnCloseMinutes = new UntypedFormControl("", []);
  public availabilityEjnIsOpen = new UntypedFormControl(false, []);

  public availabilityPremOpenHour = new UntypedFormControl("", []);
  public availabilityPremOpenMinutes = new UntypedFormControl("", []);
  public availabilityPremCloseHour = new UntypedFormControl("", []);
  public availabilityPremCloseMinutes = new UntypedFormControl("", []);
  public availabilityPremIsOpen = new UntypedFormControl(false, []);

  public availabilityShtnOpenHour = new UntypedFormControl("", []);
  public availabilityShtnOpenMinutes = new UntypedFormControl("", []);
  public availabilityShtnCloseHour = new UntypedFormControl("", []);
  public availabilityShtnCloseMinutes = new UntypedFormControl("", []);
  public availabilityShtnIsOpen = new UntypedFormControl(false, []);

  public availabilityDielOpenHour = new UntypedFormControl("", []);
  public availabilityDielOpenMinutes = new UntypedFormControl("", []);
  public availabilityDielCloseHour = new UntypedFormControl("", []);
  public availabilityDielCloseMinutes = new UntypedFormControl("", []);
  public availabilityDielIsOpen = new UntypedFormControl(false, []);

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
    private authService: AuthService,
    private restaurantService: RestaurantsService
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
        logo:this.logo,
        url:this.url,
        currencyType:this.currencyType,
        deliveryTime:this.deliveryTime,
        addresses: this.addresses,

        availabilityHanOpenHour: this.availabilityHanOpenHour,
        availabilityHanOpenMinutes: this.availabilityHanOpenMinutes,
        availabilityHanCloseHour: this.availabilityHanCloseHour,
        availabilityHanCloseMinutes: this.availabilityHanCloseMinutes,
        availabilityHanIsOpen: this.availabilityHanIsOpen,
  
        availabilityMarOpenHour: this.availabilityMarOpenHour,
        availabilityMarOpenMinutes: this.availabilityMarOpenMinutes,
        availabilityMarCloseHour: this.availabilityMarCloseHour,
        availabilityMarCloseMinutes: this.availabilityMarCloseMinutes,
        availabilityMarIsOpen: this.availabilityMarIsOpen,
  
        availabilityMerOpenHour: this.availabilityMerOpenHour,
        availabilityMerOpenMinutes: this.availabilityMerOpenMinutes,
        availabilityMerCloseHour: this.availabilityMerCloseHour,
        availabilityMerCloseMinutes: this.availabilityMerCloseMinutes,
        availabilityMerIsOpen: this.availabilityMerIsOpen,
  
        availabilityEjnOpenHour: this.availabilityEjnOpenHour,
        availabilityEjnOpenMinutes: this.availabilityEjnOpenMinutes,
        availabilityEjnCloseHour: this.availabilityEjnCloseHour,
        availabilityEjnCloseMinutes: this.availabilityEjnCloseMinutes,
        availabilityEjnIsOpen: this.availabilityEjnIsOpen,
  
        availabilityPremOpenHour: this.availabilityPremOpenHour,
        availabilityPremOpenMinutes: this.availabilityPremOpenMinutes,
        availabilityPremCloseHour: this.availabilityPremCloseHour,
        availabilityPremCloseMinutes: this.availabilityPremCloseMinutes,
        availabilityPremIsOpen: this.availabilityPremIsOpen,
  
        availabilityShtnOpenHour: this.availabilityShtnOpenHour,
        availabilityShtnOpenMinutes: this.availabilityShtnOpenMinutes,
        availabilityShtnCloseHour: this.availabilityShtnCloseHour,
        availabilityShtnCloseMinutes: this.availabilityShtnCloseMinutes,
        availabilityShtnIsOpen: this.availabilityShtnIsOpen,
  
        availabilityDielOpenHour: this.availabilityDielOpenHour,
        availabilityDielOpenMinutes: this.availabilityDielOpenMinutes,
        availabilityDielCloseHour: this.availabilityDielCloseHour,
        availabilityDielCloseMinutes: this.availabilityDielCloseMinutes,
        availabilityDielIsOpen: this.availabilityDielIsOpen
      }, {
        validators: [
          RequiredChecked("availabilityHanOpenHour", "availabilityHanIsOpen"),
          RequiredChecked("availabilityHanOpenMinutes", "availabilityHanIsOpen"),
          RequiredChecked("availabilityHanCloseHour", "availabilityHanIsOpen"),
          RequiredChecked("availabilityHanCloseMinutes", "availabilityHanIsOpen"),
  
          RequiredChecked("availabilityMarOpenHour", "availabilityMarIsOpen"),
          RequiredChecked("availabilityMarOpenMinutes", "availabilityMarIsOpen"),
          RequiredChecked("availabilityMarCloseHour", "availabilityMarIsOpen"),
          RequiredChecked("availabilityMarCloseMinutes", "availabilityMarIsOpen"),
  
          RequiredChecked("availabilityMerOpenHour", "availabilityMerIsOpen"),
          RequiredChecked("availabilityMerOpenMinutes", "availabilityMerIsOpen"),
          RequiredChecked("availabilityMerCloseHour", "availabilityMerIsOpen"),
          RequiredChecked("availabilityMerCloseMinutes", "availabilityMerIsOpen"),
  
          RequiredChecked("availabilityEjnOpenHour", "availabilityEjnIsOpen"),
          RequiredChecked("availabilityEjnOpenMinutes", "availabilityEjnIsOpen"),
          RequiredChecked("availabilityEjnCloseHour", "availabilityEjnIsOpen"),
          RequiredChecked("availabilityEjnCloseMinutes", "availabilityEjnIsOpen"),
  
          RequiredChecked("availabilityEjnOpenHour", "availabilityEjnIsOpen"),
          RequiredChecked("availabilityEjnOpenMinutes", "availabilityEjnIsOpen"),
          RequiredChecked("availabilityEjnCloseHour", "availabilityEjnIsOpen"),
          RequiredChecked("availabilityEjnCloseMinutes", "availabilityEjnIsOpen"),
  
          RequiredChecked("availabilityPremOpenHour", "availabilityPremIsOpen"),
          RequiredChecked("availabilityPremOpenMinutes", "availabilityPremIsOpen"),
          RequiredChecked("availabilityPremCloseHour", "availabilityPremIsOpen"),
          RequiredChecked("availabilityPremCloseMinutes", "availabilityPremIsOpen"),
  
          RequiredChecked("availabilityShtnOpenHour", "availabilityShtnIsOpen"),
          RequiredChecked("availabilityShtnOpenMinutes", "availabilityShtnIsOpen"),
          RequiredChecked("availabilityShtnCloseHour", "availabilityShtnIsOpen"),
          RequiredChecked("availabilityShtnCloseMinutes", "availabilityShtnIsOpen"),
          
          RequiredChecked("availabilityDielOpenHour", "availabilityDielIsOpen"),
          RequiredChecked("availabilityDielOpenMinutes", "availabilityDielIsOpen"),
          RequiredChecked("availabilityDielCloseHour", "availabilityDielIsOpen"),
          RequiredChecked("availabilityDielCloseMinutes", "availabilityDielIsOpen"),
        ]
      });

     


      
  }

  get getChangePasswordForm():any {return this.changePasswordFormGroup.controls;}
  get getUserForm():any {return this.userFormGroup.controls;}
  get getCompanyFormGroup():any {return this.companyFormGroup.controls};

  reload() {
    this.restaurantService.getRestaurantById(this.companyId)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data) => {
          this.companyData = data.restuarants;
          this.company.setValue(this.companyData.name);
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

          this.availabilityHanOpenHour.setValue(String(this.companyData.availability[0].openHour).padStart(2, '0'));
          this.availabilityHanOpenMinutes.setValue(String(this.companyData.availability[0].openMinutes).padStart(2, '0'));
          this.availabilityHanCloseHour.setValue(String(this.companyData.availability[0].closeHour).padStart(2, '0'));
          this.availabilityHanCloseMinutes.setValue(String(this.companyData.availability[0].closeMinutes).padStart(2, '0'));
          this.availabilityHanIsOpen.setValue(this.companyData.availability[0].isOpen);


          this.availabilityMarOpenHour.setValue(String(this.companyData.availability[1].openHour).padStart(2, '0'));
          this.availabilityMarOpenMinutes.setValue(String(this.companyData.availability[1].openMinutes).padStart(2, '0'));
          this.availabilityMarCloseHour.setValue(String(this.companyData.availability[1].closeHour).padStart(2, '0'));
          this.availabilityMarCloseMinutes.setValue(String(this.companyData.availability[1].closeMinutes).padStart(2, '0'));
          this.availabilityMarIsOpen.setValue(this.companyData.availability[1].isOpen);

          this.availabilityMerOpenHour.setValue(String(this.companyData.availability[2].openHour).padStart(2, '0'));
          this.availabilityMerOpenMinutes.setValue(String(this.companyData.availability[2].openMinutes).padStart(2, '0'));
          this.availabilityMerCloseHour.setValue(String(this.companyData.availability[2].closeHour).padStart(2, '0'));
          this.availabilityMerCloseMinutes.setValue(String(this.companyData.availability[2].closeMinutes).padStart(2, '0'));
          this.availabilityMerIsOpen.setValue(this.companyData.availability[2].isOpen);

          this.availabilityEjnOpenHour.setValue(String(this.companyData.availability[3].openHour).padStart(2, '0'));
          this.availabilityEjnOpenMinutes.setValue(String(this.companyData.availability[3].openMinutes).padStart(2, '0'));
          this.availabilityEjnCloseHour.setValue(String(this.companyData.availability[3].closeHour).padStart(2, '0'));
          this.availabilityEjnCloseMinutes.setValue(String(this.companyData.availability[3].closeMinutes).padStart(2, '0'));
          this.availabilityEjnIsOpen.setValue(this.companyData.availability[3].isOpen);

          this.availabilityPremOpenHour.setValue(String(this.companyData.availability[4].openHour).padStart(2, '0'));
          this.availabilityPremOpenMinutes.setValue(String(this.companyData.availability[4].openMinutes).padStart(2, '0'));
          this.availabilityPremCloseHour.setValue(String(this.companyData.availability[4].closeHour).padStart(2, '0'));
          this.availabilityPremCloseMinutes.setValue(String(this.companyData.availability[4].closeMinutes).padStart(2, '0'));
          this.availabilityPremIsOpen.setValue(this.companyData.availability[4].isOpen);

          this.availabilityShtnOpenHour.setValue(String(this.companyData.availability[5].openHour).padStart(2, '0'));
          this.availabilityShtnOpenMinutes.setValue(String(this.companyData.availability[5].openMinutes).padStart(2, '0'));
          this.availabilityShtnCloseHour.setValue(String(this.companyData.availability[5].closeHour).padStart(2, '0'));
          this.availabilityShtnCloseMinutes.setValue(String(this.companyData.availability[5].closeMinutes).padStart(2, '0'));
          this.availabilityShtnIsOpen.setValue(this.companyData.availability[5].isOpen);

          this.availabilityDielOpenHour.setValue(String(this.companyData.availability[6].openHour).padStart(2, '0'));
          this.availabilityDielOpenMinutes.setValue(String(this.companyData.availability[6].openMinutes).padStart(2, '0'));
          this.availabilityDielCloseHour.setValue(String(this.companyData.availability[6].closeHour).padStart(2, '0'));
          this.availabilityDielCloseMinutes.setValue(String(this.companyData.availability[6].closeMinutes).padStart(2, '0'));
          this.availabilityDielIsOpen.setValue(this.companyData.availability[6].isOpen);
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
      const addresses = this.companyFormGroup.get('addresses') as UntypedFormArray;
     
      let reqBody = {
        restaurant:{
          name: this.companyFormGroup.get("company").value,
          phone: this.companyFormGroup.get("phone").value,
          description: this.companyFormGroup.get("description").value,
          url: this.companyFormGroup.get("url").value,
          logo: this.companyFormGroup.get("logo").value,
          currency: this.companyFormGroup.get("currencyType").value,
          deliveryTime: this.companyFormGroup.get("deliveryTime").value,
          address: addresses.value,
          availability: []
        },
        user: {
          restaurantId: this.companyId
        }
      };

      if(this.companyFormGroup.get("availabilityHanIsOpen").value) {
        reqBody.restaurant.availability[0] ={
          openHour: parseInt(this.companyFormGroup.get("availabilityHanOpenHour").value),
          openMinutes: parseInt(this.companyFormGroup.get("availabilityHanOpenMinutes").value),
          closeHour: parseInt(this.companyFormGroup.get("availabilityHanCloseHour").value),
          closeMinutes: parseInt(this.companyFormGroup.get("availabilityHanCloseMinutes").value),
          isOpen: this.companyFormGroup.get("availabilityHanIsOpen").value,
        }
      } else { 
        reqBody.restaurant.availability[0] ={
          openHour: 0,
          openMinutes: 0,
          closeHour: 0,
          closeMinutes: 0,
          isOpen: this.companyFormGroup.get("availabilityHanIsOpen").value,
        }
      }


      if(this.companyFormGroup.get("availabilityMarIsOpen").value) {
        reqBody.restaurant.availability[1] ={
          openHour: parseInt(this.companyFormGroup.get("availabilityMarOpenHour").value),
          openMinutes: parseInt(this.companyFormGroup.get("availabilityMarOpenMinutes").value),
          closeHour: parseInt(this.companyFormGroup.get("availabilityMarCloseHour").value),
          closeMinutes: parseInt(this.companyFormGroup.get("availabilityMarCloseMinutes").value),
          isOpen: this.companyFormGroup.get("availabilityMarIsOpen").value,
        }
      } else { 
        reqBody.restaurant.availability[1] ={
          openHour: 0,
          openMinutes: 0,
          closeHour: 0,
          closeMinutes: 0,
          isOpen: this.companyFormGroup.get("availabilityMarIsOpen").value,
        }
      }

      if(this.companyFormGroup.get("availabilityMerIsOpen").value) {
        reqBody.restaurant.availability[2] ={
          openHour: parseInt(this.companyFormGroup.get("availabilityMerOpenHour").value),
          openMinutes: parseInt(this.companyFormGroup.get("availabilityMerOpenMinutes").value),
          closeHour: parseInt(this.companyFormGroup.get("availabilityMerCloseHour").value),
          closeMinutes: parseInt(this.companyFormGroup.get("availabilityMerCloseMinutes").value),
          isOpen: this.companyFormGroup.get("availabilityMerIsOpen").value,
        }
      } else { 
        reqBody.restaurant.availability[2] ={
          openHour: 0,
          openMinutes: 0,
          closeHour: 0,
          closeMinutes: 0,
          isOpen: this.companyFormGroup.get("availabilityMerIsOpen").value,
        }
      }

      if(this.companyFormGroup.get("availabilityEjnIsOpen").value) {
        reqBody.restaurant.availability[3] ={
          openHour: parseInt(this.companyFormGroup.get("availabilityEjnOpenHour").value),
          openMinutes: parseInt(this.companyFormGroup.get("availabilityEjnOpenMinutes").value),
          closeHour: parseInt(this.companyFormGroup.get("availabilityEjnCloseHour").value),
          closeMinutes: parseInt(this.companyFormGroup.get("availabilityEjnCloseMinutes").value),
          isOpen: this.companyFormGroup.get("availabilityEjnIsOpen").value,
        }
      } else { 
        reqBody.restaurant.availability[3] ={
          openHour: 0,
          openMinutes: 0,
          closeHour:  0,
          closeMinutes: 0,
          isOpen: this.companyFormGroup.get("availabilityEjnIsOpen").value,
        }
      }

      if(this.companyFormGroup.get("availabilityPremIsOpen").value) {
        reqBody.restaurant.availability[4] ={
          openHour: parseInt(this.companyFormGroup.get("availabilityPremOpenHour").value),
          openMinutes: parseInt(this.companyFormGroup.get("availabilityPremOpenMinutes").value),
          closeHour: parseInt(this.companyFormGroup.get("availabilityPremCloseHour").value),
          closeMinutes: parseInt(this.companyFormGroup.get("availabilityPremCloseMinutes").value),
          isOpen: this.companyFormGroup.get("availabilityPremIsOpen").value,
        }
      } else { 
        reqBody.restaurant.availability[4] ={
          openHour: 0,
          openMinutes: 0,
          closeHour: 0,
          closeMinutes: 0,
          isOpen: this.companyFormGroup.get("availabilityPremIsOpen").value,
        }
      }

      if(this.companyFormGroup.get("availabilityShtnIsOpen").value) {
        reqBody.restaurant.availability[5] ={
          openHour: parseInt(this.companyFormGroup.get("availabilityShtnOpenHour").value),
          openMinutes: parseInt(this.companyFormGroup.get("availabilityShtnOpenMinutes").value),
          closeHour: parseInt(this.companyFormGroup.get("availabilityShtnCloseHour").value),
          closeMinutes: this.companyFormGroup.get("availabilityShtnCloseMinutes").value,
          isOpen: this.companyFormGroup.get("availabilityShtnIsOpen").value,
        }
      } else { 
        reqBody.restaurant.availability[5] ={
          openHour: 0,
          openMinutes: 0,
          closeHour: 0,
          closeMinutes: 0,
          isOpen: this.companyFormGroup.get("availabilityShtnIsOpen").value,
        }
      }

      if(this.companyFormGroup.get("availabilityDielIsOpen").value) {
        reqBody.restaurant.availability[6] ={
          openHour: parseInt(this.companyFormGroup.get("availabilityDielOpenHour").value),
          openMinutes: parseInt(this.companyFormGroup.get("availabilityDielOpenMinutes").value),
          closeHour: parseInt(this.companyFormGroup.get("availabilityDielCloseHour").value),
          closeMinutes: parseInt(this.companyFormGroup.get("availabilityDielCloseMinutes").value),
          isOpen: this.companyFormGroup.get("availabilityDielIsOpen").value,
        }
      } else { 
        reqBody.restaurant.availability[6] ={
          openHour: 0,
          openMinutes: 0,
          closeHour: 0,
          closeMinutes: 0,
          isOpen: this.companyFormGroup.get("availabilityDielIsOpen").value,
        }
      }


  
      this.restaurantService.updateRestaurant(reqBody)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data:any) => {
          swal.default.fire("Sukses","Kompania u shtua me sukses", 'success');
          this.reload();
        }, 
        error =>{
          swal.default.fire("Njoftim",error.error.error.error, 'warning');
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
          'logo':reader.result
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
