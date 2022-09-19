import { Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { CompanyService } from 'app/services/company.service';
import { CountryService } from 'app/services/country.service';
import { MenuServiceService } from 'app/services/menu-service.service';
import { OrdersService } from 'app/services/orders.service';
import { ProductService } from 'app/services/product.service';
import { RestaurantsService } from 'app/services/restaurants.service';
import { City } from 'app/shared/cities/City';
import { Country } from 'app/shared/countries/Country';
import { Subject } from 'rxjs';
import * as swal from "sweetalert2";
import { environment } from 'environments/environment';
import * as mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import L from 'leaflet';

@Component({
  selector: 'app-company-order-new',
  templateUrl: './company-order-new.component.html',
  styleUrls: ['./company-order-new.component.css']
})
export class CompanyOrderNewComponent implements OnInit {

  constructor(
    private productService: ProductService,
    private orderService: OrdersService,
    private authService: AuthService,
    private menuService: MenuServiceService,
    private countiesService: CountryService,
    private companiesService: CompanyService,
    private restaurantService: RestaurantsService,
    private router: Router) {
  }

  public map: mapboxgl.Map;

  private searchSub$ = new Subject<string>();

  public companyData;

  public phone: string;
  public products: any[] = [];
  public productList: any[] = [];
  public productId: string;
  public quantity: string = "1";
  public comment: string;
  public countryCities: any[] = [];
  public countries: any[] = [];
  public street;
  public cityId;
  public countryId;
  public cities;
  public transport = 0;
  public totalPrice = 0;
  public currentCountry: any;
  public supplier: any;
  public isTrue = false;
  public loadingSuggestions = false;
  public lat = 42.66485595028476;
  public lng = 21.154434870071945;
  public countrySelected;
  public countryDisabled = true;
  public cityDisabled = true;
  public fullAddress;

  public citySelected;
  public userZone;
  public supplierZone;

  public supplierId;
  public supplierType;
  public suppliers: any[] = [];
  public supplierAddressId;
  public supplierAddresses = [];
  public markets: any[] = [];
  public restaurants: any[] = [];
  public addresses: any[] = [];
  public addressId: any;
  public couriers: any[] = [];
  public allCouriers: any[] = [];
  public courierId: any;
  public user: any;
  public prefixes: any[] = [];
  public prefixId: string;
  public prefixDisable: boolean = false;
  public addressSuggest: any[] = [];
  public latitude;
  public longitude;
  public search;
  public session;

  public style = 'mapbox://styles/mapbox/streets-v11';

  ngOnInit(): void {
    this.companyData = this.authService.getCompanyData();
    this.addresses.push({ _id: "newAddress", street: "Shto nje adres te re" });

    if (this.companyData.role === "admin") {
      if (this.companyData.country === "") {
        this.countryDisabled = false;
        this.cityDisabled = false;
      }
    } else {
      this.restaurantService.getAll()
        .subscribe(data => this.restaurants = data.restuarants);
      this.companiesService.getAllComp()
        .subscribe(data => this.markets = data.companies);
    }

    this.authService.getAllCouriers()
      .subscribe(data => {
        if (data) {
          this.allCouriers = data.couriers;
          this.couriers = this.allCouriers;
        }
      });

    this.countiesService.getAllCountries()
      .subscribe(data => {
        this.countries = data;

        const countries = this.getUniqueCountries(this.companyData.country || []);
        const cities = this.getUniqueCities(this.companyData.city || []);
        if (countries && countries.length === 1) {
          const country = data.find(d => d.name === countries[0]);
          this.countrySelected = country.name;
          this.countryId = country.name;
          this.cities = country.cities;
          this.prefixId = country.prefix;
          this.prefixDisable = true;

          if (this.cities && this.cities.length === 1) {
            this.cityId = this.cities[0].name;
            this.citySelected = this.cities[0].name;
          } else if (cities && cities.length > 0) {
            if (cities && cities.length > 1) {
              this.cityDisabled = false;
            } else if (cities && cities.length === 1) {
              this.cityId = cities[0];
              this.citySelected = cities[0];
            }
          }
        } else {

          if (this.companyData.country && typeof this.companyData.country === "string") {
            const country = data.find(d => d.name === countries);

            this.countrySelected = countries;
            this.countryDisabled = true;
            this.prefixId = country.prefix;
            this.prefixDisable = true;
            this.countryId = country.name;
          } else {
            this.countryDisabled = false;
          }
          if (this.companyData.city && typeof this.companyData.city === "string") {
            this.citySelected = this.companyData.city;
            this.cityDisabled = true;
          } else {
            this.cityDisabled = false;
          }

          if (this.countrySelected) {
            const country = data.find(d => d.name === this.countrySelected);
            this.cities = country.cities;
          }
        }
      })

    if (this.companyData.role === "company") {
      this.productService.getAllProductsForCompanyWithoutPagination()
        .subscribe(data => {
          this.products = data.products;
        });

      this.companiesService.getCompanyById(this.companyData.companyId)
        .subscribe(data => {
          this.supplier = data.company;
          this.supplierAddresses = this.supplier.address;
          if (this.supplierAddresses && this.supplierAddresses.length === 1) {
            this.supplierAddressId = this.supplierAddresses[0]._id;
          }
          this.supplierId = this.companyData.companyId;
          this.supplierType = this.companyData.role;
        });
    } else if (this.companyData.role === "restaurant") {
      this.menuService.getAllProductsWithoutPagination(this.companyData.companyId)
        .subscribe(data => {
          this.products = data.products;
        });

      this.restaurantService.getRestaurantById(this.companyData.companyId)
        .subscribe(data => {
          this.supplier = data.restuarants;
          this.supplierAddresses = this.supplier.address;
          if (this.supplierAddresses && this.supplierAddresses.length === 1) {
            this.supplierAddressId = this.supplierAddresses[0]._id;
          }
          this.supplierId = this.companyData.companyId;
          this.supplierType = this.companyData.role;
        });
    } else if (this.companyData.company) {
      this.menuService.getAllProductsWithoutPagination(this.companyData.companyId)
        .subscribe(data => {
          this.products = data.products.products;
        });

      this.restaurantService.getRestaurantById(this.companyData.companyId)
        .subscribe(data => {
          this.supplier = data.restuarants;
          this.supplierAddresses = this.supplier.address;
          this.supplierId = this.companyData.companyId;
          this.supplierType = this.companyData.role;
        });
    }
  }

  public loadMap() {

    if (this.countryId && this.cityId) {

      const country = this.countries.find(f => f.name === this.countryId);
      if (country) {
        const city = country.cities.find(f => f.name === this.cityId);
        if (city) {
          this.lng = parseFloat(city.coordinates.lng.$numberDecimal);
          this.lat = parseFloat(city.coordinates.lat.$numberDecimal);
        } else {
          this.lng = parseFloat(country.coordinates.lng.$numberDecimal);
          this.lat = parseFloat(country.coordinates.lat.$numberDecimal);
        }
      }
    }


    this.map = new mapboxgl.Map({
      accessToken: environment.mapboxAccessToken,
      container: 'map',
      style: this.style,
      zoom: 12,
      center: [this.lng, this.lat],
    });

    const geocoder = new MapboxGeocoder({
      accessToken: environment.mapboxAccessToken,
      mapboxgl: mapboxgl,
      reverseGeocode: true,
      marker: {
        color: 'orange',
        draggable: true
      },
    });

    geocoder.on('result', (selected) => {  
      const lat = selected.result.geometry.coordinates[1];
      const lng = selected.result.geometry.coordinates[0];

      this.latitude = lat;
      this.longitude = lng;
    
      this.countiesService.findLatLng(lat, lng)
        .subscribe(data => {
          if (data && data.addressesString && Array.isArray(data.addressesString) && data.addressesString.length > 0) {
            const address = data['addressesString'][0];
            this.street = address.street;
            this.countryId = address.country;
            this.cityId = address.city;

            this.getSuppliers();
            this.calculateTransport(this.supplier);
          }
        })
    
    });

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    });

    this.map.on("click", (data) => {
      const lngLat = data.lngLat;
      const lat = lngLat.lat;
      const lng = lngLat.lng;

      this.latitude = lat;
      this.longitude = lng;
    
      geocoder.flyTo = (false);

      geocoder.query(`${lat},${lng}`);

      this.countiesService.findLatLng(lat, lng)
        .subscribe(data => {
          if (data && data.addressesString && Array.isArray(data.addressesString) && data.addressesString.length > 0) {
            const address = data['addressesString'][0];
            this.street = address.street;
            this.countryId = address.country;
            this.cityId = address.city;

            this.getSuppliers();
            this.calculateTransport(this.supplier);
          }
        })
    });

    this.map.addControl(geocoder);
    this.map.addControl(geolocate);

    geolocate.on('geolocate', () => {
      console.log('A geolocate event has occurred.');
    });

    geocoder.on('geocoder.input', function (ev) {
      this.map.getSource('single-point').setData(ev.result.geometry);
    });

    this.map.on("load", () => {
      this.map.resize();
    });
  }

  public startsWithSearchFn(item, term) {
    return item;
  }

  public applyFilter(filterValue: string) {
    this.searchSub$.next(filterValue)
  }

  public getUniqueCountries(countries: string[] | string) {
    if (typeof countries === "string") {
      return countries;
    } else {
      const countriesRet = [];
      for (const country of countries) {
        if (!countriesRet.includes(country)) {
          countriesRet.push(country);
        }
      }

      return countriesRet;
    }
  }

  public addressChange($event) {
    this.applyFilter($event.target.value);
  }

  public addressSelected($event) {
    this.isTrue = false;
    const address = $event.fullAddress;
    if (address) {
      const found = this.addressSuggest.find(f => f.fullAddress === address);
      if (found) {
        this.street = address;
        this.countryId = found.country;
        this.cityId = found.city;
    
        this.getSuppliers();
        if (this.supplierId && this.supplierType) {
          this.calculateTransport(this.supplier);
        }
      }
    }
  }

  public addressIdChange() {
    if (this.addressId === 'newAddress') {
      this.loadMap();
    }
    
    const addressFound = this.user && this.user.addresses.find(f => f._id === this.addressId);
    if (addressFound) {

      if (addressFound.city && addressFound.country) {
        this.street = addressFound.street;
        this.cityId = addressFound.city;
        this.countryId = addressFound.country;

        this.getSuppliers();

        if (addressFound.coordinates.latitude && addressFound.coordinates.longitude) {
          this.countiesService.findZoneByLatLng(addressFound.coordinates.latitude, addressFound.coordinates.longitude)
          .subscribe(
              data => {
                this.userZone = this.getZoneName(data.result.name);
              },
              err => {
                console.log(err);
                if (err.status === 400) {
                  this.userZone = "No Zone Found !";
                }
              }
          );
        } else {
          this.userZone = "No Zone Found !";
        }
        
      }
    }
    if (this.supplierId && this.supplierType && this.supplier) {
      this.calculateTransport(this.supplier);
    }
  }

  public getUniqueCities(cities: string[] | string) {
    if (typeof cities === "string") {
      return cities;
    } else {
      const citiesRet = [];
      for (const city of cities) {
        if (!citiesRet.includes(city)) {
          citiesRet.push(city);
        }
      }

      return citiesRet;
    }
  }

  public findUser() {
    if (this.phone) {
      this.authService.findUser(this.getPhoneNumber())
        .subscribe(data => {
          if (data) {
            this.user = data;
            this.addresses = data.addresses;
            if (this.addresses && this.addresses.length === 1) {
              this.addressId = this.addresses[0]._id;
              this.addressIdChange();
            }
            this.addresses.push({ _id: "newAddress", street: "Shto nje adres te re" });

            swal.default.fire("U gjet klienti", "", 'success');
          } else {
            swal.default.fire("Nuk u gjet klienti", "", 'warning');
            this.loadMap();
            this.addressId = 'newAddress';
            this.addresses = [];
            this.user = undefined;
            this.fullAddress = "";
            this.transport = 0;
          }
        });
    }
  }

  public addProduct() {
    if (this.productId && this.quantity) {
      const productFound = this.products.find(f => f._id === this.productId);
      if (productFound) {
        this.productList.push({
          _id: productFound._id,
          product_id: productFound._id,
          name: productFound.name,
          quantity: parseFloat(this.quantity)
        });

        this.productId = "";
        this.quantity = "1";
      }
    }
  }

  public getCurrency() {
    if (this.companyData.currencyType) {
      return this.companyData.currencyType;
    }
    if (this.countryId) {
      return this.countries.find(f => f.name === this.countryId).currency;
    }
    if (this.prefixId === "+383") {
      return "Euro";
    }
    if (this.prefixId === "+355") {
      return "Lekë";
    }

    return "";
  }

  public delete(id: string) {
    if (id) {
      const index = this.productList.findIndex(f => f._id === id);
      if (index > -1) {
        this.productList.splice(index, 1);
      }
    }
  }

  public getPhoneNumber() {
    let prefix = this.prefixId;

    let phone;
    if (this.phone && this.phone.startsWith("0")) {
      phone = this.phone.substring(1);
    } else {
      phone = this.phone;
    }

    return `${prefix}${phone}`;
  }

  public onfocusLeavePhone($event: any) {
    this.findUser();
  }

  public save() {
    debugger;
    if (this.companyData.role !== "admin") {
      let phone;
      if (this.phone) {
        if (this.phone && this.phone.startsWith("0")) {
          phone = this.prefixId + this.phone.substring(1);
        } else {
          phone = this.prefixId + this.phone;
        }
      }

      let type;
      if (this.supplierType) {
        type = this.supplierType;
      } else {
        type = this.companyData.role === "company" ? "market" : "restaurant"
      }

      let address;
      if (this.addressId === 'newAddress' || this.companyData.role !== 'admin') {
        address = {
          street: this.street,
          city: this.cityId,
          country: this.countryId,
          latitude: "0",
          longitude: "0"
        };
      } else {
        const addressFound = this.user && this.user.addresses.find(f => f._id === this.addressId);
        if (addressFound) {
          address = {
            street: addressFound.street,
            city: addressFound.city,
            country: addressFound.country,
            latitude: addressFound.coordinates.latitude,
            longitude: addressFound.coordinates.longitude
          };
        }
      }

      let courier = {
        "name": null,
        "courierId": null,
        "phone": null
      };

      if (this.courierId) {
        const courierFound = this.couriers.find(f => f._id === this.courierId);
        if (courierFound) {
          courier = {
            "name": courierFound.fullName,
            "courierId": courierFound._id,
            "phone": courierFound.phone
          };
        }
      }

      const data = {
        clientId: phone,
        phone,
        address: address,
        courier: courier,
        companyId: this.companyData.companyId || this.supplierId,
        clientComment: this.comment,
        type: type,
        products: this.productList,
        price: this.totalPrice,
        company: true,
        whoOrder: this.companyData.role,
        transport: this.transport,
      }

      this.orderService.createOrder(data)
        .subscribe(
          () => {
            swal.default.fire("Sukses", "Porosia u shtua me sukses", 'success');
            if (this.companyData.role === "company") {
              this.router.navigate(['/company/orders'])
            } else if (this.companyData.role === "admin") {
              this.router.navigate(['/admin/orders'])
            } else if (this.companyData.role === "restaurant") {
              this.router.navigate(['/restaurant/orders'])
            }
          },
          (error) => {
            let message = String.fromCharCode.apply(
              null,
              new Uint8Array(error.error) as any);
            if (message) {
              const messageBody = JSON.parse(message);
              if (messageBody) {
                swal.default.fire("Gabim", messageBody.message, 'error');
              }
            }
          }

        );
    } else {
      let phone;
      if (this.phone && this.phone.startsWith("0")) {
        phone = this.prefixId + this.phone.substring(1);
      } else {
        phone = this.prefixId + this.phone;
      }

      let type;
      if (this.supplierType) {
        type = this.supplierType;
      } else {
        type = this.companyData.role === "company" ? "market" : "restaurant"
      }

      let address;
      if (this.addressId === 'newAddress') {
        address = {
          street: this.street,
          city: this.cityId,
          country: this.countryId,
          latitude: "0",
          longitude: "0"
        };
      } else {
        const addressFound = this.user && this.user.addresses.find(f => f._id === this.addressId);
        if (addressFound) {
          address = {
            street: addressFound.street,
            city: addressFound.city,
            country: addressFound.country,
            latitude: addressFound.coordinates.latitude,
            longitude: addressFound.coordinates.longitude
          };
        }
      }

      let courier = {
        "name": null,
        "courierId": null,
        "phone": null
      };

      if (this.courierId) {
        const courierFound = this.couriers.find(f => f._id === this.courierId);
        if (courierFound) {
          courier = {
            "name": courierFound.fullName,
            "courierId": courierFound._id,
            "phone": courierFound.phone
          };
        }
      }

      const data = {
        clientId: phone,
        address: address,
        courier: courier,
        companyId: this.companyData.companyId || this.supplierId,
        clientComment: this.comment,
        type: type,
        products: this.productList,
        price: this.totalPrice,
        company: true,
        whoOrder: this.companyData.role,
        transport: this.transport,
      }

      this.orderService.createOrder(data)
        .subscribe(
          () => {
            swal.default.fire("Sukses", "Porosia u shtua me sukses", 'success');
            if (this.companyData.role === "company") {
              this.router.navigate(['/company/orders'])
            } else if (this.companyData.role === "admin") {
              this.router.navigate(['/admin/orders'])
            } else if (this.companyData.role === "restaurant") {
              this.router.navigate(['/restaurant/orders'])
            }
          },
          (error) => {
            let message = String.fromCharCode.apply(
              null,
              new Uint8Array(error.error) as any);
            if (message) {
              const messageBody = JSON.parse(message);
              if (messageBody) {
                swal.default.fire("Gabim", messageBody.message, 'error');
              }
            }
          }

        );

    }
  }

  public handleCountryChange(event: any) {
    this.supplierType = "";
    this.supplierId = "";

    const country = event as Country;
    if (country) {
      this.cities = country.cities;
      this.countryId = country.name;
    } else {
      this.cities = [];
    }
  }

  public handleCityChange(event: any) {
    this.supplierType = "";
    this.supplierId = "";

    const city = event as City;

    if (city) {
      this.cityId = city.name;
    } else {
      this.cityId = "";
    }

    this.getSuppliers();
  }

  public getSuppliers() {
    if (this.companyData.role === "admin") {
      this.restaurantService.getAllByCountryAndCity(this.countryId, this.cityId)
        .subscribe(data => {
          this.restaurants = data.restuarants;
          this.updateSuppliersData();
        });

      this.companiesService.getAllByCountryAndCity(this.countryId, this.cityId)
        .subscribe(data => {
          this.markets = data.companies;
          this.updateSuppliersData();
        });

    }
  }

  public updateSuppliersData() {
    if (this.supplierType === "restaurant") {
      this.suppliers = this.restaurants;
    } else {
      this.suppliers = this.markets;
    }
  }

  public supplierTypeChange($event) {
    this.supplierId = "";
    this.products = [];

    if ($event === "restaurant") {
      this.suppliers = this.restaurants;
    } else {
      this.suppliers = this.markets;
    }
  }

  public supplierChange($event) {
    this.products = [];
    this.supplier = $event;
    this.supplierAddresses = $event.address;

    if (this.supplierType === "restaurant") {
      this.menuService.getAllProductsForAdminWithoutPagination($event._id)
        .subscribe(data => {
          this.products = data.products;
        });

    } else {
      this.productService.getAllProductsForAdminWithoutPagination($event._id)
        .subscribe(data => {
          this.products = data.products;
        });
    }

    this.calculateTransport($event);
  }

  public supplierAddressChange($event) {
    this.calculateTransport(this.supplier);
  }

  public calculateTransport($event) {

    let userAddress;
    if (this.addressId === 'newAddress') {

      this.countiesService.findZoneByLatLng(this.latitude, this.longitude)
      .subscribe(
        data => {
          this.userZone = this.getZoneName(data.result.name);
        },
        err => {
          console.log(err);
          if (err.status === 400) {
            this.userZone = "No Zone Found !";
          }
        }
      );

      userAddress = {
        street: this.street,
        city: this.cityId,
        country: this.countryId,
          coordinates: {
            latitude: this.latitude,
            longitude: this.longitude
          }
      };
    } else if (this.user) {
      userAddress = this.user.addresses.find(f => f._id === this.addressId);

      this.countiesService.findZoneByLatLng(userAddress.coordinates.latitude, userAddress.coordinates.longitude)
      .subscribe(
          data => {
            this.userZone = this.getZoneName(data.result.name);
          },
          err => {
            console.log(err);
            if (err.status === 400) {
              this.userZone = "No Zone Found !";
            }
          }
      );
    }

    let supplierAddressFound: any = [];
    const supplierAddresses = ($event || this.supplier).address;
    let addressFound: any = supplierAddresses.find(f => f._id === this.supplierAddressId);
    if (addressFound) {

      this.countiesService.findZoneByLatLng(addressFound.latitude, addressFound.longitude)
      .subscribe(
        data => {
          this.supplierZone = this.getZoneName(data.result.name);
        },
        err => {
          console.log(err);
          if (err.status === 400) {
            this.supplierZone = "No Zone Found !";
          }
        }
      );

      supplierAddressFound = [{
        street: addressFound.street,
        city: addressFound.city,
        country: addressFound.country,
          coordinates: {
            latitude: addressFound.latitude,
            longitude: addressFound.longitude
          }
      }]; 
    }

    this.orderService.calculateTransport(userAddress, supplierAddressFound, this.countryId)
      .subscribe(data => {
        if (data) {
          this.transport = data;
        }
      });
  }

  public prefixChange($event, value) {
    if (value) {

      this.countiesService.getAllCountries()
        .subscribe(countries => {
          for (const country of countries) {
            if (country.prefix === value) {
              this.currentCountry = country;
              break;
            }
          }
        });

      this.phone = "";
      this.comment = "";
      this.addressId = "";
      this.supplierId = "";
      this.supplierType = "";
      this.courierId = "";
      this.couriers = [];
      this.transport = 0;

      this.couriers = this.allCouriers.filter(f => f.phone.startsWith(value));
    }
  }

  public getZoneName(name: string) {
    if (name.includes("-"))
      return name.split("-")[0];
    return name;
  }
}
