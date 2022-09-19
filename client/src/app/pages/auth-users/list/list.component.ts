import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountsService } from 'app/services/accounts.service';
import * as swal from "sweetalert2";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  constructor(
    private accountsService: AccountsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.accountsService.getAll()
      .subscribe(
        (data) => {
          this.accounts = data;
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

  public accounts: any[] = [];
  public loading: boolean = false;

  public disable(accountId: string) {
    swal.default.fire({
      title: "A jeni i sigurt që doni të deaktivizoni këtë shfrytezues?",
      text: "Nuk mund ta ktheni këtë veprim",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if (result.value) {
        this.accountsService.disable(accountId)
          .subscribe(() => {
            swal.default.fire("Sukses", "Shfrytezuesi është deaktivizuar me sukses", 'success');
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
              this.router.navigate(["/admin/auth-users"]));
          });
      }
    }, (error) => {
      swal.default.fire("Njoftim", error.error.error, 'warning');
    })
  }

  public enable(accountId: string) {
    swal.default.fire({
      title: "A jeni i sigurt që doni të aktivizoni këtë shfrytezues?",
      text: "Nuk mund ta ktheni këtë veprim",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if (result.value) {
        this.accountsService.enable(accountId)
          .subscribe(() => {
            swal.default.fire("Sukses", "Shfrytezuesi është aktivizuar me sukses", 'success');
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
              this.router.navigate(["/admin/auth-users"]));
          });
      }
    }, (error) => {
      swal.default.fire("Njoftim", error.error.error, 'warning');
    })
  }

  public delete(accountId: string) {
    swal.default.fire({
      title: "A jeni i sigurt që doni të fshini këtë shfrytezues?",
      text: "Nuk mund ta ktheni këtë veprim",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if (result.value) {
        this.accountsService.remove(accountId)
          .subscribe(() => {
            swal.default.fire("Sukses", "Shfrytezuesi është fshirë me sukses", 'success');
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
              this.router.navigate(["/admin/auth-users"]));
          });
      }
    }, (error) => {
      swal.default.fire("Njoftim", error.error.error, 'warning');
    })
  }
}
