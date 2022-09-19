import { Component, OnInit } from '@angular/core';
import {CouriersService} from '../../services/couriers.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as swal from "sweetalert2";
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-courier',
  templateUrl: './courier.component.html',
  styleUrls: ['./courier.component.css']
})
export class CourierComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  public firstName  = new UntypedFormControl("", [Validators.required]);
  public lastName  = new UntypedFormControl("", [Validators.required]);
  public phone  = new UntypedFormControl("", [Validators.required]);
  public courierFormGroup: UntypedFormGroup;
  public submittedCourier = false;
  public errorMessage;
  private id:any;
  
  constructor(public courierFormBuilder: UntypedFormBuilder, private courierService: CouriersService, private router: Router,private activeRoute: ActivatedRoute) {
    this.activeRoute.paramMap.subscribe(params => { 
      this.id = params.get("id");
      this.courierService.getCourierByID(this.id)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data: any) => {
         let courierData= data.courier;
         this.firstName.setValue(courierData.firstName);
         this.lastName.setValue(courierData.lastName);
         this.phone.setValue(courierData.phone);
        },error =>{
          swal.default.fire("Gabim",error.error.error, 'error');
        })
    })
    
    this.courierFormGroup = courierFormBuilder.group({
      firstName:this.firstName,
      lastName:this.lastName,
      phone: this.phone,
    })
  }

  get getCourierFormGroup():any {return this.courierFormGroup.controls};

  ngOnInit(): void {}

  addCourier(){
    this.submittedCourier = true;
    if(this.courierFormGroup.valid) {
      const reqBody = {
        firstName: this.courierFormGroup.get("firstName").value,
        lastName: this.courierFormGroup.get("lastName").value,
        phone: this.courierFormGroup.get("phone").value
      };

      this.courierService.update(this.id,reqBody)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe(() => {
          swal.default.fire("Sukses","Kompania u shtua me sukses", 'success');
          this.router.navigate(['/admin/couriers'])
        },
        error =>{
          swal.default.fire("Gabim",error.error.error, 'error');
        })
    }
  }

}
