import { Component, OnInit } from '@angular/core';
import {ProductService} from '../../services/product.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as swal from "sweetalert2";
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  public product: any;
  public id;
  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private productService: ProductService,  private activeRoute: ActivatedRoute,  private router: Router) {
    this.activeRoute.paramMap.subscribe(params => { 
      this.id = params.get("productId");
      this.productService.getProduct(this.id)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe(data => {
          this.product = data.product;
        });
    })
  }

  ngOnInit(): void {
  }

  

}
