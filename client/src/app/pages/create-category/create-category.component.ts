import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as swal from "sweetalert2";
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  public imageUrl = new UntypedFormControl('', [Validators.required]);
  public isActive = new UntypedFormControl('', [Validators.required]);
  public name = new UntypedFormControl('', [Validators.required]);
  public type = new UntypedFormControl('', [Validators.required]);
  public parentId: any;
  public code = new UntypedFormControl('', [Validators.required]);
  public categoryFormGroup: UntypedFormGroup;
  public submitted = false;
  public countryVal: any;
  public categories: any[];
  constructor(
    public categoryFormBuilder: UntypedFormBuilder,
    private categoriesService: CategoriesService,
    private authService: AuthService,
    private router: Router
  ) {
    this.categoryFormGroup = categoryFormBuilder.group({
      imageUrl: this.imageUrl,
      isActive: this.isActive,
      name: this.name,
      type: this.type,
      parentId: this.parentId,
      code: this.code
    })

    if (this.authService.getUser().country) {
      this.countryVal = this.authService.getUser().country;
    }

    this.getAllCategories();
  }

  ngOnInit(): void {
  }

  get getCategoryFormGroup(): any { return this.categoryFormGroup.controls };

  public onFileChange(event, inputName) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      let fls = {}
      reader.onload = () => {
        this.categoryFormGroup.patchValue({
          'imageUrl': reader.result
        });
      }
    }
  }


  public addCategory() {
    this.submitted = true;

    if (this.categoryFormGroup.valid) {
      let body = {
        imageURL: this.categoryFormGroup.get('imageUrl').value,
        type: this.categoryFormGroup.get('type').value,
        isActive: this.categoryFormGroup.get('isActive').value,
        name: this.categoryFormGroup.get('name').value,
        parentId: this.categoryFormGroup.get('parentId').value,
        code: this.categoryFormGroup.get('code').value
      }

      this.categoriesService.createCategory(body)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data: any) => {
          swal.default.fire("Sukses", "Kategoria u shtua me sukses", 'success');
          this.router.navigate(['/admin/categories'])
        },
          error => {
            swal.default.fire("Njoftim", error.error.error.error, 'warning');
          })
    }
  }

  public getAllCategories() {
    
    this.categoriesService.getAllCategories()
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(data => {
       this.categories = [...data.categories]
       })
    }

}
