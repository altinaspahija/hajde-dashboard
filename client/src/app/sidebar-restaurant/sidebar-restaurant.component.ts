import { Component, OnInit } from '@angular/core';

export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}


export const ROUTES: RouteInfo[] = [
  { path: '/restaurant/dashboard',     title: 'Paneli',         icon:'nc-bank',       class: '' },
  { path: '/restaurant/orders',title: 'Porositë', icon:'nc-box-2', class: ''},
  { path: '/restaurant/products',title: 'Produktet', icon:'nc-tag-content', class: '' }
];


@Component({
  selector: 'app-sidebar-restaurant',
  templateUrl: './sidebar-restaurant.component.html',
  styleUrls: ['./sidebar-restaurant.component.css']
})
export class SidebarRestaurantComponent implements OnInit {

  constructor() { }
  public menuItems: any[];
  ngOnInit(): void {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }


}
