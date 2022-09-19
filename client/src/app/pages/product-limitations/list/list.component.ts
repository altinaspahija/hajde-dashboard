import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductLimitationService } from 'app/services/product-limitation.service';
import * as swal from "sweetalert2";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  constructor(
    private productLimitationService: ProductLimitationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.productLimitationService.getAll()
      .subscribe(
        (data) => {
          this.productLimitations = data;
          this.loading = true;
        },
        (err) => {
          this.loading = true;
        },
        () => {
          this.loading = true;
        }
      );
  }

  public productLimitations: any[] = [];
  public loading: boolean = false;

  public delete(countryId: string) {
    swal.default.fire({
      title: "A jeni i sigurt që doni të fshini këtë limitim?",
      text: "Nuk mund ta ktheni këtë veprim",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if (result.value) {
        this.productLimitationService.remove(countryId)
          .subscribe(() => {
            swal.default.fire("Sukses", "Limitimi është fshirë me sukses", 'success');
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
              this.router.navigate(["/admin/product-limitations"]));
          });
      }
    }, (error) => {
      swal.default.fire("Njoftim", error.error.error, 'warning');
    })
  }
}
