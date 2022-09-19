import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { from, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as swal from "sweetalert2";
import { CompanyService } from '../../services/company.service';
import { RestaurantsService } from '../../services/restaurants.service';
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  public status = "";
  categories: any[];
  categoriesParent: any[];
  skip = 0
  length: Number = 0;
  limit = 15;
  public pages;
  public currentPage = 1;
  private unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(private categoriesService: CategoriesService, private companyService: CompanyService, private restaurantsService: RestaurantsService) { }

  ngOnInit(): void {
    this.getAllCategories();
    this.getCategoriesParent();
  }


  public getAllCategories(page = 1, status = undefined,) {
    this.categoriesService.getAllCategories(page, status)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(data => {
        this.skip = data.skip;
        this.pages = data.pages;
        this.categories = data.categories;
      }, (error) => {
        swal.default.fire("Gabim", error.error.error, 'error');
      })
  }

  public getCategoriesParent() {
    this.categoriesService.getAllCategories()
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(data => {
        this.categoriesParent = data.categories;
      }, (error) => {
        swal.default.fire("Gabim", error.error.error, 'error');
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
    this.getAllCategories(this.currentPage);

  }

  nextPage(e) {
    e.preventDefault();
    if (this.currentPage < this.pages) {
      ++this.currentPage
      this.getAllCategories(this.currentPage);
    }
  }

  changeStatus() {
    this.getAllCategories(this.currentPage, this.status);
  }

  prevPage(e) {
    e.preventDefault();
    if (this.currentPage > 1) {
      --this.currentPage;
      this.getAllCategories(this.currentPage);
    }
  }

  find(id) {
    let val = this.categoriesParent.find((e) => {
      if (e._id == id) {
        return e
      }
    });
    return val && val.name;
  }


  deactivate(id) {
    swal.default.fire({
      title: "A jeni të sigurt që dëshiron të deaktivizoni këtë kategorin?",
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if (result.value) {
        this.categoriesService.updateCategoryStatus(id, false)
          .pipe(takeUntil(this.unsubscribeAll))
          .subscribe(data => {
            swal.default.fire("Sukses", "Kategoria është deaktivizuar me sukses", 'success');
            this.getAllCategories(this.currentPage, this.status);
          }, (error) => {
            swal.default.fire("Gabim", error.error.error, 'error');
          })
      }
    });
  }

  activate(id) {
    swal.default.fire({
      title: "A jeni të sigurt që dëshiron të aktivizoni këtë kategorin?",
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if (result.value) {
        this.categoriesService.updateCategoryStatus(id, true)
          .pipe(takeUntil(this.unsubscribeAll))
          .subscribe(data => {
            swal.default.fire("Sukses", "Kategoria është aktivizuar me sukses", 'success');
            this.getAllCategories(this.currentPage, this.status);
          }, (error) => {
            swal.default.fire("Gabim", error.error.error, 'error');
          })
      }
    });
  }

  delete(id) {
    swal.default.fire({
      title: "A jeni i sigurt që doni të fshini këtë kategori?",
      text: "Nuk mund ta ktheni këtë veprim",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if (result.value) {
        this.categoriesService.deleteCategory(id)
          .pipe(takeUntil(this.unsubscribeAll))
          .subscribe(data => {
            swal.default.fire("Sukses", "Kategoria është fshirë me sukses", 'success');
            this.getAllCategories(this.currentPage);
            this.getCategoriesParent();
          }, (error) => {
            swal.default.fire("Njoftim", error.error.error, 'warning');
          })
      }
    });

  }


}
