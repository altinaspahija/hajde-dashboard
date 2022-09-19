import { Component, OnInit } from '@angular/core';
import { CompanyService } from "../../services/company.service";
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as swal from "sweetalert2";
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, UntypedFormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'app/shared/countries/Country';
import { City } from 'app/shared/cities/City';
import { RequiredChecked } from 'app/validators/required-checked.validators';

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.css']
})
export class CreateCompanyComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  public company = new UntypedFormControl('', [Validators.required]);
  public description = new UntypedFormControl("", [Validators.required]);
  public firstName = new UntypedFormControl("", [Validators.required]);
  public lastName = new UntypedFormControl("", [Validators.required]);
  public email = new UntypedFormControl("", [Validators.required, Validators.email]);
  public phoneCode = new UntypedFormControl("", []);
  public phone = new UntypedFormControl("", [Validators.required]);
  public password = new UntypedFormControl("", [Validators.required, Validators.minLength(8)]);

  public closedHoursMonday: string[] = [];
  public closedHoursTuesDay: string[] = [];
  public closedHoursWednesDay: string[] = [];
  public closedHoursThursDay: string[] = [];
  public closedHoursFriday: string[] = [];
  public closedHoursSaturday: string[] = [];
  public closedHoursSunday: string[] = [];

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

  public fastDelivery = new UntypedFormControl("", []);
  public countryCities: City[][] = [];
  public deliveryTime = new UntypedFormControl("", [Validators.required]);
  public addresses = new UntypedFormArray([
    new UntypedFormGroup({
      country: new UntypedFormControl("", [Validators.required]),
      city: new UntypedFormControl("", [Validators.required]),
      street: new UntypedFormControl("", [Validators.required]),
      latitude: new UntypedFormControl("", [Validators.required]),
      longitude: new UntypedFormControl("", [Validators.required]),
    })
  ]);
  public logo = new UntypedFormControl("", []);
  public cover = new UntypedFormControl("", []);
  public currencyType = new UntypedFormControl("", [Validators.required]);
  public orderBy = new UntypedFormControl("", []);
  public url = new UntypedFormControl("", []);
  public companyFormGroup: UntypedFormGroup;
  public submittedCompany = false;
  public errorMessage;
  public currUsr: any;
  public minimumValueOrder = 0;

  constructor(public companyFormBuilder: UntypedFormBuilder, private companyService: CompanyService, private router: Router, public auth: AuthService) {
    this.companyFormGroup = companyFormBuilder.group({
      company: this.company,
      description: this.description,
      firstName: this.firstName,
      lastName: this.lastName,
      deliveryTime: this.deliveryTime,
      email: this.email,
      phone: this.phone,
      password: this.password,
      addresses: this.addresses,
      logo: this.logo,
      cover: this.cover,
      currencyType: this.currencyType,
      orderBy: this.orderBy,
      url: this.url,
      phoneCode: this.phoneCode,
      fastDelivery: this.fastDelivery,
      minimumValueOrder: this.minimumValueOrder,
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
    },
    {
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
    this.availabilityHanOpenHour.statusChanges.subscribe(() => {
      const startHours = this.availabilityHanOpenHour.value;
      this.closedHoursMonday = this.calculateClosingHours(parseInt(startHours));
    });
    
    this.availabilityMarOpenHour.statusChanges.subscribe(() => {
      const startHours = this.availabilityMarOpenHour.value;
      this.closedHoursTuesDay = this.calculateClosingHours(parseInt(startHours));
    });
    
    this.availabilityMerOpenHour.statusChanges.subscribe(() => {
      const startHours = this.availabilityMarOpenHour.value;
      this.closedHoursWednesDay = this.calculateClosingHours(parseInt(startHours));
    });
    
    this.availabilityEjnOpenHour.statusChanges.subscribe(() => {
      const startHours = this.availabilityMarOpenHour.value;
      this.closedHoursThursDay = this.calculateClosingHours(parseInt(startHours));
    });
    
    this.availabilityPremOpenMinutes.statusChanges.subscribe(() => {
      const startHours = this.availabilityMarOpenHour.value;
      this.closedHoursFriday = this.calculateClosingHours(parseInt(startHours));
    });
    
    this.availabilityShtnIsOpen.statusChanges.subscribe(() => {
      const startHours = this.availabilityMarOpenHour.value;
      this.closedHoursSaturday = this.calculateClosingHours(parseInt(startHours));
    });
    
    this.availabilityDielOpenHour.statusChanges.subscribe(() => {
      const startHours = this.availabilityMarOpenHour.value;
      this.closedHoursSunday = this.calculateClosingHours(parseInt(startHours));
    });

    this.currUsr = auth.getUser();

    console.log(this.currUsr);

  }

    /**
* Calculate closing hours
* 
* start: 09, ends 10,11,.. 09
* 
* @param startingHour 
* @param list 
*/
public calculateClosingHours(startingHour: number) {
  const list = [];
  for (let index = startingHour + 1; index < 24; index++) {
    if (index < 10) {
      let number = "0" + index;
      list.push(String(number));
    } else {
      list.push(String(index));
    }
  }
  for (let index = 0; index <= startingHour; index++) {
    if (index < 10) {
      let number = "0" + index;
      list.push(String(number));
    } else {
      list.push(String(index));
    }
  }
  
  return list;
  }

  get getCompanyFormGroup(): any { return this.companyFormGroup.controls };

  get addressesList(): UntypedFormArray {
    return this.companyFormGroup.get('adresses') as UntypedFormArray;
  }

  addAddress(e) {
    e.preventDefault();
    this.countryCities.push([]);
    this.addresses.push(new UntypedFormGroup({
      country: new UntypedFormControl("", [Validators.required]),
      city: new UntypedFormControl("", [Validators.required]),
      street: new UntypedFormControl("", [Validators.required]),
      latitude: new UntypedFormControl("", [Validators.required]),
      longitude: new UntypedFormControl("", [Validators.required])
    }))
  }

  removeAddress(e, i) {
    e.preventDefault();
    if (i != 0) {
      this.addresses.removeAt(i);
      this.countryCities.splice(i, 1);
    }
  }

  ngOnInit(): void {
  }

  addCompany() {
    this.submittedCompany = true;
    if (this.companyFormGroup.valid) {
      const addresses = this.companyFormGroup.get('addresses') as UntypedFormArray;

      const reqBody = {
        company: {
          orderBy: this.companyFormGroup.get("orderBy").value,
          company: this.companyFormGroup.get("company").value,
          phone: `${this.companyFormGroup.get("phoneCode").value}${this.companyFormGroup.get("phone").value}`,
          description: this.companyFormGroup.get("description").value,
          url: this.companyFormGroup.get("url").value,
          logo: this.companyFormGroup.get("logo").value,
          cover: this.companyFormGroup.get("cover").value,
          currency: this.companyFormGroup.get("currencyType").value,
          deliveryTime: this.companyFormGroup.get("deliveryTime").value,
          address: addresses.value,
          availability: [],
          fastDelivery: this.companyFormGroup.get("fastDelivery").value,
          minimumValueOrder: this.companyFormGroup.get("minimumValueOrder").value
        },
        user: {
          firstName: this.companyFormGroup.get("firstName").value,
          lastName: this.companyFormGroup.get("lastName").value,
          email: this.companyFormGroup.get("email").value,
          password: this.companyFormGroup.get("password").value,
        }
      };

      if (this.companyFormGroup.get("availabilityHanIsOpen").value) {
        reqBody.company.availability[0] = {
          openHour: parseInt(this.companyFormGroup.get("availabilityHanOpenHour").value),
          openMinutes: parseInt(this.companyFormGroup.get("availabilityHanOpenMinutes").value),
          closeHour: parseInt(this.companyFormGroup.get("availabilityHanCloseHour").value),
          closeMinutes: parseInt(this.companyFormGroup.get("availabilityHanCloseMinutes").value),
          isOpen: this.companyFormGroup.get("availabilityHanIsOpen").value,
        }
      } else {
        reqBody.company.availability[0] = {
          openHour: 0,
          openMinutes: 0,
          closeHour: 0,
          closeMinutes: 0,
          isOpen: this.companyFormGroup.get("availabilityHanIsOpen").value,
        }
      }


      if (this.companyFormGroup.get("availabilityMarIsOpen").value) {
        reqBody.company.availability[1] = {
          openHour: parseInt(this.companyFormGroup.get("availabilityMarOpenHour").value),
          openMinutes: parseInt(this.companyFormGroup.get("availabilityMarOpenMinutes").value),
          closeHour: parseInt(this.companyFormGroup.get("availabilityMarCloseHour").value),
          closeMinutes: parseInt(this.companyFormGroup.get("availabilityMarCloseMinutes").value),
          isOpen: this.companyFormGroup.get("availabilityMarIsOpen").value,
        }
      } else {
        reqBody.company.availability[1] = {
          openHour: 0,
          openMinutes: 0,
          closeHour: 0,
          closeMinutes: 0,
          isOpen: this.companyFormGroup.get("availabilityMarIsOpen").value,
        }
      }

      if (this.companyFormGroup.get("availabilityMerIsOpen").value) {
        reqBody.company.availability[2] = {
          openHour: parseInt(this.companyFormGroup.get("availabilityMerOpenHour").value),
          openMinutes: parseInt(this.companyFormGroup.get("availabilityMerOpenMinutes").value),
          closeHour: parseInt(this.companyFormGroup.get("availabilityMerCloseHour").value),
          closeMinutes: parseInt(this.companyFormGroup.get("availabilityMerCloseMinutes").value),
          isOpen: this.companyFormGroup.get("availabilityMerIsOpen").value,
        }
      } else {
        reqBody.company.availability[2] = {
          openHour: 0,
          openMinutes: 0,
          closeHour: 0,
          closeMinutes: 0,
          isOpen: this.companyFormGroup.get("availabilityMerIsOpen").value,
        }
      }

      if (this.companyFormGroup.get("availabilityEjnIsOpen").value) {
        reqBody.company.availability[3] = {
          openHour: parseInt(this.companyFormGroup.get("availabilityEjnOpenHour").value),
          openMinutes: parseInt(this.companyFormGroup.get("availabilityEjnOpenMinutes").value),
          closeHour: parseInt(this.companyFormGroup.get("availabilityEjnCloseHour").value),
          closeMinutes: parseInt(this.companyFormGroup.get("availabilityEjnCloseMinutes").value),
          isOpen: this.companyFormGroup.get("availabilityEjnIsOpen").value,
        }
      } else {
        reqBody.company.availability[3] = {
          openHour: 0,
          openMinutes: 0,
          closeHour: 0,
          closeMinutes: 0,
          isOpen: this.companyFormGroup.get("availabilityEjnIsOpen").value,
        }
      }

      if (this.companyFormGroup.get("availabilityPremIsOpen").value) {
        reqBody.company.availability[4] = {
          openHour: parseInt(this.companyFormGroup.get("availabilityPremOpenHour").value),
          openMinutes: parseInt(this.companyFormGroup.get("availabilityPremOpenMinutes").value),
          closeHour: parseInt(this.companyFormGroup.get("availabilityPremCloseHour").value),
          closeMinutes: parseInt(this.companyFormGroup.get("availabilityPremCloseMinutes").value),
          isOpen: this.companyFormGroup.get("availabilityPremIsOpen").value,
        }
      } else {
        reqBody.company.availability[4] = {
          openHour: 0,
          openMinutes: 0,
          closeHour: 0,
          closeMinutes: 0,
          isOpen: this.companyFormGroup.get("availabilityPremIsOpen").value,
        }
      }

      if (this.companyFormGroup.get("availabilityShtnIsOpen").value) {
        reqBody.company.availability[5] = {
          openHour: parseInt(this.companyFormGroup.get("availabilityShtnOpenHour").value),
          openMinutes: parseInt(this.companyFormGroup.get("availabilityShtnOpenMinutes").value),
          closeHour: parseInt(this.companyFormGroup.get("availabilityShtnCloseHour").value),
          closeMinutes: parseInt(this.companyFormGroup.get("availabilityShtnCloseMinutes").value),
          isOpen: this.companyFormGroup.get("availabilityShtnIsOpen").value,
        }
      } else {
        reqBody.company.availability[5] = {
          openHour: 0,
          openMinutes: 0,
          closeHour: 0,
          closeMinutes: 0,
          isOpen: this.companyFormGroup.get("availabilityShtnIsOpen").value,
        }
      }

      if (this.companyFormGroup.get("availabilityDielIsOpen").value) {
        reqBody.company.availability[6] = {
          openHour: parseInt(this.companyFormGroup.get("availabilityDielOpenHour").value),
          openMinutes: parseInt(this.companyFormGroup.get("availabilityDielOpenMinutes").value),
          closeHour: parseInt(this.companyFormGroup.get("availabilityDielCloseHour").value),
          closeMinutes: parseInt(this.companyFormGroup.get("availabilityDielCloseMinutes").value),
          isOpen: this.companyFormGroup.get("availabilityDielIsOpen").value,
        }
      } else {
        reqBody.company.availability[6] = {
          openHour: 0,
          openMinutes: 0,
          closeHour: 0,
          closeMinutes: 0,
          isOpen: this.companyFormGroup.get("availabilityDielIsOpen").value,
        }
      }


      this.companyService.addCompany(reqBody)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data: any) => {
          swal.default.fire("Sukses", "Oferta u shtua me sukses", 'success');
          this.router.navigate(['/admin/companies'])
        },
          error => {
            swal.default.fire("Njoftim", error.error.error.error, 'warning');
          })
    }
  }

  public onFileChange(event, inputName) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      let fls = {}
      reader.onload = () => {

        this.companyFormGroup.patchValue({
          [inputName]: reader.result
        });
      }
    }
  }

  public handleCountryChange(event: any, index: number) {
    const country = event as Country;
    if (country) {
      this.countryCities[index] = country.cities;
      this.addresses.controls[index].get('country').patchValue(country.name);
    } else {
      this.countryCities[index] = [];
      this.addresses.controls[index].get('country').patchValue("");

    }
  }

  public handleCityChange(event: any, index: number) {
    const city = event as City;
    if (city) {
      this.addresses.controls[index].get('city').patchValue(city.name);

    } else {
      this.addresses.controls[index].get('city').patchValue("");
    }
  }
}
