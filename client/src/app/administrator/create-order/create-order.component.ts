import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { CompanyService } from '../../services/company.service';
import { ClientsService } from '../../services/clients.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as swal from "sweetalert2";
import { Router,ActivatedRoute } from '@angular/router';
import { NgxPrinterService } from 'ngx-printer';
import { ProductService } from '../../services/product.service';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, UntypedFormArray } from '@angular/forms';
import { MenuServiceService } from '../../services/menu-service.service';
import { RestaurantsService } from '../../services/restaurants.service';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {
  public order: any;
  private id:any;
  private unsubscribeAll: Subject<any> = new Subject<any>();
  public langStatus = {
    'IN_PROGRESS': 'Në progres',
    'COMPLETED':'E kompletuar',
    'ISSUE':'Problem',
    'REJECTED':'E refuzuar',
    'PENDING':'Në pritje',
    'CANCELLED':'E anuluar',
    'CONFIRM': 'Konfirmuar'
  }
  public options;
  public typedProductForms: any = {};
  public companyId = new UntypedFormControl('', [Validators.required]);
  public clientId = new UntypedFormControl('', [Validators.required]);
  public orderType = new UntypedFormControl('market', [Validators.required]);
  public clientComment = new UntypedFormControl('');
  public prdcts = new UntypedFormArray([
    new UntypedFormGroup({
      'product_id': new UntypedFormControl(null, [Validators.required]),
      'quantity': new UntypedFormControl(null, [Validators.required, Validators.min(1), Validators.max(100)])
    })
  ])
  public productForms: UntypedFormGroup;

  public submittedProducts = false;
  
  public products: any[];
  public companies: any[];
  public clients: any[];

  constructor(
    private orderService: OrdersService, 
    private companyService: CompanyService, 
    public clientsService : ClientsService ,  
    public productService: ProductService,  
    public productFormBuiled: UntypedFormBuilder, 
    private router: Router,
    private menuServiceService: MenuServiceService,
    private restaurantsService: RestaurantsService) {
      this.productForms = productFormBuiled.group({
        orderType: this.orderType,
        companyId: this.companyId,
        clientId: this.clientId,
        clientComment: this.clientComment,
        prdcts: this.prdcts
      })

      this.companyService.getAllComp()
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe(data => {
          this.companies = data.companies;
        }, error => {
        swal.default.fire("Gabim",error.error.error, 'error');
      });

      this.clientsService.getAll()
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(data => {
        this.clients = data.clients;
      }, error => {
      swal.default.fire("Gabim",error.error.error, 'error');
    });
   }

  get getNProductFormGroup():any { return this.productForms.controls};

  ngOnInit(): void {
  }

  public loadProducts() {
    let type = this.productForms.get('orderType').value;
    if(type == "restaurant") {
      this.menuServiceService.getProduts(this.productForms.get('companyId').value)
      .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data: any) => {
            this.options = data.products.products;
            this.productForms.get('prdcts').reset();
        }, error => {
          swal.default.fire("Gabim",error.error.error, 'error');
        });
    } else if(type == "market") {
      this.productService.getProduts(this.productForms.get('companyId').value)
      .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data: any) => {
            this.options = data.products.products;
            this.productForms.get('prdcts').reset();
        }, error => {
          swal.default.fire("Gabim",error.error.error, 'error');
        });
    }
    
  }

  addNewProduc() {
    this.prdcts.push(new UntypedFormGroup({
      'product_id': new UntypedFormControl('', [Validators.required]),
      'quantity': new UntypedFormControl('', [Validators.required, Validators.min(1), Validators.max(100)]),
    }))
  }


  deleteProduct(e,i) {
    e.preventDefault();
   if(i != 0) {
     this.prdcts.removeAt(i);
   }
  }

  saveOrder() {
    this.submittedProducts = true;

    if(this.productForms.valid) {
      const data = {
        clientId: this.productForms.get('clientId').value,
        companyId: this.productForms.get('companyId').value,
        clientComment: this.productForms.get('clientComment').value,
        type: this.productForms.get("orderType").value,
        products: this.productForms.get('prdcts').value,
      }

      this.orderService.createOrder(data)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe(data => {
          swal.default.fire("Sukses","Porosia u shtua me sukses", 'success');
          this.router.navigate(['/admin/orders'])  
        }, (error:any) => {
          console.log(error);
          var decodedString = String.fromCharCode.apply(null, new Uint8Array(error.error));
          var obj = JSON.parse(decodedString);
          console.log(obj);
          swal.default.fire("Gabim", obj.message, 'error');
        })
    }
  }

  changeType() {
    let type = this.productForms.get('orderType').value;
    if(type == "restaurant") {
       this.restaurantsService.getAllRestaurants()
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe(data => {
          this.companies = data.restaurants;
        }, error => {
        swal.default.fire("Gabim",error.error.error, 'error');
      });
    } else if(type == "market") {
      this.companyService.getAllComp()
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(data => {
        this.companies = data.companies;
      }, error => {
      swal.default.fire("Gabim",error.error.error, 'error');
    });
    }
  }

}
