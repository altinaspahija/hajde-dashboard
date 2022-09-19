import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TargetGroupService } from 'app/services/target-groups.service';
import * as swal from "sweetalert2";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  constructor(
    private targetGroupService: TargetGroupService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.targetGroupService.getAll()
      .subscribe(
        (data) => {
          this.targetGroups = data;
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

  public targetGroups: any[] = [];
  public loading: boolean = false;

  public delete(countryId: string) {
    swal.default.fire({
      title: "A jeni i sigurt që doni të fshini këtë target group?",
      text: "Nuk mund ta ktheni këtë veprim",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if (result.value) {
        this.targetGroupService.remove(countryId)
          .subscribe(() => {
            swal.default.fire("Sukses", "Target group është fshirë me sukses", 'success');
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
              this.router.navigate(["/admin/target-groups"]));
          });
      }
    }, (error) => {
      swal.default.fire("Njoftim", error.error.error, 'warning');
    })
  }
}
