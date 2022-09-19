import { Component } from '@angular/core';
import { environment } from 'environments/environment';
import * as mapboxgl from 'mapbox-gl';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { ZoneService } from 'app/services/zone.service';
import { Country } from 'app/shared/countries/Country';
import { City } from 'app/shared/cities/City';
import * as swal from "sweetalert2";
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {

  public map: any;
  public style = 'mapbox://styles/mapbox/streets-v11';
  public lat = 42.66485595028476;
  public lng = 21.154434870071945;

  private zone;
  public zoneName;

  public zoneCreated: any;
  public zones: any[];
  public zoneEvent: any;

  public countrySelected: string;
  public citySelected: string;
  public cities: any[] = [];
  public countryId: string;
  public cityId: string;
  public modelVisible = false;
  public zoneColor: string = "#0000FF";
  public countryDisabled = false;
  public cityDisabled = false;

  constructor(
    public zoneService: ZoneService,
    private router: Router
  ) { }

  ngOnInit() {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapboxAccessToken,
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat],
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      },
      defaultMode: 'draw_polygon'
    });

    this.map.addControl(draw);

    this.map.on('load', () => {

      this.zoneService.getAll()
        .subscribe(zones => {
          this.zones = zones;

          for (const zone of zones) {
            this.map.addSource(zone.name, {
              'type': 'geojson',
              'data': {
                'type': 'Feature',
                'geometry': {
                  'type': 'Polygon',
                  'coordinates': [[...zone.geometry.coordinates]]
                }
              }
            });

            this.map.addLayer({
              'id': zone._id,
              'type': 'fill',
              'source': zone.name,
              'layout': {},
              'paint': {
                'fill-color': zone.color || this.zoneColor,
                'fill-opacity': 0.5
              }
            });

            this.map.on('click', zone._id, (e) => {
              new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(e.features[0].source)
                .addTo(this.map);
            });

            this.map.on('mouseenter', zone._id, () => {
              this.map.getCanvas().style.cursor = 'pointer';
            });

            this.map.on('mouseleave', zone._id, () => {
              this.map.getCanvas().style.cursor = '';
            });
          }
        });
    });

    this.map.on('draw.create', (e: any) => this.updateArea(e, draw));
    this.map.on('draw.delete', (e: any) => this.updateArea(e, draw));
    this.map.on('draw.update', (e: any) => this.updateArea(e, draw));
  }

  updateArea = (e: any, draw: any) => {
    this.zoneEvent = draw;
    const feature = e.features[0];
    const id = feature.id;

    let geometry = { coordinates: [] };
    if (feature.geometry.coordinates && feature.geometry.coordinates.length > 0) {
      geometry = { coordinates: feature.geometry.coordinates[0] };
    }

    if (e.type === "draw.create") {
      const data = draw.getAll();
      if (data.features.length > 0) {
      } else {
        if (e.type !== 'draw.delete')
          alert('Click the map to draw a polygon.');
      }
      this.modelVisible = true;
      this.zone = {
        id,
        geometry
      }
    } else if (e.type === "draw.update") {
      this.zoneService.update(id, {
        name: this.zoneName,
        zoneId: id,
        geometry: geometry,
        pricing: 0,
        country: this.countryId,
        city: this.cityId,
        color: this.zoneColor
      })
        .subscribe(
          (data) => {
            this.zoneCreated = data;
          });
    }
  }

  public handleCountryChange(event: any) {
    const country = event as Country;
    if (country) {
      this.cities = country.cities;
      this.countrySelected = country.name;
      this.countryId = country._id;

      if (country.coordinates) {
        this.lat = parseFloat(country.coordinates.lat.$numberDecimal);
        this.lng = parseFloat(country.coordinates.lng.$numberDecimal);
        this.map.setCenter([this.lng, this.lat]);
        this.map.setZoom(7);
      }
    } else {
      this.cities = [];
      this.countryId = "";
      this.countrySelected = "";
    }
  }

  public handleCityChange(event: any) {
    const city = event as City;

    if (city) {
      this.citySelected = city.name;
      this.cityId = city._id;

      if (city.coordinates) {
        this.lat = parseFloat(city.coordinates.lat.$numberDecimal);
        this.lng = parseFloat(city.coordinates.lng.$numberDecimal);
        this.map.setCenter([this.lng, this.lat]);
        this.map.setZoom(12);
      }
    } else {
      this.citySelected = "";
      this.cityId = "";
    }
  }

  public save() {

    if (this.zoneName && this.countryId && this.cityId) {

      this.zoneService.create({
        name: this.zoneName,
        zoneId: this.zone.id,
        geometry: this.zone.geometry,
        country: this.countryId,
        city: this.cityId,
        color: this.zoneColor
      })
        .subscribe(
          (data) => {
            this.zoneCreated = data;
            this.modelVisible = false;

            swal.default.fire("Sukses", "U krijua me sukses zona", 'success');
            this.router.navigate(['/admin/zones']);
          });
    }
  }

  public closeModal() {
    this.modelVisible = false;
    this.zoneEvent.deleteAll().getAll();
  }
}
