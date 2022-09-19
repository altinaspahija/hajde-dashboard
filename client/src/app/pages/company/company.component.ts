import { Component, OnInit } from '@angular/core';
import { CompanyService } from "../../services/company.service";
import { OrdersService } from '../../services/orders.service';
import { CompanyCategoryService } from '../../services/company-category.service'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as swal from "sweetalert2";
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  public company:any;
  public id;
  private unsubscribeAll: Subject<any> = new Subject<any>();
  public imageUrl;
  public orderCounter:number = 0;
  public name:string;
  public nameCat:string;
  public productCode:string;
  skip = 0
  skipCat = 0
  length: Number = 0;
  limit = 15;
  limitCat = 15;
  public pages;
  public pagesCat;
  public currentPage = 1;
  public currentPageCat = 1;
  products:[];
  public totalOrders: any;
  public inProgessOrders:any;
  public completedOrders: any;
  public issueOrders: any;
  public rejctedOrders:any;
  public pendingOrders:any;
  public cancelledOrders:any;
  public revenue:any;
  public fromDate;
  public toDate;
  public status = "";
  public statusCat = "";
  public categories;

  constructor(private companyService: CompanyService, private orderService: OrdersService,  private activeRoute: ActivatedRoute,  private router: Router, private productService: ProductService, private ordersService: OrdersService, private categoryService: CompanyCategoryService) { 
    this.activeRoute.paramMap.subscribe(params => { 
      this.id = params.get("id");
      this.searchT();
      this.searchCat();
      this.companyService.getCompanyById(this.id)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data: any) => {
            this.company = data.company;
        }, (error) => {
            swal.default.fire("Njoftim",error.error.error, 'warning');
        });

        this.orderService.getCountOfOrder(this.id)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data: any) => {
            this.orderCounter = data.count;
        }, (error) => {
            swal.default.fire("Njoftim",error.error.error, 'warning');
        });

    });
    
  }

  ngOnInit(): void {
    this.imageUrl = environment.bucketUrl;
    this.getAllProducts();
  }

  delete() {
    swal.default.fire({
      title: "A jeni i sigurt që doni të fshini këtë kompani?",
      text: "Nuk mund ta ktheni këtë veprim",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if (result.value) {
        this.companyService.deleteCompany(this.id)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe(data => {
          swal.default.fire("Sukses", "Kompania është fshirë me sukses", 'success');
          this.router.navigate(['/admin/companies'])
        }, (error) => {
          swal.default.fire("Gabim", error.error.error, 'error');
        })
      }
    });
   
  }


  public getAllProducts(page = 1,name = undefined,productCode= undefined, status = undefined) {
    this.productService.getAllProductsForAdmin(this.id, page, name, productCode,status)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(data => {
        this.skip = data.skip;
        this.pages = data.pages;
        this.products = data.products
      })
  }

  public getAllCategories(page = 1,name = undefined, status = undefined) {
    this.categoryService.getAllCategories(this.id, page, status, name)
    .subscribe(data => {
      this.skip = data.skip;
      this.pagesCat = data.pages
      this.categories = data.categories;
    })
  }


  arrayOne(n: number): any[] {
    return Array(n);
  }

  changePage(e) {
    e.preventDefault();
    if(this.currentPage && this.currentPage <= this.pages)  this.getAllProducts(this.currentPage,this.name,this.productCode);
  }

  changePageCat(e) {
    e.preventDefault();
    if(this.currentPageCat && this.currentPageCat <= this.pagesCat)  this.getAllCategories(this.currentPageCat, this.nameCat, this.statusCat);
  }

  nextPage(e) {
    e.preventDefault();
    if(this.currentPage <this.pages){
      ++this.currentPage;
      this.getAllProducts(this.currentPage,this.name,this.productCode);
    }
  }

  nextPageCat(e) {
    e.preventDefault();
    if(this.currentPageCat <this.pagesCat){
      ++this.currentPageCat;
      this.getAllCategories(this.currentPageCat, this.nameCat, this.statusCat);
    }
  }

  prevPage(e) {
    e.preventDefault();
    if(this.currentPage  >1){
      --this.currentPage;
      this.getAllProducts(this.currentPage,this.name,this.productCode);
    }
  }

  prevPageCat(e) {
    e.preventDefault();
    if(this.currentPageCat  >1){
      --this.currentPageCat;
      this.getAllCategories(this.currentPageCat, this.nameCat, this.statusCat);
    }
  }

  deleteProduct(id) {
    swal.default.fire({
      title: "A jeni i sigurt që doni të fshini këtë produkt!!!!?",
      text: "Nuk mund ta ktheni këtë veprim",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if (result.value) {
        this.productService.deleteProduct(id)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe(data => {
          swal.default.fire("Sukses", "Produkti është fshirë me sukses", 'success');
          this.getAllProducts(this.currentPage,this.name,this.productCode);
        }, (error) => {
          swal.default.fire("Njoftim", error.error.error, 'warning');
        })
      }
    });
   
  }

  

  search() {
    this.skip = 1;
    this.currentPage = 1;
    this.getAllProducts(this.skip,this.name,this.productCode, this.status);
  }

  searchCat() {
    this.skipCat = 1;
    this.currentPage = 1;
    this.getAllCategories(this.skipCat, this.nameCat, this.statusCat);
  }

  searchT() {
    this.ordersService.countCompanyTotalById(this.id, this.fromDate, this.toDate)
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe((data:any) => {
      this.totalOrders = data.count;
    });

    this.ordersService.countCompanyInProgressById(this.id,this.fromDate, this.toDate)
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe((data:any) => {
      this.inProgessOrders = data.count;
    });

    this.ordersService.countCompanyCompletedById(this.id, this.fromDate, this.toDate)
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe((data:any) => {
      this.completedOrders = data.count;
    });

    this.ordersService.countCompanyIssueById(this.id,this.fromDate, this.toDate)
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe((data:any) => {
      this.issueOrders = data.count;
    });

    this.ordersService.countCompanyRejectedById(this.id,this.fromDate, this.toDate)
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe((data:any) => {
      this.rejctedOrders = data.count;
    });

    this.ordersService.countCompanyPendingById(this.id,this.fromDate, this.toDate)
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe((data:any) => {
      this.pendingOrders = data.count;
    });

    this.ordersService.countCompanyCancelledById(this.id,this.fromDate, this.toDate)
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe((data:any) => {
      this.cancelledOrders = data.count;
    });
    this.ordersService.getRevenueCompanyById(this.id,this.fromDate, this.toDate)
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe((data:any) => {
      this.revenue = data.revenue;
    });
  }

  clearQuery() {
    this.fromDate = undefined;
    this.toDate = undefined;
    this.searchT();
  } 

  exportStats() {
    this.ordersService.exporStatstCSVCompanyWithId(this.id, this.fromDate, this.toDate )
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

  changeStatus(id, value) {
    this.productService.updateStatus(id, {status:value})
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe(data => {
      this.getAllProducts(this.currentPage,this.name,this.productCode);
    })
  }

  changeStatusCat(id, value) {
    swal.default.fire({
      title: "A jeni i sigurt që doni ta ndryshoni statusin?",
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if (result.value) {
        this.categoryService.changeStatus(id, value)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe(data => {
          swal.default.fire("Sukses", "Statusi i kategories është ndryshuar me sukses", 'success');
          this.getAllCategories(this.currentPage,this.name,this.productCode);
        }, (error) => {
          swal.default.fire("Njoftim", error.error.error, 'warning');
        })
      }
    });
  }

  exportCompany() {
    this.productService.exportProductsAdmin(this.id)
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

  makeReccomend(id, value) {
    swal.default.fire({
      title: "A jeni i sigurt që doni ta bëni produktin të rekomanduar?",
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if (result.value) {
        this.productService.makeRecommend(id, value)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe(data => {
          swal.default.fire("Sukses", "Produkti është bërë i rekomanduar me sukses", 'success');
          this.getAllProducts(this.currentPage,this.name,this.productCode, this.status)
        }, (error) => {
          swal.default.fire("Njoftim", error.error.error, 'warning');
        })
      }
    });
   
  }

}
