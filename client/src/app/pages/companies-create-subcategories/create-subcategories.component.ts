import { Component, OnInit } from '@angular/core';
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
import { CompanyService } from 'app/services/company.service';

@Component({
  selector: 'app-create-subcategories',
  templateUrl: './create-subcategories.component.html',
  styleUrls: ['./create-subcategories.component.css']
})
export class CreateSubcategoriesCompaniesComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  public productsList = new UntypedFormArray([]);

  public companyFormGroup: UntypedFormGroup;
  public submittedCompany = false;
  public errorMessage;
  public categories: any[] = [];
  public subcategories: any[] = [];
  public selectedSubcategories: any[] = [];
  public products: any[] = [];
  public id: string;
  public companies: any[] = [];
  public copySubcategoryCompanySelected: any = "";

  constructor(
    public importProductsService: ImportProductsService,
    public categoryService: CategoryService,
    public companyFormBuilder: UntypedFormBuilder,
    private subcategoriesService: SubcategoriesService,
    private router: Router,
    public companyCategoryService: CompanyCategoryService,
    public authService: AuthService,
    private activeRoute: ActivatedRoute,
    private companyService: CompanyService
  ) {
    this.activeRoute.paramMap.subscribe(params => {
      this.id = params.get("id");
    });
  }

  getCompanyData(id: string) {
    this.companyFormGroup = this.companyFormBuilder.group({
      productsList: this.productsList,
    }, {
      validators: []
    });

    this.subcategoriesService
      .getCompaniesSubcategories(id)
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
      .getAllCategoriesSelect(id)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data) => {
        this.categories = data.categories;
        for (let category of data.categories) {
          this.categoryService
            .getSubcategories(category._id, "market")
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((data) => {
              for (let d of data.subcategories) {
                this.subcategories.push(d);
              }
            }, error => {
              swal.default.fire("Njoftim", error.error.error, 'warning');
            })
        }
      }, error => {
        swal.default.fire("Njoftim", error.error.error, 'warning');
      })
  }

  ngOnInit(): void {
    this.getCompanyData(this.id);
    this.companyService.getAllComp()
      .subscribe(data => {
        this.companies = data.companies;
      })
  }

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
      this.productsList.removeAt(i);
  }

  addCompany() {
    this.submittedCompany = true;
    this.subcategoriesService
      .createCompaniesSubcategories(this.id, this.productsList.value)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data) => {
        swal.default.fire("Sukses", "Nënkategoritë u perditsuan me sukses", 'success');
        this.router.navigate(['/admin/companies'])
      }, error => {
        swal.default.fire("Njoftim", error, 'warning');
      })
  }

  copySubCategoriesFromCompany() {
    if (this.copySubcategoryCompanySelected) {
      console.log(this.copySubcategoryCompanySelected);
      this.getCompanyData(this.copySubcategoryCompanySelected);
    }
  }
}


