import { Component, OnInit } from '@angular/core';
import {ProductService} from '../../services/product.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as swal from "sweetalert2";
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { MenuServiceService } from '../../services/menu-service.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit {
  public product: any;
  public id;
  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private productService: ProductService,  private activeRoute: ActivatedRoute,  private router: Router, public menuServiceService: MenuServiceService) {
    this.activeRoute.paramMap.subscribe(params => { 
      this.id = params.get("id");
      this.menuServiceService.getProduct(this.id)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe(data => {
          this.product = data.product;
        });
    })
  }

  ngOnInit(): void {
  }

  delete() {
    swal.default.fire({
      title: "A jeni i sigurt që doni të fshini këtë produktin?",
      text: "Nuk mund ta ktheni këtë veprim",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if (result.value) {
        this.menuServiceService.deleteProduct(this.id)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe(data => {
          swal.default.fire("Sukses", "Produkti është fshirë me sukses", 'success');
          this.router.navigate(['/company/products']);
        }, (error) => {
          swal.default.fire("Njoftim", error.error.error, 'warning');
        })
      }
    });
   
  }

}
