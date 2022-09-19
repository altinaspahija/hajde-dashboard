import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { Subject } from 'rxjs';
import { last, takeUntil } from 'rxjs/operators';
import * as swal from "sweetalert2";
import { Router,ActivatedRoute } from '@angular/router';
import { NgxPrinterService } from 'ngx-printer';
import { ProductService } from '../../services/product.service';
import { UntypedFormBuilder, UntypedFormControl, FormGroup, Validators } from '@angular/forms';
import { MenuServiceService } from '../../services/menu-service.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
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
  public productForms: Object = {};
  public productId = new UntypedFormControl('', [Validators.required]);
  public submittedProducts = {}; 
  public submittedNProducts = {}; 
  public products: any[];
  public productSelected;
  public modelVisisble = false;

  public Object = Object;
  constructor(private orderService: OrdersService, private activeRoute: ActivatedRoute, private printerService: NgxPrinterService, public productService: ProductService, public typedProductFormBuiled: UntypedFormBuilder, public productFormBuiled: UntypedFormBuilder, private router: Router, public menuServiceService:MenuServiceService) { 
    this.activeRoute.paramMap.subscribe(params => { 
      this.id = params.get("id");
      this.loadData(this.id);
    });
  }
  public getProductFormGroup(id):any { return this.typedProductForms[`${id}`].controls};
  public getNProductFormGroup(id):any { return this.productForms[`${id}`].controls};
  @ViewChild('printSection') public templateRef: TemplateRef<any>;
  public offerTypes: any = {
    "percentDiscount": "Zbritje me përqindje",
    "AmountDiscount": "Zbritje me vlerë",
    "ExtraFreeProduct": "Produkt falas",
    "PercentDiscountWinner": "Fituesi i një zbritje me përqindje"
  }  


  printThis() {
    this.printerService.printAngular(this.printerService.printAngular(this.templateRef));
  }

  ngOnInit(): void {
  }

  editProduct(id) {
    const productFound = this.products.find(p => p._id === id);
    if (productFound) {
      this.productSelected = productFound;
      this.modelVisisble = true;
    }
  }

  closeModal() {
    if (this.products && this.products.length > 0) {
      const lastProduct = this.products.pop();
      if (lastProduct) {
        if (!lastProduct.name && !lastProduct.price) {
          this.products.splice(this.products.length, 1);
        }
      }
    }

    this.productSelected = null;
    this.modelVisisble = false;
  }

  loadData(id) {
    this.orderService.getOrderByID(this.id)
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe((data:any) => {
     this.order = data.order;
     for(let opt of data.order.typedProducts) {
      this.typedProductForms[`${opt._id}`] = this.typedProductFormBuiled.group({
        'productId': new UntypedFormControl(null, [Validators.required])
      });

      this.submittedProducts[opt._id] = false;
    }
    this.products = data.order.products
    

     console.log(this.order);

     if(this.order.type == "market") {
      this.productService.getProduts(this.order.company._id)
      .subscribe((data: any) => {
          this.options = data.products.products;
        
      }, error => {
        swal.default.fire("Gabim",error.error.error, 'error');
      });

     } else {
      this.menuServiceService.getProduts(this.order.company._id)
      .subscribe((data: any) => {
          this.options = data.products.products;
        
      }, error => {
        swal.default.fire("Gabim",error.error.error, 'error');
      });

     }
    
      for(let prod of data.order.products) {
        
        if(prod !== {}) {
          this.productForms[prod._id] =  this.productFormBuiled.group({
            'product_id': new UntypedFormControl(prod.product_id, [Validators.required]),
            'quantity': new UntypedFormControl(prod.quantity, [Validators.required, Validators.min(1), Validators.max(100)]),
          });
          this.submittedNProducts[prod._id] = false;
        }
      }
    },error =>{
      swal.default.fire("Gabim",error.error.error, 'error');
    })
  }
  

  addTypedProduct(id, quantity) {
    this.submittedProducts[id] = true;
    
    if (this.typedProductForms[id].valid) {
      const objTBD = {
        productId: this.typedProductForms[id].get('productId').value,
        quantity,
        _id: id
      }

      this.orderService.addProduct(this.id, objTBD)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe(data => {
          swal.default.fire("Sukses","Produkti u shtua", 'success');
           this.loadData(this.id);
        }, error => {
          swal.default.fire("Gabim",error.error.error, 'error');
        })
    }
  }


  deleteTproduct(e,pid) {
    e.preventDefault();
    swal.default.fire({
      title: "A jeni të sigurt që dëshiron ta fshini këtë produkt?",
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if(result.value) {
        this.orderService.deleteService(this.id,{_id:pid})
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe(data => {
      swal.default.fire("Sukses", "Produkti është fshi me sukses", 'success');
      this.loadData(this.id);
    }, (error) => {
      swal.default.fire("Gabim", error.error.error, 'error');
    })
      }
    });
  }

  addNewProduc() {
    let vl = `new-${Math.floor(Math.random() * 999999999) + 1  }`;
    this.submittedNProducts[vl] = false;
    this.productForms[vl] =  this.productFormBuiled.group({
      'product_id': new UntypedFormControl(null, [Validators.required]),
      'quantity': new UntypedFormControl(null, [Validators.required, Validators.min(1), Validators.max(100)]),
    });

    this.products.push({_id :vl});
    this.editProduct(vl);
  }

  rejectOrder() {
    swal.default.fire({
      title: "A jeni i sigurt që doni ta refuzoni këtë porosi",
      text: "Nuk mund ta ktheni këtë veprim",
      icon: 'warning',
      input: 'textarea',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if (result.value){
        this.orderService.rejectOrder(this.id, result.value)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data:any) => {
          swal.default.fire("Sukses", "Porosia është refuzuar me sukses", 'success');
          this.router.navigate(['/admin/orders'])
        },error =>{
          swal.default.fire("Gabim",error.error.error, 'error');
        })
      }
    });
  }

  deleteProduct(e,pid) {
    e.preventDefault();
    swal.default.fire({
      title: "A jeni të sigurt që dëshiron ta fshini këtë produkt?",
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if(result.value) {
        if(pid.indexOf("new") > -1) {
         let index;
         this.products.forEach((v,i) => {
           if(v._id == pid)  index = i
         });
         Object.keys(this.productForms[pid].controls).forEach(e => {
         
          this.productForms[pid].removeControl(e);
          this.productForms[pid].updateValueAndValidity();
         });
         
         document.getElementById(pid).remove();
        
         
        } else {
          this.orderService.deleteProduct(this.id, pid)
          .pipe(takeUntil(this.unsubscribeAll))
          .subscribe(data => {
            swal.default.fire("Sukses", "Produkti është fshi me sukses", 'success');
            this.loadData(this.id);
          }, (error) => {
            swal.default.fire("Gabim", error.error.error, 'error');
          })
        }
       
      }
    });
  }

  confirmOrder() {
    swal.default.fire({
      title: "A jeni i sigurt që doni ta konfirmoni këtë porosi",
      text: "Nuk mund ta ktheni këtë veprim",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if (result.value){
        if(this.order.typedProducts.length == 0) {
          this.orderService.approveOrder(this.id)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data:any) => {
          swal.default.fire("Sukses", "Porosia është konfirmuar me sukses", 'success');
          this.router.navigate(['/admin/orders'])
        },error =>{
          swal.default.fire("Gabim",error.error.error, 'error');
        })
        } else {
          swal.default.fire("Njoftim","Duheni të kompletoni produktet e shtuara", 'warning');
        }
        
      }
    });
  }

  readyOrder() {
    swal.default.fire({
      title: "A jeni i sigurt që doni ta konfirmoni këtë status",
      text: "Nuk mund ta ktheni këtë veprim",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if (result.value){
        if(this.order.typedProducts.length == 0) {
          this.orderService.readyOrder(this.id)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data:any) => {
          swal.default.fire("Sukses", "Statusi është ndryshuar me sukses", 'success');
          this.router.navigate(['/admin/orders'])
        },error =>{
          swal.default.fire("Gabim",error.error.error, 'error');
        })
        }
      }
    });
  }

  updatePrdouct(id, oldPrice) {
    // FIX
    this.submittedNProducts[id] = true;
    if (this.productForms[id].valid) {
      let objTBD = {
        productId: this.productForms[id].get('product_id').value,
        quantity: this.productForms[id].get('quantity').value, 
        supplierType: this.order.type
      }
        if(id.includes("new")) {
          this.orderService.addProduct(this.id, objTBD)
          .pipe(takeUntil(this.unsubscribeAll))
          .subscribe(data => {
            swal.default.fire("Sukses","Produkti u shtua", 'success');
            this.loadData(this.id);
            this.productSelected = null;
            this.modelVisisble = false;
          }, error => {
            swal.default.fire("Gabim",error.error.error, 'error');
          })
        } else {
          objTBD['oldPrice'] = oldPrice;
          this.orderService.updateProduct(this.id, id, objTBD)
          .pipe(takeUntil(this.unsubscribeAll))
          .subscribe(data => {
            swal.default.fire("Sukses","Produkti u ndryshua", 'success');
            this.loadData(this.id);
            this.productSelected = null;
            this.modelVisisble = false;
          }, error => {
            swal.default.fire("Gabim",error.error.error, 'error');
          })
        }
    }    
  }

  getCompanyName(offer) {
    
    if(offer.offerProvider == "hajde") return 'nga hajde';
    if(offer.offerProvider == "market" && offer.company ) return `nga ${offer.company.company}`;
    if(offer.offerProvider == "restaurant"  && offer.restaurant) return `nga ${offer.restaurant.name}`;
    
  }

}
