import { Component, OnInit } from '@angular/core';
import {CouriersService} from '../../services/couriers.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as swal from "sweetalert2";
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-courier',
  templateUrl: './add-courier.component.html',
  styleUrls: ['./add-courier.component.css']
})
export class AddCourierComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  public firstName  = new UntypedFormControl("", [Validators.required]);
  public lastName  = new UntypedFormControl("", [Validators.required]);
  public phone  = new UntypedFormControl("", [Validators.required]);
  public password = new UntypedFormControl("",[Validators.required, Validators.minLength(8)]);
  public courierFormGroup: UntypedFormGroup;
  public submittedCourier = false;
  public errorMessage;
  
  constructor(public courierFormBuilder: UntypedFormBuilder, private courierService: CouriersService, private router: Router) {
    this.courierFormGroup = courierFormBuilder.group({
      firstName:this.firstName,
      lastName:this.lastName,
      phone: this.phone,
      password:this.password
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
        phone: this.courierFormGroup.get("phone").value,
        password: this.courierFormGroup.get("password").value
      };

      this.courierService.create(reqBody)
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
