import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsService } from 'app/services/accounts.service';
import { CountryService } from 'app/services/country.service';
import * as swal from "sweetalert2";
import { forkJoin } from 'rxjs';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  public form: FormGroup;
  public cities = [];
  public countries = [];
  public accountId;
  public isSuperAdmin: boolean = false;

  constructor(
    private accountService: AccountsService,
    private authService: AuthService,
    private countrysService: CountryService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {

    const userData = this.authService.getUserData();
    this.isSuperAdmin = userData.isSuperAdmin;

    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(60)]],
      role: ['', [Validators.required]],
      country: ['',this.isSuperAdmin ? []: [Validators.required]],
      city: [''],
      isActive: [true, [Validators.required]]
    });

    this.activatedRoute.params.subscribe(params => {
      this.accountId = params["id"];

      const countriesOb = this.countrysService.getAllCountries();
      const accountOb = this.accountService.get(this.accountId);

      forkJoin(countriesOb, accountOb)
        .subscribe(([countries, account]) => {
          this.countries = countries;
          this.form.patchValue(account);

          if (account.country) {
            const country = countries.find(f => f.name === account.country);
            this.cities = country.cities;
          }
        });
    });
  }

  ngOnInit(): void { }

  save() {
    if (this.form.valid) {
      this.accountService.update(this.accountId, this.form.value)
        .subscribe(() => {
          swal.default.fire("Sukses", "U ndryshua me sukses shfrytezuesi", 'success');
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
