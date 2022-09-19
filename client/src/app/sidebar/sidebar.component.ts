import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/admin/dashboard', title: 'Paneli', icon: 'nc-bank', class: '' },
    { path: '/admin/companies', title: 'Kompanitë', icon: 'nc-cart-simple', class: '' },
    { path: '/admin/restaurants', title: 'Restaurantet', icon: 'nc-chart-pie-36', class: '' },
    { path: '/admin/users', title: 'Klientët', icon: 'nc-single-02', class: '' },
    { path: '/admin/couriers', title: 'Korieri', icon: 'nc-user-run', class: '' },
    { path: '/admin/orders', title: 'Porositë', icon: 'nc-box-2', class: '' },
    { path: '/admin/offers', title: 'Oferta', icon: 'nc-diamond', class: '' },
    { path: '/admin/banners', title: 'Banerat', icon: 'nc-money-coins', class: '' },
    { path: '/admin/categories', title: 'Kategorite', icon: 'nc-money-coins', class: '' },
    { path: '/admin/notification', title: 'Notification', icon: 'nc-money-coins', class: '' },
    { path: '/admin/countries', title: 'Shtetet', icon: 'nc-map-big', class: '' },
    { path: '/admin/zones', title: 'Zonat', icon: 'nc-map-big', class: '' },
    { path: '/admin/geolocations', title: 'Geolocation Mapping', icon: 'nc-map-big', class: '' },
    { path: '/admin/target-groups', title: 'Target groups', icon: 'nc-circle-10', class: '' },
    { path: '/admin/auth-users', title: 'Shfrytëzuesit', icon: 'nc-single-02', class: '' },
    { path: '/admin/product-limitations', title: 'Limitimi i produkteve per markete', icon: 'nc-app', class: '' },
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
}
