import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { from, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as swal from "sweetalert2";
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders:[];
  public courier:string;
  public status:string = "";
  public clientName:string = "";
  public company:string;
  public orderNr:string;
  public fromDate;
  public toDate;
  public options = ["dorron"];
  skip = 0
  length: Number = 0;
  limit = 15;
  public pages;
  public currentPage = 1;
  private unsubscribeAll: Subject<any> = new Subject<any>();
  public langStatus = {
    'IN_PROGRESS': 'Në progres',
    'COMPLETED':'E kompletuar',
    'ISSUE':'Problem',
    'REJECTED':'E refuzuar',
    'PENDING':'Në pritje',
    'CANCELLED':'E anuluar',
    'CONFIRM': 'Konfirmuar'
  }

  constructor(private ordersService: OrdersService) { }

  ngOnInit(): void {
    this.getAllOrders();
  }

  public getAllOrders(page = 1, status = undefined, courier = undefined, company = undefined, orderNr = undefined, fromDate = undefined, toDate = undefined, clientName = undefined) {
    this.ordersService.getAllOrders(page,status,courier,company,orderNr,fromDate,toDate, clientName)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(data => {
        this.skip = data.skip;
        this.pages = data.pages;
        this.orders = data.orders;
      }, (error) => {
        swal.default.fire("Gabim",error.error.error, 'error');
      })
  }

  arrayOne(n: number): any[] {
    return Array(n);
  }

  changePage(e) {
    e.preventDefault();
    if(this.currentPage && this.currentPage <= this.pages) this.getAllOrders(this.skip,this.status,this.courier, this.company,this.orderNr, this.fromDate, this.toDate, this.clientName);

  }

  nextPage(e) {
    e.preventDefault();
    if(this.currentPage <this.pages){
      ++this.currentPage
      this.getAllOrders(this.currentPage,this.status,this.courier, this.company,this.orderNr, this.fromDate, this.toDate, this.clientName);
    }
  }

  prevPage(e) {
    e.preventDefault();
    if(this.currentPage  >1){
      --this.currentPage;
      this.getAllOrders(this.currentPage,this.status,this.courier, this.company,this.orderNr, this.fromDate, this.toDate, this.clientName);
    }
  }

  search() {
    this.skip = 1;
    this.currentPage = 1;
    this.getAllOrders(this.currentPage,this.status,this.courier, this.company,this.orderNr, this.fromDate, this.toDate, this.clientName);
  }

 


  changeStatus() {
    this.getAllOrders(this.currentPage,this.status,this.courier, this.company,this.orderNr,this.fromDate, this.toDate, this.clientName);
  }

  exportAdmin() {
    this.ordersService.exportAdmin(this.currentPage,this.status,this.courier, this.company,this.orderNr,this.fromDate, this.toDate, this.clientName)
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
