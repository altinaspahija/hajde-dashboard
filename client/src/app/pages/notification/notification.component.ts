import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientsService } from 'app/services/clients.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as swal from "sweetalert2";
import { NotificationService } from '../../services/notification.service';

export function checkMatchValidator(senderType: string, client: string, targetGroup: string, country: string) {
  return function (frm) {
    const senderTypeValue = frm.get(senderType).value;
    const clientValue = frm.get(client).value;
    const targetGroupValue = frm.get(targetGroup).value;

    if (senderTypeValue === 'specificClient') {
      if (clientValue) {
        return null;
      }
    } else if (senderTypeValue === 'targetGroup') {
      if (targetGroupValue && country) {
        return null;
      }
    }

    return { match: 'Ju duhet te caktoni nje klient ose nje target grup.' };
  }
}

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();

  public clients;
  public selectedClient;
  public notificationForm: FormGroup;
  public mongoDbIdRegex = /^[0-9a-fA-F]{24}$/;

  private initialValues = {
    client: "",
    title: "Hajde",
    description: "",
    targetGroup: "",
    senderType: "",
    country: "",
  };

  constructor(
    private notificationService: NotificationService,
    private clientsService: ClientsService,
    private fb: FormBuilder
  ) {

    this.notificationForm = this.fb.group({
      client: [this.initialValues.client, []],
      title: [this.initialValues.title, [Validators.required]],
      description: [this.initialValues.description, [Validators.required]],
      country: [this.initialValues.country],
      targetGroup: [this.initialValues.targetGroup, []],
      senderType: [this.initialValues.senderType, [Validators.required]]
    },
    {
      validator: checkMatchValidator('senderType', 'client', 'targetGroup', 'country')
    });
  }

  ngOnInit(): void {
    this.clientsService.getAll()
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(data => {
        this.clients = data.clients;
      });
  }

  submit() {
    if (this.notificationForm.valid) {
      this.sendNotification();
    }
  }

  sendNotification() {
    swal.default.fire({
      title: "A jeni të sigurt që dëshiron ta dergosh njoftimin",
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Po",
      cancelButtonText: "Jo"
    }).then((result) => {
      if (result.value) {
        this.notificationService.sendNotification(this.notificationForm.value)
          .pipe(takeUntil(this.unsubscribeAll))
          .subscribe(data => {
            swal.default.fire("Sukses", "Njoftimi është derguar me sukses", 'success');
            this.notificationForm.reset();
            this.notificationForm.setValue(this.initialValues);
          }, (error) => {
            swal.default.fire("Gabim", error.error.error, 'error');
          })
      }
    });
  }

  percentTargetGroupChanged($event: any) {
    if ($event instanceof Event) {
      const value = $event.target["value"];
      this.notificationForm.controls["targetGroup"].patchValue(value);
    } else if ($event instanceof String) {
      this.notificationForm.controls["targetGroup"].patchValue($event);
    }
  }

  handleCountryChange($event) {
    this.notificationForm.controls["country"].patchValue($event.name);
  }

  isCustomTargetGroup() {
    if (this.targetGroupControl) {
      if (this.targetGroupControl.value) {
        return this.targetGroupControl.value.match(this.mongoDbIdRegex);
      }
    }
    return false;
  }

  downloadList() {
    if (this.notificationForm.valid) {
      this.notificationService.downloadList(this.notificationForm.value)
        .subscribe(data => this.downloadFile(data, "user-notifcations-list"));
    }
  }

  public get senderTypeControl() {
    return this.notificationForm.controls['senderType'];
  }

  public get clientControl() {
    return this.notificationForm.controls['client'];
  }

  public get titleControl() {
    return this.notificationForm.controls['title'];
  }

  public get descriptionControl() {
    return this.notificationForm.controls['description'];
  }

  public get targetGroupControl() {
    return this.notificationForm.controls['targetGroup'];
  }

  downloadFile(data: any, name: string) {
    const blob = new Blob([data.body], { type: "text/csv"});
    const url= window.URL.createObjectURL(blob);
    const a = document.createElement('a')
    a.href = url;
    a.download = `${name}.csv`
    a.click();
    URL.revokeObjectURL(url);
  }
}
