import { Component, OnInit } from '@angular/core';
import { RestaurantsService } from "../../services/restaurants.service";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as swal from "sweetalert2";
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, UntypedFormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// product services
import { CategoryService } from '../../services/category.service';
import { CompanyCategoryService } from '../../services/company-category.service';
import { AuthService } from 'app/services/auth.service';
import { ImportProductsService } from 'app/services/import-products.service';
import { SubcategoriesService } from 'app/services/subcategories.service';

@Component({
  selector: 'app-create-subcategories',
  templateUrl: './create-subcategories.component.html',
  styleUrls: ['./create-subcategories.component.css']
})
export class CreateSubcategoriesRestaurantsComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  public productsList = new UntypedFormArray([]);

  public companyFormGroup: UntypedFormGroup;
  public submittedCompany = false;
  public errorMessage;
  public categories: any[];
  public subcategories: any[];
  public selectedSubcategories: any[];
  public products: any[];
  public id: string;

  constructor(
    public importProductsService: ImportProductsService,
    public categoryService: CategoryService,
    public companyFormBuilder: UntypedFormBuilder,
    private subcategoriesService: SubcategoriesService,
    private router: Router,
    public companyCategoryService: CompanyCategoryService,
    public authService: AuthService,
    private activeRoute: ActivatedRoute
  ) {
    this.activeRoute.paramMap.subscribe(params => {
      this.id = params.get("id");
    })
    this.companyFormGroup = companyFormBuilder.group({
      productsList: this.productsList,
    }, {
      validators: []
    });
    this.subcategoriesService
      .getRestaurantSubcategories(this.id)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data) => {
        if (data?.data?.length) {
          for (let product of data.data) {
            this.productsList.push(new UntypedFormGroup({
              categoryCode: new UntypedFormControl(product.categoryCode, [Validators.required]),
              companyId: new UntypedFormControl(this.id),
              subCategoryCode: new UntypedFormControl(product.subCategoryCode || product.subcategoryCode, [Validators.required]),
              subcategoryId: new UntypedFormControl(product.subcategoryId, [Validators.required]),
              _id: new UntypedFormControl(product._id),
            }))
          }
        } else {
          this.productsList.push(new UntypedFormGroup({
            categoryCode: new UntypedFormControl('', [Validators.required]),
            companyId: new UntypedFormControl(this.id),
            subCategoryCode: new UntypedFormControl('', [Validators.required]),
            subcategoryId: new UntypedFormControl('', [Validators.required]),
            _id: new UntypedFormControl(''),
          }))
        }
      }, error => {
        swal.default.fire("Njoftim", error.error.error, 'warning');
      })
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
  }

  ngOnInit(): void { }

  get getCompanyFormGroup(): any { return this.companyFormGroup.controls };

  get addressesList(): UntypedFormArray {
    return this.companyFormGroup.get('productsList') as UntypedFormArray;
  }

  addAddress(e) {
    e.preventDefault();
    this.productsList.push(new UntypedFormGroup({
      categoryCode: new UntypedFormControl('', [Validators.required]),
      companyId: new UntypedFormControl(this.id),
      subCategoryCode: new UntypedFormControl('', [Validators.required]),
      subcategoryId: new UntypedFormControl('', [Validators.required]),
      _id: new UntypedFormControl(''),
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
       this.subcategoriesService
      .createRestaurantSubcategories(this.id, this.productsList.value)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data) => {
        swal.default.fire("Sukses", "Nënkategoritë u perditsuan me sukses", 'success');
        this.router.navigate(['/admin/restaurants'])
      }, error => {
        swal.default.fire("Njoftim", error, 'warning');
      })
  }
}


 