import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from 'app/services/clients.service';
import { TargetGroupService } from 'app/services/target-groups.service';
import * as swal from "sweetalert2";

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {

  constructor(
    private targetGroupService: TargetGroupService,
    private clientService: ClientsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  public targetGroupId: string;

  public title: string;
  public selectedClient: string;
  public clients: any;
  public clientsTable: any = [];

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.targetGroupId = params["id"];
      if (this.targetGroupId) {

        this.targetGroupService.get(this.targetGroupId)
          .subscribe(data => {
            if (data && data.title) {
              this.title = data.title;
            }
          });

        this.targetGroupService.getDetails(this.targetGroupId)
          .subscribe(data => this.clientsTable = data);

        this.clientService.getAll()
          .subscribe(data => {
            this.clients = data.clients;
          })
      }
    });
  }

  addClient() {
    if (this.selectedClient) {
      const client = this.clients.find(c => c._id === this.selectedClient);
      this.clientsTable.push(client);
      this.selectedClient = "";
    }
  }

  delete(id: string) {
    const client = this.clients.find(c => c._id === id);
    if (client) {
      const cIndex = this.clientsTable.findIndex(c => c._id === id);
      this.clientsTable.splice(cIndex, 1);
    }
  }

  save() {
    if (this.title) {
      this.targetGroupService.update(this.targetGroupId, {
        title: this.title,
        clients: this.clientsTable
      })
        .subscribe(() => {
          swal.default.fire("Sukses", "U ndryshua me sukses target grupi " + this.title, 'success');
          this.router.navigate(['/admin/target-groups']);
        });
    }
  }
}
