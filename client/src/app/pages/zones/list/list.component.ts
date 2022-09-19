import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ZoneService } from 'app/services/zone.service';
import * as swal from "sweetalert2";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  constructor(
    private zonesService: ZoneService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.zonesService.getAll()
      .subscribe(
        (data) => {
          this.zones = data;
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

  public zones: any[] = [];
  public loading: boolean = false;

  public delete(zoneId: string) {
    swal.default.fire({
      title: "A jeni i sigurt që doni të fshini këtë zonë?",
      text: "Nuk mund ta ktheni këtë veprim",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if (result.value) {
        this.zonesService.remove(zoneId)
          .subscribe(() => {
            swal.default.fire("Sukses", "Zona është fshirë me sukses", 'success');
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
              this.router.navigate(["/admin/zones"]));
          });
      }
    }, (error) => {
      swal.default.fire("Njoftim", error.error.error, 'warning');
    })
  }
}
