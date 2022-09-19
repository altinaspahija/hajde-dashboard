import { Component, OnInit } from '@angular/core';
import { CompanyService } from "../../services/company.service";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as swal from "sweetalert2";
@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {
  companies:[];
  public name:string = "";
  public status:any = "";
  skip:Number = 0
  length: Number = 0;
  limit = 15;
  public pages;
  public currentPage = 1;
  private unsubscribeAll: Subject<any> = new Subject<any>();
 
  constructor(private companyService: CompanyService) { }

  ngOnInit(): void {
    this.getAllCompanies();
  }

  public getAllCompanies(page: Number = 1,status = undefined, name = undefined) {
    this.companyService.getAllCompanies(page, status, name)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(data => {
        this.skip = data.skip;
        this.pages = data.pages;
        this.companies = data.companies;
      }, (error) => {
        swal.default.fire("Gabim",error.error.error, 'error');
      })
  }

  arrayOne(n: number): any[] {
    return Array(n);
  }

  changePage(e) {
    e.preventDefault();
    if(this.currentPage && this.currentPage <= this.pages) this.getAllCompanies(this.currentPage,this.status, this.name);
  }

  nextPage(e) {
    e.preventDefault();
    if(this.currentPage <this.pages){
      ++this.currentPage
      this.getAllCompanies(this.currentPage,this.status, this.name);
    }
  }

  prevPage(e) {
    e.preventDefault();
    if(this.currentPage  >1){
      --this.currentPage;
      this.getAllCompanies(this.currentPage,this.status, this.name)
    }
  }



  deactivate(id) {
    swal.default.fire({
      title: "A jeni të sigurt që dëshiron të deaktivizoni këtë kompani?",
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if(result.value) {
        this.companyService.changeCompanyStatus(id,false)
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe(data => {
      swal.default.fire("Sukses", "Kompania është deaktivizuar me sukses", 'success');
      this.getAllCompanies(this.currentPage);
    }, (error) => {
      swal.default.fire("Gabim", error.error.error, 'error');
    })
      }
    });
  }

  activate(id) {
    swal.default.fire({
      title: "A jeni të sigurt që dëshiron të aktivizoni këtë kompani?",
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if(result.value) {
        this.companyService.changeCompanyStatus(id,true)
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe(data => {
      swal.default.fire("Sukses", "Kompania është aktivizuar me sukses", 'success');
      this.getAllCompanies(this.currentPage);
    }, (error) => {
      swal.default.fire("Gabim", error.error.error, 'error');
    })
      }
    });
  }

  delete(id) {
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
        this.companyService.deleteCompany(id)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe(data => {
          swal.default.fire("Sukses", "Kompania është fshirë me sukses", 'success');
          this.getAllCompanies(this.currentPage,this.status, this.name);
        }, (error) => {
          swal.default.fire("Njoftim", error.error.error, 'warning');
        })
      }
    });
   
  }

  search() {
    this.skip = 1;
    this.currentPage = 1;
    this.getAllCompanies(this.skip ,this.status, this.name);
  };

  changeStatus() {
    this.getAllCompanies(this.skip ,this.status, this.name);
  }


exportCompany() {
    this.companyService.exportCompany(this.skip ,this.status, this.name)
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
