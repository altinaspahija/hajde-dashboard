import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service'
import { ImporterService } from '../../services/importer.service'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as swal from "sweetalert2";
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-import-products',
  templateUrl: './import-products.component.html',
  styleUrls: ['./import-products.component.css']
})
export class ImportProductsComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  public sheetUrl =  new UntypedFormControl('', [Validators.required]);
  public productFormGroup: UntypedFormGroup;
  public submittedProduct = false;
  public companyId;

  constructor(public productFormBuilder: UntypedFormBuilder, private productService: ProductService, private router:Router, private activeRoute: ActivatedRoute, 
    private importerService: ImporterService) {
    this.productFormGroup = productFormBuilder.group({
      sheetUrl: this.sheetUrl,
    });

    this.getConfig();
    
   }
  
  get getProductFormGroup():any {return this.productFormGroup.controls};
  ngOnInit(): void {}

  addProduct() {
    this.submittedProduct = true;
    if(this.productFormGroup.valid) {
      const body = {
        sheetUrl: this.productFormGroup.get('sheetUrl').value
      };


      swal.default.fire({
        title: 'Duke importuar...',
        didOpen: () => {
          swal.default.showLoading()
          
        },
        allowOutsideClick: false
      })

      this.productService.import(body)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data:any) => {
          swal.default.fire("Sukses","Importimi u përfundua me sukses", 'success');
          this.router.navigate(['/company/products']);
        }, 
        error =>{
          swal.default.fire("Njoftim",error.error.error, 'warning');
        })
    }
  }



  saveConfig(e) {
    e.preventDefault();
    this.submittedProduct = true;
    if(this.productFormGroup.valid) {
      const body = {
        sheetUrl: this.productFormGroup.get('sheetUrl').value
      };
      this.importerService.save(body)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data:any) => {
          swal.default.fire("Sukses","Konfigurimi u ruajt me sukses", 'success');
          this.getConfig();
        }, 
        error =>{
          console.log(error)
          swal.default.fire("Njoftim",error.error.error, 'warning');
        })
    }
  }

  getConfig() {
    this.importerService.get()
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe(data => {
     if (data.importer != null) {
      this.sheetUrl.setValue(data.importer.sheetUrl);
     }
    })
  }

  generateSheet(e) {
    e.preventDefault();
    this.productService
      .generategooglesheet()
      .subscribe(data => {
        if (data.spreadsheetUrl != null) {
          window.open(data.spreadsheetUrl, '_blank')
        }
       })
  }

}
