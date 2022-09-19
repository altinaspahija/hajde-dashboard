import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { ClientsService } from '../../services/clients.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CouriersService } from '../../services/couriers.service';
import { OrdersService } from '../../services/orders.service';
import {AuthService} from '../../services/auth.service';
import { RestaurantsService } from '../../services/restaurants.service'
@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit{
    public totalCompany:any;
    public activeCompanies:any;
    public inactiveCompanies:any;
    public totalRestaurants:any;
    public activeRestaurants:any;
    public inactiveRestaurants:any;
    public totalClients: any;
    public activeClients: any;
    public inactiveClients: any;
    public totalCouriers: any;
    public activeCouriers: any;
    public inactiveCouriers: any;
    public totalOrders: any;
    public inProgessOrders:any;
    public completedOrders: any;
    public issueOrders: any;
    public rejctedOrders:any;
    public pendingOrders:any;
    public cancelledOrders:any;
    public revenue:any;
    public revenueEuro:any;
    public country:any;
    public fromDate;
    public toDate;
    public userCountry: any;
    private unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
      private companyService: CompanyService, private clientService: ClientsService, private courierService: CouriersService,
      private ordersService: OrdersService, public authSerivce : AuthService, public restaurantsService:RestaurantsService
      ) {
        this.userCountry = this.authSerivce.getUser().country;

      
        this.country = this.userCountry;
        this.search();
    }

    search() {
      this.companyService.countTotal(this.country)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data:any) => {
        this.totalCompany = data.count;
      });

      this.companyService.countActive(this.country)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data:any) => {
        this.activeCompanies = data.count;
      });

      this.companyService.countInactive(this.country)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data:any) => {
        this.inactiveCompanies = data.count;
      });

      this.restaurantsService.countTotal(this.country)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data:any) => {
        this.totalRestaurants = data.count;
      });

      this.restaurantsService.countActive(this.country)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data:any) => {
        this.activeRestaurants = data.count;
      });

      this.restaurantsService.countInactive(this.country)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data:any) => {
        this.inactiveRestaurants = data.count;
      });

      this.clientService.countTotal(this.country)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data:any) => {
        this.totalClients = data.count;
      });

      this.clientService.countActive(this.country)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data:any) => {
        this.activeClients = data.count;
      });

      this.clientService.countInactive(this.country)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data:any) => {
        this.inactiveClients = data.count;
      });

      this.courierService.countTotal(this.country)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data:any) => {
        this.totalCouriers = data.count;
      });

      this.courierService.countActive(this.country)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data:any) => {
        this.activeCouriers = data.count;
      });

      this.courierService.countInactive(this.country)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data:any) => {
        this.inactiveCouriers = data.count;
      });
      

   

      this.ordersService.getRevenueAdmin()
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data:any) => {
        this.revenue = data.revenue;
      });

      this.ordersService.getRevenueAdminEur()
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data:any) => {
        this.revenueEuro = data.revenue;
      });
      this.ordersService.countTotal(this.fromDate, this.toDate, this.country)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data:any) => {
          this.totalOrders = data.count;
        });

        this.ordersService.countAllInProgress(this.fromDate, this.toDate, this.country)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data:any) => {
          this.inProgessOrders = data.count;
        });

        this.ordersService.countAllCompleted(this.fromDate, this.toDate, this.country)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data:any) => {
          this.completedOrders = data.count;
        });

        this.ordersService.countAllIssue(this.fromDate, this.toDate, this.country)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data:any) => {
          this.issueOrders = data.count;
        });

        this.ordersService.countAllRejected(this.fromDate, this.toDate, this.country)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data:any) => {
          this.rejctedOrders = data.count;
        });

        this.ordersService.countAllPending(this.fromDate, this.toDate, this.country)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data:any) => {
          this.pendingOrders = data.count;
        });

        this.ordersService.countAllCancelled(this.fromDate, this.toDate, this.country)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data:any) => {
          this.cancelledOrders = data.count;
        });
        this.ordersService.getRevenueAdmin(this.fromDate, this.toDate,)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data:any) => {
          this.revenue = data.revenue;
        });

        this.ordersService.getRevenueAdminEur(this.fromDate, this.toDate)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data:any) => {
          this.revenueEuro = data.revenue;
        });
    }

    clearQuery() {
      this.fromDate = undefined;
      this.toDate = undefined;
      this.search();
    }
    
    
    export() {
      this.ordersService.exporStatstCSVAdmin(this.fromDate, this.toDate )
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

    countryChange(e) {
      this.country = encodeURIComponent(e.target.value);
      this.search();
    }
}
