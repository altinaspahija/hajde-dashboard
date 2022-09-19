import { Component, OnInit } from '@angular/core';
import { CouriersService } from "../../services/couriers.service";
import { from, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as swal from "sweetalert2";

@Component({
  selector: 'app-couriers',
  templateUrl: './couriers.component.html',
  styleUrls: ['./couriers.component.css']
})
export class CouriersComponent implements OnInit {
  couriers:[];
  public name:string;
  public status:string = "";
  public phone:string;
  skip = 0
  length: Number = 0;
  limit = 15;
  public pages;
  public currentPage = 1;
  private unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(private courierService: CouriersService) { }

  ngOnInit(): void {
    this.getAllCouriers();
  }

  public getAllCouriers(page = 1, status = undefined, name = undefined, phone = undefined) {
    this.courierService.getAllCouriers(page,status, phone, name) 
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe(data => {
      this.skip = data.skip;
      this.pages = data.pages;
      this.couriers = data.couriers;
    }, (error) => {
      swal.default.fire("Gabim",error.error.error, 'error');
    })
  }

  arrayOne(n: number): any[] {
    return Array(n);
  }

  changePage(e) {
    e.preventDefault();
    const pageNumber = parseInt(e.target.dataset.pagenumber);
    this.skip = pageNumber;
    this.currentPage = pageNumber;
    this.getAllCouriers(this.skip,this.status, this.name, this.phone);

  }

  nextPage(e) {
    e.preventDefault();
    if(this.currentPage <this.pages){
      ++this.currentPage
      this.getAllCouriers(this.currentPage,this.status, this.name, this.phone);
    }
  }

  prevPage(e) {
    e.preventDefault();
    if(this.currentPage  >1){
      --this.currentPage;
      this.getAllCouriers(this.currentPage,this.status, this.name, this.phone);
    }
  }



  deactivate(id) {
    swal.default.fire({
      title: "A jeni të sigurt që dëshiron të deaktivizoni këtë korierin?",
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if(result.value) {
        this.courierService.changeStatus(id,false)
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe(data => {
      swal.default.fire("Sukses", "Klient është deaktivizuar me sukses", 'success');
      this.getAllCouriers(this.currentPage,this.status, this.name, this.phone);
    }, (error) => {
      swal.default.fire("Njoftim", error.error.error, 'warning');
    })
      }
    });
  }

  activate(id) {
    swal.default.fire({
      title: "A jeni të sigurt që dëshiron të aktivizoni këtë korierin?",
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if(result.value) {
        this.courierService.changeStatus(id,true)
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe(data => {
      swal.default.fire("Sukses", "Korieri është aktivizuar me sukses", 'success');
      this.getAllCouriers(this.currentPage,this.status, this.name, this.phone);
    }, (error) => {
      swal.default.fire("Njfotim", error.error.error, 'warning');
    })
      }
    });
  }

  delete(id) {
    swal.default.fire({
      title: "A jeni i sigurt që doni të fshini këtë korier?",
      text: "Nuk mund ta ktheni këtë veprim",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if (result.value) {
        this.courierService.delete(id)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe(data => {
          swal.default.fire("Sukses", "Korieri është fshirë me sukses", 'success');
          this.getAllCouriers(this.currentPage,this.status, this.name, this.phone);
        }, (error) => {
          swal.default.fire("Njoftim", error.error.error, 'warning');
        })
      }
    });
   
  }

  search() {
    this.skip = 1;
    this.currentPage = 1;
    this.getAllCouriers(this.currentPage,this.status, this.name, this.phone);
  };

  changeStatus() {
    this.getAllCouriers(this.currentPage,this.status, this.name, this.phone);
  }

  exportCouriers() {
    this.courierService.exportCouriers(this.currentPage,this.status, this.phone , this.name)
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe(data => {
      const blob = new Blob([data.body], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
        const url= window.URL.createObjectURL(blob);
        const a = document.createElement('a')
        a.href = url;
        a.download = 'raport.csv'
        a.click();
        URL.revokeObjectURL(url);
    }, (error) => {
      swal.default.fire("Gabim",error.error.error, 'error');
    })
  }

}
