import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as swal from "sweetalert2";
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, FormArray } from '@angular/forms';
import { OffersService } from '../../services/offers.service';
import { CompanyService } from '../../services/company.service';
import { RestaurantsService } from '../../services/restaurants.service';
import { DateValidator } from '../../validators/date-validator.validators';
import { formatDate } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { MenuServiceService } from '../../services/menu-service.service';
import { ClientsService } from '../../services/clients.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-offer',
  templateUrl: './create-offer.component.html',
  styleUrls: ['./create-offer.component.css']
})
export class CreateOfferComponent implements OnInit {

  private unsubscribeAll: Subject<any> = new Subject<any>();
  public percent_offerProvider = new UntypedFormControl('', [Validators.required]);
  public percent_companyId = new UntypedFormControl('', []);
  public percent_discountAmount = new UntypedFormControl('', [Validators.required])
  public percent_minValue = new UntypedFormControl('', [Validators.required])
  public percent_maxValue = new UntypedFormControl('', [Validators.required])
  public percent_targetGroup = new UntypedFormControl('', [Validators.required]);
  public percent_hasPeriod = new UntypedFormControl('false', [Validators.required]);
  public percent_startDate = new UntypedFormControl('', []);
  public percent_endDate = new UntypedFormControl('', []);
  public percent_description = new UntypedFormControl("", [Validators.required]);
  public percent_country = new UntypedFormControl('', [Validators.required]);
  public percent_freeDelivery = new UntypedFormControl(false, [Validators.required]);
  public percent_products = new UntypedFormControl(false, [Validators.required]);

  public percentFormGroup: UntypedFormGroup;

  public value_offerProvider = new UntypedFormControl('', [Validators.required]);
  public value_companyId = new UntypedFormControl('', []);
  public value_discountAmount = new UntypedFormControl('', [Validators.required])
  public value_minValue = new UntypedFormControl('', [Validators.required])
  public value_targetGroup = new UntypedFormControl('', [Validators.required]);
  public value_hasPeriod = new UntypedFormControl('false', [Validators.required]);
  public value_startDate = new UntypedFormControl('', []);
  public value_endDate = new UntypedFormControl('', []);
  public value_description = new UntypedFormControl("", [Validators.required]);
  public value_country = new UntypedFormControl('', [Validators.required]);
  public value_freeDelivery = new UntypedFormControl(false, [Validators.required]);

  public valueFormGroup: UntypedFormGroup;

  public percentageRestaurantMarketAllSelected: boolean;
  public discountRestaurantMarketAllSelected: boolean;
  public freeProductRestaurantMarketAllSelected: boolean;

  public product_offerProvider = new UntypedFormControl('', [Validators.required]);
  public product_companyId = new UntypedFormControl('', [Validators.required]);
  public product_productId = new UntypedFormControl('', [Validators.required])
  public product_minValue = new UntypedFormControl('', [Validators.required])
  public product_targetGroup = new UntypedFormControl('', [Validators.required]);
  public product_hasPeriod = new UntypedFormControl('false', [Validators.required]);
  public product_startDate = new UntypedFormControl('', []);
  public product_endDate = new UntypedFormControl('', []);
  public product_description = new UntypedFormControl("", [Validators.required]);
  public product_country = new UntypedFormControl('', [Validators.required]);
  public product_freeDelivery = new UntypedFormControl(false, [Validators.required]);

  public productFormGroup: UntypedFormGroup;


  public winner_offerProvider = new UntypedFormControl('', [Validators.required]);
  public winner_companyId = new UntypedFormControl('', []);
  public winner_discountAmount = new UntypedFormControl('', [Validators.required]);
  public winner_minValue = new UntypedFormControl('', [Validators.required])
  public winner_maxValue = new UntypedFormControl('', [Validators.required])
  public winner_hasPeriod = new UntypedFormControl('false', [Validators.required]);
  public winner_startDate = new UntypedFormControl('', []);
  public winner_endDate = new UntypedFormControl('', []);
  public winner_userId = new UntypedFormControl('', [Validators.required]);
  public winner_description = new UntypedFormControl("", [Validators.required]);
  public winner_country = new UntypedFormControl('', [Validators.required]);

