import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service'
import { MenuServiceService } from '../../services/menu-service.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as swal from "sweetalert2";
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { CompanyCategoryService } from '../../services/company-category.service';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {

  private unsubscribeAll: Subject<any> = new Subject<any>();
  public productCode =  new UntypedFormControl('', [Validators.required]);
  public name = new UntypedFormControl('', [Validators.required]);
  public description = new UntypedFormControl('', [Validators.required]);
  public unit = new  UntypedFormControl('', [Validators.required]);
  public price = new UntypedFormControl('', [Validators.required]);
  public imageURL = new UntypedFormControl('', [Validators.required]);
  public category = new UntypedFormControl('', [Validators.required]);
  public subcategory = new UntypedFormControl('', [Validators.required]);
  public productFormGroup: UntypedFormGroup;
  public submittedProduct = false; 
  public categories: any[];
  public subcategories: any[];
  public id: string;

  constructor(public categoryService: CategoryService,public productFormBuilder: UntypedFormBuilder, private productService: ProductService, private router:Router, public menuServiceService: MenuServiceService, public companyCategoryService: CompanyCategoryService, public authService: AuthService) {
    this.productFormGroup = productFormBuilder.group({
      productCode: this.productCode,
      name: this.name,
      description: this.description,
      imageURL: this.imageURL,
      price: this.price,
      unit: this.unit,
      category: this.category,
      subcategory: this.subcategory
    })
    this.id = this.authService.getUser().companyId;
    this.companyCategoryService
      .getAllCategoriesSelect(this.id)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data) => {
        this.categories = data.categories;
      },error =>{
        swal.default.fire("Njoftim",error.error.error, 'warning');
      })
   }
  
  getProductFormValue(inputN):any {return this.productFormGroup.get(inputN).value};

  get getProductFormGroup():any {return this.productFormGroup.controls};

  ngOnInit(): void {
  }

  changeCat(e) {
    this.categoryService
      .getSubcategories(this.productFormGroup.get('category').value, "restaurant")
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data) => {
        this.subcategories = data.subcategories;
      },error =>{
        swal.default.fire("Njoftim",error.error.error, 'warning');
      })
  }

  addProduct() {
    this.submittedProduct = true;
    if(this.productFormGroup.valid) {
      const body = {
        productCode:  this.productFormGroup.get('productCode').value,
        name: this.productFormGroup.get('name').value,
        description: this.productFormGroup.get('description').value,
        imageURL: this.productFormGroup.get('imageURL').value,
        price: this.productFormGroup.get('price').value,
        unit: this.productFormGroup.get('unit').value,
        categoryId: this.productFormGroup.get('category').value,
        subcategoryId: this.productFormGroup.get('subcategory').value,
      };
      
      
      this.menuServiceService.createProduct(body)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data:any) => {
          swal.default.fire("Sukses","Produkti u shtua me sukses", 'success');
          this.router.navigate(['/company/products']);
        }, 
        error =>{
          swal.default.fire("Njoftim",error.error.error, 'warning');
        })
    }
  }
}
