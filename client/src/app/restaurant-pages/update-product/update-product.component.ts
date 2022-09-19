import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as swal from "sweetalert2";
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { MenuServiceService } from '../../services/menu-service.service';
import { AuthService } from 'app/services/auth.service';
import { CompanyCategoryService } from '../../services/company-category.service';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit {
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
  public id;
  public categories: any[];
  public subcategories: any[];
  public userId: any;

  constructor(public categoryService: CategoryService,public productFormBuilder: UntypedFormBuilder, private productService: ProductService, private router:Router, private activeRoute: ActivatedRoute, public menuServiceService:MenuServiceService,  public authService: AuthService,  public companyCategoryService: CompanyCategoryService) {
    this.productFormGroup = productFormBuilder.group({
      productCode: this.productCode,
      name: this.name,
      description: this.description,
      imageURL: this.imageURL,
      price: this.price,
      unit: this.unit,
      category: this.category,
      subcategory: this.subcategory
    });
    this.userId = this.authService.getUser().companyId;
    
    this.companyCategoryService
    .getAllCategoriesSelect(this.userId)
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe((data) => {
      console.log(data);
      this.categories = data.categories;
    },error =>{
      swal.default.fire("Njoftim",error.error.error, 'warning');
    })

    this.activeRoute.paramMap.subscribe(params => { 
      this.id = params.get("id");
      this.menuServiceService.getProduct(this.id)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe(data => {
          this.productCode.setValue(data.product.productCode);
          this.name.setValue(data.product.name);
          this.description.setValue(data.product.description);
          this.unit.setValue(data.product.unit);
          this.price.setValue(data.product.price);
          this.imageURL.setValue(data.product.imageURL);
          this.category.setValue(data.product.categoryId);
          this.subcategory.setValue(data.product.subcategoryId);
          this.categoryService
            .getSubcategories(data.product.categoryId, 'restaurant')
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((data) => {
              this.subcategories = data.subcategories;
            },error =>{
              swal.default.fire("Njoftim",error.error.error, 'warning');
            })
        })
    })

    
    
   }

   changeCat(e) {

    this.categoryService
      .getSubcategories(this.productFormGroup.get('category').value, 'restaurant')
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data) => {
        this.subcategories = data.subcategories;
      },error =>{
        swal.default.fire("Njoftim",error.error.error, 'warning');
      })
  }
  
  get getProductFormGroup():any {return this.productFormGroup.controls};

  getProductFormValue(inputN):any {return this.productFormGroup.get(inputN).value};
  ngOnInit(): void {
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

      this.menuServiceService.updateProduct(this.id, body)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data:any) => {
          swal.default.fire("Sukses","Produkti u ndryshua me sukses", 'success');
          this.router.navigate(['/company/products']);
        }, 
        error =>{
          swal.default.fire("Njoftim",error.error.error, 'warning');
        })
    }
  }

}