  public comps: any[]
  public valComps: any[]
  public prodComps: any[]
  public winnerComps: any[]
  public prods: any[]
  public clients: any;
  public winnerFormGroup: UntypedFormGroup;

  public currentUsr: any;
  public selectedUser: any;
  public submittedPercent = false;
  public submittedValue = false;
  public submittedProd = false;
  public submittedWinner = false;

  public products: any[] = [];

  constructor(
    public percentFormBuilder: UntypedFormBuilder,
    public valueFormBuilder: UntypedFormBuilder,
    public productFormBuilder: UntypedFormBuilder,
    public winnerFormBuilder: UntypedFormBuilder,
    public offersService: OffersService,
    public auth: AuthService,
    public companyService: CompanyService,
    public restaurantService: RestaurantsService,
    public productService: ProductService,
    public menuServiceService: MenuServiceService,
    public clientsService: ClientsService,
    public router: Router
  ) {

    this.currentUsr = auth.getUser();
    console.log(this.currentUsr.country);
    this.percent_country.setValue(this.currentUsr.country)
    this.value_country.setValue(this.currentUsr.country)
    this.product_country.setValue(this.currentUsr.country)
    this.winner_country.setValue(this.currentUsr.country)

    this.percentFormGroup = percentFormBuilder.group({
      percent_offerProvider: this.percent_offerProvider,
      percent_companyId: this.percent_companyId,
      percent_discountAmount: this.percent_discountAmount,
      percent_description: this.percent_description,
      percent_minValue: this.percent_minValue,
      percent_maxValue: this.percent_maxValue,
      percent_targetGroup: this.percent_targetGroup,
      percent_hasPeriod: this.percent_hasPeriod,
      percent_startDate: this.percent_startDate,
      percent_endDate: this.percent_endDate,
      percent_country: this.percent_country,
      percent_freeDelivery: this.percent_freeDelivery,
      percent_products: this.percent_products
    }, {
      validators: DateValidator('percent_endDate', 'percent_startDate')
    });

    this.valueFormGroup = valueFormBuilder.group({
      value_offerProvider: this.value_offerProvider,
      value_companyId: this.value_companyId,
      value_discountAmount: this.value_discountAmount,
      value_description: this.value_description,
      value_minValue: this.value_minValue,
      value_targetGroup: this.value_targetGroup,
      value_hasPeriod: this.value_hasPeriod,
      value_startDate: this.value_startDate,
      value_endDate: this.value_endDate,
      value_country: this.value_country,
      value_freeDelivery: this.value_freeDelivery
    }, {
      validators: DateValidator('value_endDate', 'value_startDate')
    });


    this.productFormGroup = productFormBuilder.group({
      product_offerProvider: this.product_offerProvider,
      product_companyId: this.product_companyId,
      product_productId: this.product_productId,
      product_description: this.product_description,
      product_minValue: this.product_minValue,
      product_targetGroup: this.product_targetGroup,
      product_hasPeriod: this.product_hasPeriod,
      product_startDate: this.product_startDate,
      product_endDate: this.product_endDate,
      product_country: this.product_country,
      product_freeDelivery: this.product_freeDelivery
    }, {
      validators: DateValidator('product_endDate', 'product_startDate')
    })


    this.winnerFormGroup = winnerFormBuilder.group({
      winner_offerProvider: this.winner_offerProvider,
      winner_companyId: this.winner_companyId,
      winner_discountAmount: this.winner_discountAmount,
      winner_description: this.winner_description,
      winner_minValue: this.winner_minValue,
      winner_maxValue: this.winner_maxValue,
      winner_hasPeriod: this.winner_hasPeriod,
      winner_startDate: this.winner_startDate,
      winner_endDate: this.winner_endDate,
      winner_country: this.winner_country,
      winner_userId: this.winner_userId,
    }, {
      validators: DateValidator('winner_endDate', 'winner_startDate')
    });

    this.clientsService.getAll()
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(data => {
        console.log(data);
        this.clients = data.clients;
      })

  }


  get getPercentFormGroup(): any { return this.percentFormGroup.controls };
  get getValueFormGroup(): any { return this.valueFormGroup.controls };
  get getProductFormGroup(): any { return this.productFormGroup.controls };
  get getWinnerFormGroup(): any { return this.winnerFormGroup.controls };


