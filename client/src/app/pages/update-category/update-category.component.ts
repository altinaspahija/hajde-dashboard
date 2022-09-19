import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as swal from "sweetalert2";
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.css']
})
export class UpdateCategoryComponent implements OnInit {

  private unsubscribeAll: Subject<any> = new Subject<any>();
  public categoriesFormGroup: UntypedFormGroup;
  public categories: any[];
  public submitted = false;
  public countryVal: any;
  public id: string;
  public imageURL = new UntypedFormControl("", []);
  public image: any;
  public type = new UntypedFormControl("", []);
  public isActive = new UntypedFormControl("", []);
  public name = new UntypedFormControl("", []);
  public parentId = new UntypedFormControl("", []);
  public code = new UntypedFormControl("", []);
  constructor(
    public categoriesFormBuilder: UntypedFormBuilder,
    private categoriesService: CategoriesService,
    private authService: AuthService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {

    this.activeRoute.paramMap.subscribe(params => {
      this.id = params.get("id");
      console.log(this.id)
      this.categoriesService.getCategoryById(this.id)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data: any) => {
          let categoryData = data
          console.log('data', data)
          this.image = data.imageURL;
          this.imageURL.setValue(categoryData.imageURL);
          this.type.setValue(categoryData.type);
          this.isActive.setValue(categoryData.isActive);
          this.name.setValue(categoryData.name);
          this.parentId.setValue(categoryData.parentId);
          this.code.setValue(categoryData.code);
        },
          error => {
            swal.default.fire("Njoftim", error.error.error.error, 'warning');
          })
      this.categoriesFormGroup = categoriesFormBuilder.group({
        imageURL: this.imageURL,
        type: this.type,
        isActive: this.isActive,
        name: this.name,
        parentId: this.parentId,
        code: this.code,
      })

      // if(this.authService.getUser().country) {
      //   this.countryVal = this.authService.getUser().country;
      // }

      this.getAllCategories();
    })

  }

  ngOnInit(): void {}
  

  get getCategoriesFormGroup(): any { return this.categoriesFormGroup.controls };

  public onFileChange(event, inputName) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      let fls = {}
      reader.onload = () => {
        this.categoriesFormGroup.patchValue({
          'imageURL': reader.result
        });
      }
    }
  }


  public addCategory() {
    this.submitted = true;

    if (this.categoriesFormGroup.valid) {
      let body = {
        imageURL: this.categoriesFormGroup.get('imageURL').value,
        type: this.categoriesFormGroup.get('type').value,
        name: this.categoriesFormGroup.get('name').value,
        isActive: this.categoriesFormGroup.get('isActive').value,
        parentId: this.categoriesFormGroup.get('parentId').value,
        code: this.categoriesFormGroup.get('code').value
      }

      this.categoriesService.updateCategory(this.id, body)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((data: any) => {
          swal.default.fire("Sukses", "Kategoria u ndryshua me sukses", 'success');
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
