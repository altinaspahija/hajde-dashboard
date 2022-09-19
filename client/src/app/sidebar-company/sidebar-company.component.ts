import { Component, OnInit } from '@angular/core';

export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  { path: '/company/dashboard',     title: 'Paneli',         icon:'nc-bank',       class: '' },
  { path: '/company/orders',title: 'Porositë', icon:'nc-box-2', class: ''},
  { path: '/company/products',title: 'Produktet', icon:'nc-tag-content', class: '' }
];

@Component({
  selector: 'app-sidebar-company',
  templateUrl: './sidebar-company.component.html',
  styleUrls: ['./sidebar-company.component.css']
})
export class SidebarCompanyComponent implements OnInit {

  constructor() { }
  public menuItems: any[];
  ngOnInit(): void {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }

}