  ngOnInit(): void {

    this.percent_companyId.valueChanges.subscribe((companyIds) => {
      for (const companyId of companyIds) {
        const type = this.percent_offerProvider.value;
        if (type === 'market') {
          this.productService.getAllProductsForAdminWithoutPagination(companyId)
            .subscribe(data => this.products = data.products);
        } else if (type === 'restaurant') {
          this.menuServiceService.getAllProductsForAdminWithoutPagination(companyId)
            .subscribe(data => this.products = data.products);
        }
      }
    });
  }

  private mapProviders(ids: string[], offerType: string, form: any, providers: any[]) {
    const result = [];
    const type = form.get(offerType).value;

    for (const id of ids) {
      const found = providers.find(f => f._id === id);
      if (found) {
        result.push({ _id: found._id, name: found.name, type: type });
      }
    }

    return result;
  }

  private mapProduct(id: string, providers: any[]) {
    const found = providers.find(f => f._id === id);
    if (found) {
      return { _id: found._id, name: found.name };
    }

    return { _id: null, name: null };
  }

  public savePercent() {
    this.submittedPercent = true;
    if (this.percentFormGroup.valid) {
      let data = {
        offerType: "percentDiscount",
        offerProvider: this.percentFormGroup.get('percent_offerProvider').value,
        amountOffer: {
          discountAmount: this.percentFormGroup.get('percent_discountAmount').value,
          minValue: this.percentFormGroup.get('percent_minValue').value,
          maxDiscount: this.percentFormGroup.get('percent_maxValue').value
        },
        targetGroup: this.percentFormGroup.get('percent_targetGroup').value,
        description: this.percentFormGroup.get('percent_description').value,
        hasPeriod: this.percentFormGroup.get('percent_hasPeriod').value == 'true',
        country: this.percentFormGroup.get('percent_country').value,
        allProviders: this.percentageRestaurantMarketAllSelected,
        freeDelivery: this.percentFormGroup.get('percent_freeDelivery').value,
        products: this.percentFormGroup.get('percent_products').value
      }

      if (
        this.percentFormGroup.get('percent_offerProvider').value == "market" ||
        this.percentFormGroup.get('percent_offerProvider').value == "restaurant"
      ) {
        data['companyIds'] = this.mapProviders(
          this.percentFormGroup.get('percent_companyId').value || [],
          'percent_offerProvider',
          this.percentFormGroup,
          this.comps
        );
      }

      if (data.hasPeriod) {
        data['startDate'] = this.percentFormGroup.get('percent_startDate').value;
        data['endDate'] = this.percentFormGroup.get('percent_endDate').value;
      }

      this.offersService.createOffer(data)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data: any) => {
          swal.default.fire("Sukses", "Oferta u shtua me sukses", 'success');
          this.router.navigate(['/admin/offers'])
        },
          error => {
            swal.default.fire("Njoftim", error.error.error.error, 'warning');
          })
    }
  }

  public saveValue() {
    this.submittedValue = true;
    if (this.valueFormGroup.valid) {
      let data = {
        offerType: "AmountDiscount",
        offerProvider: this.valueFormGroup.get('value_offerProvider').value,
        amountOffer: {
          discountAmount: this.valueFormGroup.get('value_discountAmount').value,
          minValue: this.valueFormGroup.get('value_minValue').value,
        },
        targetGroup: this.valueFormGroup.get('value_targetGroup').value,
        description: this.valueFormGroup.get('value_description').value,
        hasPeriod: this.valueFormGroup.get('value_hasPeriod').value == 'true',
        country: this.valueFormGroup.get('value_country').value,
        allProviders: this.discountRestaurantMarketAllSelected,
        freeDelivery: this.valueFormGroup.get('value_freeDelivery').value,
      }

      if (
        this.valueFormGroup.get('value_offerProvider').value == "market" ||
        this.valueFormGroup.get('value_offerProvider').value == "restaurant"
      ) {
        data['companyIds'] = this.mapProviders(
          this.valueFormGroup.get('value_companyId').value || [],
          'value_offerProvider',
          this.valueFormGroup,
          this.valComps
        );
      }

      if (data.hasPeriod) {
        data['startDate'] = this.valueFormGroup.get('value_startDate').value;
        data['endDate'] = this.valueFormGroup.get('value_endDate').value;
      }

      this.offersService.createOffer(data)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data: any) => {
          swal.default.fire("Sukses", "Oferta u shtua me sukses", 'success');
          this.router.navigate(['/admin/offers'])
        },
          error => {
            swal.default.fire("Njoftim", error.error.error.error, 'warning');
          })
    }
  }


  public saveProd() {
    this.submittedProd = true;
    if (this.productFormGroup.valid) {
      const product = this.mapProduct(
        this.productFormGroup.get('product_productId').value,
        this.prods
      );
      let data = {
        offerType: "ExtraFreeProduct",
        offerProvider: this.productFormGroup.get('product_offerProvider').value,
        productOffer: {
          _id: product._id,
          name: product.name,
          minValue: this.productFormGroup.get('product_minValue').value,
        },
        targetGroup: this.productFormGroup.get('product_targetGroup').value,
        description: this.productFormGroup.get('product_description').value,
        hasPeriod: this.productFormGroup.get('product_hasPeriod').value == 'true',
        country: this.productFormGroup.get('product_country').value,
        freeDelivery: this.productFormGroup.get('product_freeDelivery').value,
      }

      if (
        this.productFormGroup.get('product_offerProvider').value == "market" ||
        this.productFormGroup.get('product_offerProvider').value == "restaurant"
      ) {
        data['companyIds'] = this.mapProviders(
          [this.productFormGroup.get('product_companyId').value],
          'product_offerProvider',
          this.productFormGroup,
          this.prodComps
        )
      }

      if (data.hasPeriod) {
        data['startDate'] = this.productFormGroup.get('product_startDate').value;
        data['endDate'] = this.productFormGroup.get('product_endDate').value;
      }

      this.offersService.createOffer(data)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data: any) => {
          swal.default.fire("Sukses", "Oferta u shtua me sukses", 'success');
          this.router.navigate(['/admin/offers'])
        },
          error => {
            swal.default.fire("Njoftim", error.error.error.error, 'warning');
          })
    }
  }

  public saveWinner() {
    this.submittedWinner = true;
    if (this.winnerFormGroup.valid) {
      let data = {
        offerType: "PercentDiscountWinner",
        offerProvider: this.winnerFormGroup.get('winner_offerProvider').value,
        amountOffer: {
          discountAmount: this.winnerFormGroup.get('winner_discountAmount').value,
          minValue: this.winnerFormGroup.get('winner_minValue').value,
          maxDiscount: this.winnerFormGroup.get('winner_maxValue').value
        },
        targetGroup: "SingleUser",
        description: this.winnerFormGroup.get('winner_description').value,
        hasPeriod: this.winnerFormGroup.get('winner_hasPeriod').value == 'true',
        country: this.winnerFormGroup.get('winner_country').value,
        userId: this.winnerFormGroup.get('winner_userId').value
      }

      if (
        this.winnerFormGroup.get('winner_offerProvider').value == "market" ||
        this.winnerFormGroup.get('winner_offerProvider').value == "restaurant"
      ) {
        data['companyIds'] = this.mapProviders(
          this.winnerFormGroup.get('winner_companyId').value || [],
          'winner_offerProvider',
          this.winnerFormGroup,
          this.winnerComps
        );
      }

      if (data.hasPeriod) {
        data['startDate'] = this.winnerFormGroup.get('winner_startDate').value;
        data['endDate'] = this.winnerFormGroup.get('winner_endDate').value;
      }

      console.log(data, 'winnerData');

      this.offersService.createOffer(data)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data: any) => {
          swal.default.fire("Sukses", "Oferta u shtua me sukses", 'success');
          this.router.navigate(['/admin/offers'])
        },
          error => {
            swal.default.fire("Njoftim", error.error.error.error, 'warning');
          })
    }
  }

  public changeOffer(e) {
    e.preventDefault();
    this.percentFormGroup.get('percent_companyId').patchValue([]);
    let type = this.percentFormGroup.get('percent_offerProvider').value;
    if (type == "market") {
      this.companyService.getAllComp()
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe(data => {

          this.comps = data.companies.map(company => {
            const obj = { ...company };
            obj["name"] = company.company;

            return obj;
          });
        })
    } else if (type == "restaurant") {
      this.restaurantService.getAll()
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe(data => {
          this.comps = data.restuarants;
        })
    } else {
      this.comps = [];
    }
  }


  public changeOfferValue(e) {
    e.preventDefault();
    this.getValueFormGroup.value_companyId.patchValue([]);
    let type = this.valueFormGroup.get('value_offerProvider').value;
    console.log(type);
    if (type == "market") {
      this.companyService.getAllComp()
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe(data => {
          this.valComps = data.companies.map(company => {
            const obj = { ...company };
            obj["name"] = company.company;

            return obj;
          });
        })
    } else if (type == "restaurant") {
      this.restaurantService.getAll()
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe(data => {
          this.valComps = data.restuarants;
        })
    } else {
      this.valComps = [];
    }
  }

  public changeOfferProd() {
    this.getProductFormGroup.product_companyId.patchValue([]);
    let type = this.productFormGroup.get('product_offerProvider').value;
    if (type == "market") {
      this.companyService.getAllComp()
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe(data => {
          this.prodComps = data.companies.map(company => {
            const obj = { ...company };
            obj["name"] = company.company;

            return obj;
          });
        })
    } else if (type == "restaurant") {
      this.restaurantService.getAll()
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe(data => {
          console.log(data)
          this.prodComps = data.restuarants;
        })
    } else {
      this.prodComps = [];
    }
  }

  public changeOfferWinner() {

    let type = this.winnerFormGroup.get('winner_offerProvider').value;
    if (type == "market") {
      this.companyService.getAllComp()
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe(data => {
          this.winnerComps = data.companies;
        })
    } else if (type == "restaurant") {
      this.restaurantService.getAll()
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe(data => {
          this.winnerComps = data.restuarants;
        })
    } else {
      this.winnerComps = [];
    }
  }

  public getAllProd($event: any) {
    let type = this.productFormGroup.get('product_offerProvider').value;
    let compId = this.productFormGroup.get('product_companyId').value;
    if (type == "market") {
      this.productService.getProduts(compId)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe(data => {
          this.prods = data.products.products;
        })
    } else if (type == "restaurant") {
      this.menuServiceService.getProduts(compId)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe(data => {
          this.prods = data.products.products;
        })
    } else {
      this.prods = [];
    }
  }

  public percentageRestaurantMarketAllSelectedChange(value: boolean) {
    this.percentageRestaurantMarketAllSelected = !value;
  }

  public discountRestaurantMarketAllSelectedChange(value: boolean) {
    this.discountRestaurantMarketAllSelected = !value;
  }

  public generateRandomClient() {
    const clientsLength = this.clients.length;
    const randomNumber = this.randomIntFromInterval(0, clientsLength);
    const randomClient = this.clients[randomNumber];

    this.winnerFormGroup.get('winner_userId').patchValue(randomClient._id);
  }

  public generateRandomClientFromDb() {
    const from = this.winnerFormGroup.get('winner_startDate').value;
    const to = this.winnerFormGroup.get('winner_endDate').value;
    const country = this.winnerFormGroup.get('winner_country').value;
    const minimumValue = this.winnerFormGroup.get('winner_minValue').value;

    this.offersService
      .getPotentialWinners(from, to, country, minimumValue)
      .subscribe(data => {
        this.winnerFormGroup.get('winner_userId').patchValue(data.winner);
      });
  }

  public randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  public get percentTargetGroupValue() {
    return this.percentFormGroup.get('percent_targetGroup').value;
  }

  public percentTargetGroupChanged(data: string) {
    if (data && typeof data === "string") {
      this.percentFormGroup.get('percent_targetGroup').patchValue(data, { emitEvent: false });
    }
  }

  public get valueTargetGroupValue() {
    return this.valueFormGroup.get('value_targetGroup').value;
  }

  public valueTargetGroupChanged(data: string) {
    if (data && typeof data === "string") {
      this.valueFormGroup.get('value_targetGroup').patchValue(data, { emitEvent: false });
    }
  }

  public get freeProductTargetGroupValue() {
    return this.productFormGroup.get('product_targetGroup').value;
  }

  public freeProductTargetGroupChanged(data: string) {
    if (data && typeof data === "string") {
      this.productFormGroup.get('product_targetGroup').patchValue(data, { emitEvent: false });
    }
  }
} 
