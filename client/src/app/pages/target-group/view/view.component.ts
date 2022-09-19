import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TargetGroupService } from 'app/services/target-groups.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  constructor(
    private targetGroupService: TargetGroupService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  public targetGroupId: string;
  public targetGroup: any;
  public targetGroupClients: any = [];

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.targetGroupId = params["id"];

      this.targetGroupService.getDetails(this.targetGroupId)
        .subscribe(
          (data) => {
            this.targetGroupClients = data;
          },
          (err) => console.error(err)
        );

        this.targetGroupService.get(this.targetGroupId)
        .subscribe(
          (data) => {
            this.targetGroup = data;
          },
          (err) => console.error(err)
        );
    });
  }

}
