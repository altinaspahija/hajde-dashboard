import { Component } from '@angular/core';
import { ZoneService } from 'app/services/zone.service';
import { Country } from 'app/shared/countries/Country';
import { City } from 'app/shared/cities/City';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent {

  constructor(
    private zonesService: ZoneService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.zoneId = params["id"];
    });
  }

  ngOnInit(): void {

    forkJoin(
      this.zonesService.getById(this.zoneId),
      this.zonesService.getAll(),
      this.zonesService.getAllZoneMappings(this.zoneId)
    ).subscribe(
      ([zone, zones, mappings]) => {

        this.zone = zone && zone.length > 0 ? zone[0] : null;
        this.zones = zones;
        this.loading = true;

        for (const z of zones) {
          if (z._id !== this.zoneId) {
            const _mapping = mappings.find(f =>
              f.zone1 === z._id ||
              f.zone2 == z._id
            );
            if (!_mapping) {
              this.zoneMappings.push({
                _id: null,
                id1: this.zone._id,
                id2: z._id,
                name: `${this.zone.name} - ${z.name}`,
                country: z.country,
                city: z.city,
                pricing: "0"
              });
            } else {

              let name = _mapping.name as string;
              if (name) {
                let nameSplitted = name.split(" - ");
                if (nameSplitted && nameSplitted.length > 0) {
                  if (this.zone.name === nameSplitted[1]) {
                    _mapping.name = `${nameSplitted[1]} - ${nameSplitted[0]}`;
                  } else {
                    _mapping.name = `${nameSplitted[0]} - ${nameSplitted[1]}`;
                  }
                  this.zoneMappings.push(_mapping);
                }
              }

            }
          } else if (z._id === this.zoneId) {
            const _mapping = mappings.find(f =>
              f.zone1 === z._id &&
              f.zone2 == z._id
            );
            if (_mapping) {
              this.zoneMappings.unshift({
                _id: _mapping._id,
                id1: _mapping.zone1,
                id2: _mapping.zone2,
                name: _mapping.name,
                country: _mapping.country,
                city: _mapping.city,
                pricing: _mapping.pricing
              });
            } else {
              this.zoneMappings.unshift({
                _id: null,
                id1: this.zone._id,
                id2: this.zone._id,
                name: `${this.zone.name} - ${this.zone.name}`,
                country: z.country,
                city: z.city,
                pricing: "0"
              });
            }
          }
        }
      },
      (err) => {
        this.loading = true;
      },
      () => {
        this.loading = true;
      })
    this.zonesService.getAll()
      .subscribe(data => this.zones = data);
  }

  public zoneMappings: any[] = [];
  public loading: boolean = false;
  public zoneId: string;
  public zones: any[] = [];
  public zone;

  public deleteMapping(id: number) {
    this.zoneMappings.splice(id, 1);
  }

  public updatePrice(id: string, price: string) {
    this.zoneMappings[id].pricing = parseFloat(price || "0");
  }

  public saveAll() {
    this.zonesService.saveMappings(this.zoneId, this.zoneMappings)
      .subscribe(data => {
        this.router.navigate(["/admin/zones"]);
      });
  }
}
