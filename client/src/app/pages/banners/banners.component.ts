import { Component, OnInit } from '@angular/core';
import { BannersService } from '../../services/banners.service';
import { from, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as swal from "sweetalert2";
import { CompanyService } from '../../services/company.service';
import { RestaurantsService } from '../../services/restaurants.service';
@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.css']
})
export class BannersComponent implements OnInit {
  banners:[]
  public status = "";
  companies: any[];
  skip = 0
  length: Number = 0;
  limit = 15;
  public pages;
  public currentPage = 1;
  private unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(private bannersService:BannersService, private companyService:CompanyService, private restaurantsService:RestaurantsService) { }

  ngOnInit(): void {
    this.getAllBanners();
    this.getAllCompanies();
  }


  public getAllBanners(page = 1, status = undefined,) {
    this.bannersService.getAllBanners(page,status) 
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe(data => {
      this.skip = data.skip;
      this.pages = data.pages;
      this.banners = data.banners;
    }, (error) => {
      swal.default.fire("Gabim",error.error.error, 'error');
    })
  }


  public getAllCompanies() {
    
    this.companyService.getAllComp()
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(data => {
       this.companies = [...data.companies]

       this.restaurantsService.getAll()
       .pipe(takeUntil(this.unsubscribeAll))
       .subscribe(data => {
     
        this.companies = [...this.companies, ...data.restuarants]
       })
     
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
    this.getAllBanners(this.skip,this.status);

  }

  nextPage(e) {
    e.preventDefault();
    if(this.currentPage <this.pages){
      ++this.currentPage
      this.getAllBanners(this.skip,this.status);
    }
  }

  prevPage(e) {
    e.preventDefault();
    if(this.currentPage  >1){
      --this.currentPage;
      this.getAllBanners(this.skip,this.status);
    }
  }


  changeStatus() {
    this.getAllBanners(this.skip,this.status);
  }

  find(id) {
    let val = this.companies.find((e) => {  
      if( e._id == id ) {
        return e
      }
    });
    return val.name ? val.name : val.company ;
  }


  deactivate(id) {
    swal.default.fire({
      title: "A jeni të sigurt që dëshiron të deaktivizoni këtë banerin?",
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if(result.value) {
        this.bannersService.changeStatus(id,false)
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe(data => {
      swal.default.fire("Sukses", "Baneri është deaktivizuar me sukses", 'success');
      this.getAllBanners(this.skip);
    }, (error) => {
      swal.default.fire("Gabim", error.error.error, 'error');
    })
      }
    });
  }

  activate(id) {
    swal.default.fire({
      title: "A jeni të sigurt që dëshiron të aktivizoni këtë baneri?",
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if(result.value) {
        this.bannersService.changeStatus(id,true)
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe(data => {
      swal.default.fire("Sukses", "Baneri është aktivizuar me sukses", 'success');
      this.getAllBanners(this.skip);
    }, (error) => {
      swal.default.fire("Gabim", error.error.error, 'error');
    })
      }
    });
  }

  delete(id) {
    swal.default.fire({
      title: "A jeni i sigurt që doni të fshini këtë baner?",
      text: "Nuk mund ta ktheni këtë veprim",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if (result.value) {
        this.bannersService.deleteBanner(id)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe(data => {
          swal.default.fire("Sukses", "Baneri është fshirë me sukses", 'success');
          this.getAllBanners(this.skip,this.status);
        }, (error) => {
          swal.default.fire("Njoftim", error.error.error, 'warning');
        })
      }
    });
   
  }


}
