import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as swal from "sweetalert2";
import { Router,ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  public order: any;
  private id:any;
  private unsubscribeAll: Subject<any> = new Subject<any>();
  public langStatus = {
    'IN_PROGRESS': 'Në progres',
    'COMPLETED':'E kompletuar',
    'ISSUE':'Problem',
    'REJECTED':'E refuzuar',
    'PENDING':'Në pritje',
    'CANCELLED':'E anuluar',
    'CONFIRM': 'Konfirmuar'
  }

  constructor(private orderService: OrdersService, private activeRoute: ActivatedRoute) { 
    this.activeRoute.paramMap.subscribe(params => { 
      this.id = params.get("id");
      this.orderService.getOrderByID(this.id)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data:any) => {
         this.order = data.order;
        },error =>{
          swal.default.fire("Gabim",error.error.error, 'error');
        })
    })
  }

  ngOnInit(): void {
  }

}
