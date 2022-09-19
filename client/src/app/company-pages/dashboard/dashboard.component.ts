import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { ClientsService } from '../../services/clients.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CouriersService } from '../../services/couriers.service';
import { OrdersService } from '../../services/orders.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit{    
    public totalOrders: any;
    public inProgessOrders:any;
    public completedOrders: any;
    public issueOrders: any;
    public rejctedOrders:any;
    public pendingOrders:any;
    public revenue:any;
    public fromDate;
    public toDate;
    public currencyType;
    public marketStatus: boolean | null = null;
    public companyData: any;

    private unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
      private ordersService: OrdersService,
      private authService: AuthService,
      private companyService: CompanyService
      ) {
     this.search();
      this.currencyType = this.authService.getUser().currencyType;

    }

    search() {
      this.ordersService.getRevenueCompany(this.fromDate, this.toDate)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data:any) => {
        this.revenue = data.revenue;
      });

      this.ordersService.countCompanyTotal(this.fromDate, this.toDate)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data:any) => {
        this.totalOrders = data.count;
      });

      this.ordersService.countCompanyInProgress(this.fromDate, this.toDate)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data:any) => {
        this.inProgessOrders = data.count;
      });

      this.ordersService.countCompanyCompleted(this.fromDate, this.toDate)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data:any) => {
        this.completedOrders = data.count;
      });

      this.ordersService.countCompanyIssue(this.fromDate, this.toDate)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data:any) => {
        this.issueOrders = data.count;
      });

      this.ordersService.countCompanyRejected(this.fromDate, this.toDate)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data:any) => {
        this.rejctedOrders = data.count;
      });

      this.ordersService.countCompanyPending(this.fromDate, this.toDate)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data:any) => {
        this.pendingOrders = data.count;
      });
    }

    clearQuery() {
      this.fromDate = undefined;
      this.toDate = undefined;
      this.search();
    } 

    ngOnInit(){
      this.companyData = this.authService.getCompanyData();
     this.companyService.getCompanyById(this.companyData.companyId)
      .subscribe(data => {
        this.marketStatus = data.company.isActive;
      });
    }

    export() {
      this.ordersService.exporStatstCSVCompany(this.fromDate, this.toDate )
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

    marketStatusChange() {
     this.companyService.changeCompanyStatus(this.companyData.companyId, !this.marketStatus)
        .subscribe();

        this.marketStatus = !this.marketStatus;
    }
}
