import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountsService } from 'app/services/accounts.service';
import { AuthService } from 'app/services/auth.service';
import * as swal from "sweetalert2";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  public form: FormGroup;
  public cities = [];
  public isSuperAdmin: boolean = false;

  constructor(
    private accountService: AccountsService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {

    const userData = this.authService.getUserData();
    this.isSuperAdmin = userData.isSuperAdmin;

    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      role: ['', [Validators.required]],
      country: ['',this.isSuperAdmin ? []: [Validators.required]],
      city: [''],
      isActive: [true, [Validators.required]],
    });
  }

  ngOnInit(): void {}

  save() {
    if (this.form.valid) {
      this.accountService.create(this.form.value)
        .subscribe(() => {
          swal.default.fire("Sukses", "U krijua me sukses shfrytezuesi", 'success');
          this.router.navigate(['/admin/auth-users']);
        });
    }
  }

  handleCountryChange($event) {
    if ($event) {
      this.form.controls["country"].patchValue($event.name);
      this.cities = $event.cities;
    }
  }

  handleCityChange($event) {
    if ($event) {
      this.form.controls["city"].patchValue($event.name);
    }
  }
}
