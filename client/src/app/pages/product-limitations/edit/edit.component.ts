import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductLimitationService } from 'app/services/product-limitation.service';
import * as swal from "sweetalert2";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  constructor(
    private productLimitationsService: ProductLimitationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  public productId: string;
  public quantity: number;
  public period: string;
  private productLimitId: string;
  public products: any[] = [];

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      this.productLimitId = params["id"];

      if (this.productLimitId) {

        this.productLimitationsService.get(this.productLimitId)
          .subscribe(data => {
            if (data) {
              this.productId = data.productId;
              this.quantity = data.limit;
              this.period = data.period;
            }
          });

        this.productLimitationsService.getAllProducts()
          .subscribe(data => {
            this.products = data;
          });
      }
    });
  }

  save() {
    if (this.productId && this.quantity && this.period) {
      this.productLimitationsService.update(this.productLimitId, {
        "limit": this.quantity,
        "period": this.period,
        "productId": this.productId,
        "active": true
      })
        .subscribe(() => {
          swal.default.fire("Sukses", "U ndryshua me sukses limiti " + this.productId, 'success');
          this.router.navigate(['/admin/product-limitations']);
        });
    }
  }
}
