import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductLimitationService } from 'app/services/product-limitation.service';
import * as swal from "sweetalert2";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  constructor(
    private productLimitationsService: ProductLimitationService,
    private router: Router
  ) { }

  public title: string;
  public selectedClient: string;
  public products: any;
  public clientsTable: any = [];

  public productId: string;
  public quantity: number;
  public period: string;

  ngOnInit(): void {
    this.productLimitationsService.getAllProducts()
      .subscribe(data => {
        this.products = data;
      })
  }

  save() {
    if (this.productId && this.quantity && this.period) {
      this.productLimitationsService.create({
        "limit": this.quantity,
        "period": this.period,
        "productId": this.productId,
        "active": true
    })
        .subscribe(() => {
          swal.default.fire("Sukses", "U krijua me sukses limiti " + this.title, 'success');
          this.router.navigate(['/admin/product-limitations']);
        });
    }
  }

}
