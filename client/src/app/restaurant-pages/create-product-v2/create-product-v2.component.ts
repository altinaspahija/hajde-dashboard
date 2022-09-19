import { Component, OnInit } from '@angular/core';
import { RestaurantsService } from "../../services/restaurants.service";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as swal from "sweetalert2";
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, UntypedFormArray } from '@angular/forms';
import { Router } from '@angular/router';

// product services
import { CategoryService } from '../../services/category.service';
import { CompanyCategoryService } from '../../services/company-category.service';
import { AuthService } from 'app/services/auth.service';
import { ImportProductsService } from 'app/services/import-products.service';

@Component({
  selector: 'app-create-product-v2',
  templateUrl: './create-product-v2.component.html',
  styleUrls: ['./create-product-v2.component.css']
})
export class CreateProductV2Component implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  public productsList = new UntypedFormArray([]);

  public companyFormGroup: UntypedFormGroup;
  public submittedCompany = false;
  public errorMessage;
  public categories: any[];
  public subcategories: any[];
  public products: any[];
  public id: string;

  constructor(public importProductsService: ImportProductsService, public categoryService: CategoryService, public companyFormBuilder: UntypedFormBuilder, private restuarantService: RestaurantsService, private router: Router, public companyCategoryService: CompanyCategoryService, public authService: AuthService) {
    this.companyFormGroup = companyFormBuilder.group({
      productsList: this.productsList,
    }, {
      validators: []
    });
    this.id = this.authService.getUser().companyId;
    this.companyCategoryService
      .getAllCategoriesSelect(this.id)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data) => {
        this.categories = data.categories;
        this.categoryService
        .getSubcategories(data?.categories[0]?._id, "restaurant")
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data) => {
          this.subcategories = data.subcategories;
        }, error => {
          swal.default.fire("Njoftim", error.error.error, 'warning');
        })
      }, error => {
        swal.default.fire("Njoftim", error.error.error, 'warning');
      })
    this.importProductsService
      .getProducts()
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data) => {
        this.products = data.products;
        if(data?.products?.length){
          for (let product of data.products) {
            this.productsList.push(new UntypedFormGroup({
              _id: new UntypedFormControl(product._id),
              productCode: new UntypedFormControl(product.productCode, [Validators.required]),
              name: new UntypedFormControl(product.name, [Validators.required]),
              description: new UntypedFormControl(product.description, [Validators.required]),
              unit: new UntypedFormControl(product.unit, [Validators.required]),
              price: new UntypedFormControl(product.price, [Validators.required]),
              imageURL: new UntypedFormControl(product.imageURL, [Validators.required]),
              categoryId: new UntypedFormControl(product.categoryId, [Validators.required]),
              subcategoryId: new UntypedFormControl(product.subcategoryId, [Validators.required]),
            }))
          }
        }else{
          this.productsList.push(new UntypedFormGroup({
            productCode: new UntypedFormControl('', [Validators.required]),
            name: new UntypedFormControl('', [Validators.required]),
            description: new UntypedFormControl('', [Validators.required]),
            unit: new UntypedFormControl('', [Validators.required]),
            price: new UntypedFormControl('', [Validators.required]),
            imageURL: new UntypedFormControl('', [Validators.required]),
            categoryId: new UntypedFormControl('', [Validators.required]),
            subcategoryId: new UntypedFormControl('', [Validators.required]),
          }))
        }
      }, error => {
        swal.default.fire("Njoftim", error.error.error, 'warning');
      })
  }

  ngOnInit(): void {}

  get getCompanyFormGroup(): any { return this.companyFormGroup.controls };

  get addressesList(): UntypedFormArray {
    return this.companyFormGroup.get('productsList') as UntypedFormArray;
  }

  addAddress(e) {
    e.preventDefault();
    this.productsList.push(new UntypedFormGroup({
      productCode: new UntypedFormControl('', [Validators.required]),
      name: new UntypedFormControl('', [Validators.required]),
      description: new UntypedFormControl('', [Validators.required]),
      unit: new UntypedFormControl('', [Validators.required]),
      price: new UntypedFormControl('', [Validators.required]),
      imageURL: new UntypedFormControl('', [Validators.required]),
      categoryId: new UntypedFormControl('', [Validators.required]),
      subcategoryId: new UntypedFormControl('', [Validators.required]),
    }))
  }

  removeAddress(e, i) {
    e.preventDefault();
    if (i != 0) {
      this.productsList.removeAt(i);
    }
  }

  addCompany() {
    this.submittedCompany = true;

    this.importProductsService
        .uploadProducts(this.productsList.value)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data) => {
          swal.default.fire("Sukses", "Produktet u perditsuan me sukses", 'success');
          this.router.navigate(['/restaurant/products'])
        }, error => {
          swal.default.fire("Njoftim", error, 'warning');
        })
  }
}
