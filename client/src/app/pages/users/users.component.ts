import { Component, OnInit } from '@angular/core';
import { ClientsService } from "../../services/clients.service";
import { from, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as swal from "sweetalert2";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  clients:[];
  public name:string;
  public status:string = "";
  public phone:string;
  skip = 0
  length: Number = 0;
  limit = 15;
  public pages;
  public currentPage = 1;
  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private clientService: ClientsService) { }

  ngOnInit(): void {
    this.getAllClients();
  }


  public getAllClients(page = 1, status = undefined, name = undefined, phone = undefined) {
    this.clientService.getAllClients(page,status,phone,name)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(data => {
        this.skip = data.skip;
        this.pages = data.pages;
        this.clients = data.clients;
      }, (error) => {
        swal.default.fire("Gabim",error.error.error, 'error');
      })
  }

  arrayOne(n: number): any[] {
    return Array(n);
  }

  changePage(e) {
    e.preventDefault();
    if(this.currentPage && this.currentPage <= this.pages) this.getAllClients(this.currentPage,this.status, this.name, this.phone);
  }

  nextPage(e) {
    e.preventDefault();
    if(this.currentPage <this.pages){
      ++this.currentPage
      this.getAllClients(this.currentPage,this.status, this.name, this.phone);
    }
  }

  prevPage(e) {
    e.preventDefault();
    if(this.currentPage  >1){
      --this.currentPage;
      this.getAllClients(this.currentPage,this.status, this.name, this.phone);
    }
  }



  deactivate(id) {
    swal.default.fire({
      title: "A jeni të sigurt që dëshiron të deaktivizoni këtë klient?",
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if(result.value) {
        this.clientService.changeStatus(id,false)
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe(data => {
      swal.default.fire("Sukses", "Klient është deaktivizuar me sukses", 'success');
      this.getAllClients(this.currentPage,this.status, this.name, this.phone);
    }, (error) => {
      swal.default.fire("Gabim", error.error.error, 'error');
    })
      }
    });
  }

  activate(id) {
    swal.default.fire({
      title: "A jeni të sigurt që dëshiron të aktivizoni këtë klient?",
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if(result.value) {
        this.clientService.changeStatus(id,true)
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe(data => {
      swal.default.fire("Sukses", "Klienti është aktivizuar me sukses", 'success');
      this.getAllClients(this.currentPage,this.status, this.name, this.phone);
    }, (error) => {
      swal.default.fire("Gabim", error.error.error, 'error');
    })
      }
    });
  }

  delete(id) {
    swal.default.fire({
      title: "A jeni i sigurt që doni të fshini këtë klient?",
      text: "Nuk mund ta ktheni këtë veprim",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if (result.value) {
        this.clientService.delete(id)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe(data => {
          swal.default.fire("Sukses", "Klienti është fshirë me sukses", 'success');
          this.getAllClients(this.currentPage,this.status, this.name, this.phone);
        }, (error) => {
          swal.default.fire("Gabim", error.error.error, 'error');
        })
      }
    });
   
  }

  search() {
    this.skip = 1;
    this.currentPage = 1;
    this.getAllClients(this.currentPage,this.status, this.name, this.phone);
  };

  changeStatus() {
    this.getAllClients(this.currentPage,this.status, this.name, this.phone);
  }

  exportClients() {
    this.clientService.exportClients(this.currentPage, this.status, this.phone, this.name)
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
