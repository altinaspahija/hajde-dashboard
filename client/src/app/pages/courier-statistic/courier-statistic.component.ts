import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CouriersService } from '../../services/couriers.service';
import { OrdersService } from '../../services/orders.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-courier-statistic',
  templateUrl: './courier-statistic.component.html',
  styleUrls: ['./courier-statistic.component.css']
})
export class CourierStatisticComponent implements OnInit {

  public totalOrders: any;
    public inProgessOrders:any;
    public completedOrders: any;
    public issueOrders: any;
    public rejctedOrders:any;
    public pendingOrders:any;
    public revenue:any;
    public revenueEur:any;
    public fromDate;
    public toDate;
    public id;
    private unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
      private ordersService: OrdersService,
      private activeRoute: ActivatedRoute,
      ) {

        this.activeRoute.paramMap.subscribe(params => { 
          this.id = params.get("id");
          this.search();

        })
       

    }

    search() {
      this.ordersService.countCourierTotal(this.id, this.fromDate, this.toDate)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data:any) => {
        this.totalOrders = data.count;
      });

      this.ordersService.countCourierInProgress(this.id, this.fromDate, this.toDate)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data:any) => {
        this.inProgessOrders = data.count;
      });

      this.ordersService.countCourierCompleted(this.id, this.fromDate, this.toDate)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data:any) => {
        this.completedOrders = data.count;
      });

      this.ordersService.countCourierIssue(this.id, this.fromDate, this.toDate)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data:any) => {
        this.issueOrders = data.count;
      });

      this.ordersService.countCourierRejected(this.id, this.fromDate, this.toDate)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data:any) => {
        this.rejctedOrders = data.count;
      });

      this.ordersService.countCourierPending(this.id, this.fromDate, this.toDate)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data:any) => {
        this.pendingOrders = data.count;
      });

      this.ordersService.countCourierCancelled(this.id, this.fromDate, this.toDate)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data:any) => {
        this.issueOrders = data.count;
      });
      this.ordersService.getRevenueCourier(this.id, this.fromDate, this.toDate)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data:any) => {
        this.revenue = data.revenue;
      });
      this.ordersService.getRevenueCourierEur(this.id, this.fromDate, this.toDate)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data:any) => {
        this.revenueEur = data.revenue;
      });
    }

    clearQuery() {
      this.fromDate = undefined;
      this.toDate = undefined;
      this.search();
    } 

    exportStats() {
      this.ordersService.exporStatstCSVCourierWithId(this.id, this.fromDate, this.toDate )
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
        console.log("Gabim",error.error.error, 'error');
      })
    }

    ngOnInit(){
     
    }
}
