import { Component, OnInit } from '@angular/core';
import { from, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as swal from "sweetalert2";
import { OffersService } from '../../services/offers.service';
import { CompanyService } from '../../services/company.service';
import { RestaurantsService } from '../../services/restaurants.service';
@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {
  public offers:any[];
  public offerType:string;
  public phone:string;
  public status: string;
  public fromDate: string;
  public toDate: string;  
  skip = 0
  length: Number = 0;
  limit = 15;
  public pages;
  public currentPage = 1;
  private unsubscribeAll: Subject<any> = new Subject<any>();

  public offerTypes: any = {
    "percentDiscount": "Zbritje me përqindje",
    "AmountDiscount": "Zbritje me vlerë",
    "ExtraFreeProduct": "Produkt falas",
    "PercentDiscountWinner": "Fituesi i një zbritje me përqindje"
  }  

  constructor(public offersService:OffersService, public companyService:CompanyService, public restaurantsService:RestaurantsService) { 
    this.getAllOffers()
  }

 
  ngOnInit(): void {}

  getAllOffers(page = 1,  offerType = undefined, status = undefined, fromDate = undefined, toDate = undefined) {
    this.offersService.getAllOffers(page, offerType, status, fromDate, toDate)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(data => {
        console.log(data)
          this.skip = data.skip;
          this.pages = data.pages;
          this.offers = data.offers;
      }, error => {
        console.log(error);
        swal.default.fire("Gabim",error.error.error, 'error');
      })
  }

  downloadCSV(offerId: string) {
    this.offersService.downloadCsv(offerId)
      .subscribe(
        (data) => this.downloadFile(data, offerId),
        error => {
          console.log(error);
          swal.default.fire("Gabim",error.error.error, 'error');
        }
      );
  }

  downloadFile(data: any, offerId: string) {
    const blob = new Blob([data.body], { type: "text/csv"});
    const url= window.URL.createObjectURL(blob);
    const a = document.createElement('a')
    a.href = url;
    a.download = `raport_${offerId}.csv`
    a.click();
    URL.revokeObjectURL(url);
  }

  changePage(e) {
    e.preventDefault();
    const pageNumber = parseInt(e.target.dataset.pagenumber);
    this.skip = pageNumber;
    this.currentPage = pageNumber;
    this.getAllOffers(this.skip, this.offerType, this.status, this.fromDate, this.toDate);

  }

  nextPage(e) {
    e.preventDefault();
    if(this.currentPage <this.pages){
      ++this.currentPage
      this.getAllOffers(this.currentPage, this.offerType,this.status, this.fromDate, this.toDate);
    }
  }

  prevPage(e) {
    e.preventDefault();
    if(this.currentPage  >1){
      --this.currentPage;
      this.getAllOffers(this.currentPage, this.offerType,this.status, this.fromDate, this.toDate);
    }
  }



  deactivate(id) {
    swal.default.fire({
      title: "A jeni të sigurt që dëshiron të deaktivizoni këtë ofertën?",
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if(result.value) {
        this.offersService.changeStatus(id,false)
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe(data => {
      swal.default.fire("Sukses", "Oferta është deaktivizuar me sukses", 'success');
      this.getAllOffers(this.currentPage, this.offerType,this.status, this.fromDate, this.toDate);
    }, (error) => {
      swal.default.fire("Njoftim", error.error.error, 'warning');
    })
      }
    });
  }

  activate(id) {
    swal.default.fire({
      title: "A jeni të sigurt që dëshiron të aktivizoni këtë ofertën?",
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if(result.value) {
        this.offersService.changeStatus(id,true)
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe(data => {
      swal.default.fire("Sukses", "Oferta është aktivizuar me sukses", 'success');
      this.getAllOffers(this.currentPage, this.offerType,this.status, this.fromDate, this.toDate);
    }, (error) => {
      swal.default.fire("Njfotim", error.error.error, 'warning');
    })
      }
    });
  }

  delete(id) {
    swal.default.fire({
      title: "A jeni i sigurt që doni të fshini këtë ofertë?",
      text: "Nuk mund ta ktheni këtë veprim",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if (result.value) {
        this.offersService.delete(id)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe(data => {
          swal.default.fire("Sukses", "Korieri është fshirë me sukses", 'success');
          this.getAllOffers(this.currentPage, this.offerType,this.status, this.fromDate, this.toDate);
        }, (error) => {
          swal.default.fire("Njoftim", error.error.error, 'warning');
        })
      }
    });
   
  }

 

  changeStatus() {
    this.getAllOffers(this.currentPage, this.offerType,this.status, this.fromDate, this.toDate);
  }

  getCompanyName(offer) {
    
    if(offer.offerProvider == "hajde") return 'nga hajde';
    if(offer.offerProvider == "market" && offer.company ) return `nga ${offer.company.company}`;
    if(offer.offerProvider == "restaurant"  && offer.restaurant) return `nga ${offer.restaurant.name}`;
    
  }

  // exportCouriers() {
  //   this.courierService.exportCouriers(this.currentPage,this.status, this.phone , this.name)
  //   .pipe(takeUntil(this.unsubscribeAll))
  //   .subscribe(data => {
  //     const blob = new Blob([data.body], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
  //       const url= window.URL.createObjectURL(blob);
  //       const a = document.createElement('a')
  //       a.href = url;
  //       a.download = 'raport.csv'
  //       a.click();
  //       URL.revokeObjectURL(url);
  //   }, (error) => {
  //     swal.default.fire("Gabim",error.error.error, 'error');
  //   })
  // } 

  pushNotification(id: string) {
    swal.default.fire({
      title: "A jeni i sigurt që doni të dergoni njoftim për këtë ofertë ?",
      text: "Nuk mund ta ktheni këtë veprim",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if (result.value) {
        this.offersService.pushNotification(id)
        .subscribe(data => {
          swal.default.fire("Sukses", "Njoftimi është derguar me sukses", 'success');
        }, (error) => {
          swal.default.fire("Njoftim", error.error.error, 'warning');
        })
      }
    });
  }
}
