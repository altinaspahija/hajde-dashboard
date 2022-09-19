import { Component, OnInit } from '@angular/core';
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
  public status = "";

  constructor(private productService: ProductService, private authService: AuthService) {
    this.currencyType = this.authService.getUser().currencyType;
   }

  ngOnInit(): void {
    this.getAllProducts();
  }


  public getAllProducts(page = 1,name = undefined,productCode= undefined, status = undefined) {
    this.productService.getAllProductsForCompany(page, name, productCode, status)
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
      title: "A jeni i sigurt që doni të fshini këtë produktin?",
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

  changeStatus(id, value) {
    this.productService.updateStatus(id, {status:value})
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe(data => {
      this.getAllProducts(this.currentPage,this.name,this.productCode);
    });
  }

  export() {
    this.productService.exportProducts()
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
