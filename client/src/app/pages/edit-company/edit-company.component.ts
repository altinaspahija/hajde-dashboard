import { Component, OnInit } from '@angular/core';
import { CompanyService } from "../../services/company.service";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as swal from "sweetalert2";
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, UntypedFormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'environments/environment';
import { City } from 'app/shared/cities/City';
import { Country } from 'app/shared/countries/Country';
import { RequiredChecked } from 'app/validators/required-checked.validators';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.css']
})
export class EditCompanyComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  public company = new UntypedFormControl('', [Validators.required]);
  public description = new UntypedFormControl("", [Validators.required]);
  public firstName = new UntypedFormControl("", [Validators.required]);
  public lastName = new UntypedFormControl("", [Validators.required]);
  public email = new UntypedFormControl("", [Validators.required, Validators.email]);
  public phone = new UntypedFormControl("", [Validators.required]);

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

  public addresses = new UntypedFormArray([]);
  public currencyType = new UntypedFormControl("", [Validators.required]);
  public orderBy = new UntypedFormControl("", []);
  public deliveryTime = new UntypedFormControl("", [Validators.required]);
  public urlImage = new UntypedFormControl("");
  public urlCover = new UntypedFormControl("");
  public url = new UntypedFormControl("", []);
  public fastDelivery = new UntypedFormControl("", []);
  public companyFormGroup: UntypedFormGroup;
  public submittedCompany = false;
  public errorMessage;
  public companyData;
  private id;
  public countryCities: City[][] = [];
  public minimumValueOrder = new UntypedFormControl(0, [Validators.required]);

  constructor(public companyFormBuilder: UntypedFormBuilder, private companyService: CompanyService, private router: Router, private activeRoute: ActivatedRoute) {
    this.activeRoute.paramMap.subscribe(params => {
      this.id = params.get("id");
      this.companyService.getCompanyById(this.id)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data) => {
          this.companyData = data.company;
          this.company.setValue(this.companyData.company);
          this.description.setValue(this.companyData.description);
          this.firstName.setValue(this.companyData.account.firstName);
          this.lastName.setValue(this.companyData.account.lastName);
          this.email.setValue(this.companyData.account.email);
          this.phone.setValue(this.companyData.phone);
          this.minimumValueOrder.setValue(this.companyData.minimumValueOrder);
          this.urlImage.setValue(this.companyData.imageURL);
          this.urlCover.setValue(this.companyData.coverURL);

          for (let add of this.companyData.address) {
            this.addresses.push(new UntypedFormGroup({
              country: new UntypedFormControl(add.country, [Validators.required]),
              city: new UntypedFormControl(add.city, [Validators.required]),
              street: new UntypedFormControl(add.street, [Validators.required]),
              latitude: new UntypedFormControl(add.latitude, [Validators.required]),
              longitude: new UntypedFormControl(add.longitude, [Validators.required])
            }))
            this.countryCities.push([{
              name: add.city,
              alternativeName: add.city,
              coordinates: {
                lat: {
                  $numberDecimal: "0"
                },
                lng: {
                  $numberDecimal: "0"
                }
              }
            }]);
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

          this.closedHoursMonday = this.calculateClosingHours(parseInt(String(this.companyData.availability[0].openHour).padStart(2, '0')));
          this.closedHoursTuesDay = this.calculateClosingHours(parseInt(String(this.companyData.availability[1].openHour).padStart(2, '0')));
          this.closedHoursWednesDay = this.calculateClosingHours(parseInt(String(this.companyData.availability[2].openHour).padStart(2, '0')));
          this.closedHoursThursDay = this.calculateClosingHours(parseInt(String(this.companyData.availability[3].openHour).padStart(2, '0')));
          this.closedHoursFriday = this.calculateClosingHours(parseInt(String(this.companyData.availability[4].openHour).padStart(2, '0')));
          this.closedHoursSaturday = this.calculateClosingHours(parseInt(String(this.companyData.availability[5].openHour).padStart(2, '0')));
          this.closedHoursSunday = this.calculateClosingHours(parseInt(String(this.companyData.availability[6].openHour).padStart(2, '0')));

          this.url.setValue(this.companyData.url);
          this.currencyType.setValue(this.companyData.currency);
          this.orderBy.setValue(this.companyData.orderBy);
          this.deliveryTime.setValue(this.companyData.deliveryTime);
          this.fastDelivery.setValue(this.companyData.fastDelivery);
        })

      this.companyFormGroup = companyFormBuilder.group({
        company: this.company,
        description: this.description,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phone: this.phone,
        addresses: this.addresses,
        urlImage: this.urlImage,
        urlCover: this.urlCover,
        url: this.url,
        orderBy: this.orderBy,
        currencyType: this.currencyType,
        deliveryTime: this.deliveryTime,
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
    })

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
  
  }

  get getCompanyFormGroup(): any { return this.companyFormGroup.controls };

  ngOnInit(): void {

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

  addCompany() {
    this.submittedCompany = true;
    if (this.companyFormGroup.valid) {
      const addresses = this.companyFormGroup.get('addresses') as UntypedFormArray;
      const reqBody = {
        company: {
          company: this.companyFormGroup.get("company").value,
          address: addresses.value,
          phone: this.companyFormGroup.get("phone").value,
          description: this.companyFormGroup.get("description").value,
          url: this.companyFormGroup.get("url").value,
          currency: this.companyFormGroup.get("currencyType").value,
          orderBy: this.companyFormGroup.get("orderBy").value,
          deliveryTime: this.companyFormGroup.get('deliveryTime').value,
          fastDelivery: this.companyFormGroup.get("fastDelivery").value,
          availability: [],
          minimumValueOrder: this.companyFormGroup.get("minimumValueOrder").value
        },
        user: {
          firstName: this.companyFormGroup.get("firstName").value,
          lastName: this.companyFormGroup.get("lastName").value,
          email: this.companyFormGroup.get("email").value
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

      if (this.companyFormGroup.get("urlImage").value) {
        reqBody.company['urlImage'] = this.companyFormGroup.get("urlImage").value
      }
      if (this.companyFormGroup.get("urlCover").value) {
        reqBody.company['urlCover'] = this.companyFormGroup.get("urlCover").value
      }
      this.companyService.updateCompany(this.id, reqBody)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data: any) => {
          swal.default.fire("Sukses", "Kompania u ndryshua me sukses", 'success');
          this.router.navigate(['/admin/companies'])
        },
          error => {
            swal.default.fire("Njoftim", error.error.error, 'warning');
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

  public handleCountryChange(event: any, index: number) {
    const country = event as Country;
    if (country) {
      this.countryCities[index] = country.cities;
      this.addresses.controls[index].get('city').patchValue("");
      this.addresses.controls[index].get('country').patchValue(country.name);
    } else {
      this.countryCities[index] = [];
      this.addresses.controls[index].get('city').patchValue("");
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

  public handleCountryLoad(countries: Country[], index: number) {
    const country = countries.find(f => f.name === this.addresses.controls[index].get('country').value);
    if (country) {
      this.countryCities[index] = country.cities;
    }
  }

  public countryControl(index: number) {
    return this.addresses.controls[index].get('country');
  }

  public cityControl(index: number) {
    return this.addresses.controls[index].get('city')
  }
}
