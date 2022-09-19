import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientsService } from 'app/services/clients.service';
import { TargetGroupService } from 'app/services/target-groups.service';
import * as swal from "sweetalert2";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  constructor(
    private targetGroupService: TargetGroupService,
    private clientService: ClientsService,
    private router: Router
  ) { }

  public title: string;
  public selectedClient: string;
  public clients: any;
  public clientsTable: any = [];

  ngOnInit(): void {
    this.clientService.getAll()
      .subscribe(data => {
        this.clients = data.clients;
      })
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
      this.targetGroupService.create({
        title: this.title,
        clients: this.clientsTable
      })
        .subscribe(() => {
          swal.default.fire("Sukses", "U krijua me sukses target grupi " + this.title, 'success');
          this.router.navigate(['/admin/target-groups']);
        });
    }
  }
}
