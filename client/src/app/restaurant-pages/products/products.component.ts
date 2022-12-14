import { Component, OnInit } from '@angular/core';
import { MenuServiceService } from '../../services/menu-service.service';
import { ProductService } from '../../services/product.service';
import { AuthService  } from '../../services/auth.service';
import { takeUntil } from 'rxjs/operators';
import * as swal from "sweetalert2";
import { Subject } from 'rxjs';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products:[];
  public name:string;
  public productCode:string;
  skip = 0
  length: Number = 0;
  limit = 15;
  public pages;
  public currentPage = 1;
  private unsubscribeAll: Subject<any> = new Subject<any>();
  public currencyType;
  public user:any;
  public status = "";

  constructor(private productService: ProductService, private authService: AuthService, public menuServiceService: MenuServiceService) {
    this.currencyType = this.authService.getUser().currencyType;
    this.user = this.authService.getUser().role;
   }

  ngOnInit(): void {
    this.getAllProducts();
    console.log(this.user, '@this.user')
  }

  public getAllProducts(page = 1,name = undefined,productCode= undefined, status = undefined) {
    this.menuServiceService.getAllProductsForCompany(page, name, productCode, status)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(data => {
        this.skip = data.skip;
        this.pages = data.pages;
        this.products = data.products
      })
  }


  arrayOne(n: number): any[] {
    return Array(n);
  }

  changePage(e) {
    e.preventDefault();
    if(this.currentPage && this.currentPage <= this.pages) this.getAllProducts(this.currentPage,this.name,this.productCode);

  }

  nextPage(e) {
    e.preventDefault();
    if(this.currentPage <this.pages){
      ++this.currentPage;
      this.getAllProducts(this.currentPage,this.name,this.productCode);
    }
  }

  prevPage(e) {
    e.preventDefault();
    if(this.currentPage  >1){
      --this.currentPage;
      this.getAllProducts(this.currentPage,this.name,this.productCode);
    }
  }

  delete(id) {
    swal.default.fire({
      title: "A jeni i sigurt q?? doni t?? fshini k??t?? produktin?",
      text: "Nuk mund ta ktheni k??t?? veprim",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if (result.value) {
        this.menuServiceService.deleteProduct(id)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe(data => {
          swal.default.fire("Sukses", "Produkti ??sht?? fshir?? me sukses", 'success');
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

  changeStatus(id, value) {
    this.menuServiceService.updateStatus(id, {status:value})
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe(data => {
          this.getAllProducts(this.currentPage,this.name,this.productCode);
        }, (error) => {
          swal.default.fire("Njoftim", error.error.error, 'warning');
        })
  }

  export() {
    this.menuServiceService.exportProducts()
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
      title: "A jeni i sigurt q?? doni ta b??ni produktin t?? rekomanduar?",
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if (result.value) {
        this.menuServiceService.makeRecommend(id, value)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe(data => {
          swal.default.fire("Sukses", "Produkti ??sht?? b??r?? i rekomanduar me sukses", 'success');
          this.getAllProducts(this.currentPage,this.name,this.productCode, this.status)
        }, (error) => {
          swal.default.fire("Njoftim", error.error.error, 'warning');
        })
      }
    });
   
  }

}
