import { Component, OnInit } from '@angular/core';
import {ProductService} from '../../services/product.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as swal from "sweetalert2";
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { MenuServiceService } from '../../services/menu-service.service';

@Component({
  selector: 'app-menu-product',
  templateUrl: './menu-product.component.html',
  styleUrls: ['./menu-product.component.css']
})
export class MenuProductComponent implements OnInit {

  public product: any;
  public id;
  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private productService: ProductService,  private activeRoute: ActivatedRoute,  private router: Router, public menuServiceService: MenuServiceService) {
    this.activeRoute.paramMap.subscribe(params => { 
      this.id = params.get("productId");
      this.menuServiceService.getProduct(this.id)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe(data => {
          this.product = data.product;
        });
    })
  }

  ngOnInit(): void {
  }

}
