import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { ROUTES } from '../../sidebar/sidebar.component';
import { Router } from '@angular/router';
import { Location} from '@angular/common';
import {AuthService} from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';
import { NotificationService } from '../../services/notification.service';
import { takeUntil } from 'rxjs/operators';
import {Howl} from 'howler';

@Component({
    moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit{
    private listTitles: any[];
    public nots: any[];
    location: Location;
    private nativeElement: Node;
    private toggleButton;
    private sidebarVisible: boolean;
    public user:any;
    public datee = Date.now();
    public count: any;

    public isCollapsed = true;
    @ViewChild("navbar-cmp", {static: false}) button;

    constructor(location:Location, private renderer : Renderer2, 
      private element : ElementRef, 
      private router: Router, 
      private authService:AuthService, 
      private socketService: SocketService,
      private notService: NotificationService
      ) {
        this.location = location;
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
        this.user = this.authService.getUser();
        this.notifications();
        this.getAllNots();
        
    }

    ngOnInit(){
        this.listTitles = ROUTES.filter(listTitle => listTitle);
        var navbar : HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        this.router.events.subscribe((event) => {
          this.sidebarClose();
       });
    }

    ngAfterContentInit(): void {
      //Called after ngOnInit when the component's or directive's content has been initialized.
      //Add 'implements AfterContentInit' to the class.
      this.getAllCount();
    }
    getTitle(){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      if(titlee.charAt(0) === '#'){
          titlee = titlee.slice( 1 );
      }
      for(var item = 0; item < this.listTitles.length; item++){
          if(this.listTitles[item].path === titlee){
              return this.listTitles[item].title;
          }
      }
      return 'Dashboard';
    }
    sidebarToggle() {
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
      }
      sidebarOpen() {
          const toggleButton = this.toggleButton;
          const html = document.getElementsByTagName('html')[0];
          const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];
          setTimeout(function(){
              toggleButton.classList.add('toggled');
          }, 500);

          html.classList.add('nav-open');
          if (window.innerWidth < 991) {
            mainPanel.style.position = 'fixed';
          }
          this.sidebarVisible = true;
      };
      sidebarClose() {
          const html = document.getElementsByTagName('html')[0];
          const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];
          if (window.innerWidth < 991) {
            setTimeout(function(){
              mainPanel.style.position = '';
            }, 500);
          }
          this.toggleButton.classList.remove('toggled');
          this.sidebarVisible = false;
          html.classList.remove('nav-open');
      };
      collapse(){
        this.isCollapsed = !this.isCollapsed;
        const navbar = document.getElementsByTagName('nav')[0];
        if (!this.isCollapsed) {
          navbar.classList.remove('navbar-transparent');
          navbar.classList.add('bg-white');
        }else{
          navbar.classList.add('navbar-transparent');
          navbar.classList.remove('bg-white');
        }

      }

      notifications() {
        this.socketService.notificationObservable().subscribe(data => {
        
         if(this.user.role == "admin") {
          document.querySelector(".dot").classList.add('visible');
          const sound = new Howl({
            src: ["/assets/sounds/not.mp3"]
          })
  
          sound.play();
         }
        })
      }

      logout() {
        this.authService.logout();
        this.router.navigate([""]);
      }

      getAllNots() {
        if(this.user.role == "admin") {
          this.notService.getAdminNotification().subscribe(data =>{
            this.nots = data.notifications;
          })
        }
      }


      getAllCount() {
        this.notService.getAdminCount().subscribe(data =>{
          if(data.count != 0) {
          
            document.querySelector(".dot").classList.add('visible')
          }
        })
      }

      renderNots() {
        if(this.user.role == "admin") {
          document.querySelector(".dot").classList.remove('visible');
          this.getAllNots();
        }
       
      }

      openNot(id, notId) {
        this.notService.setSeen(notId).subscribe(data => {
          this.router.navigate(["admin/orders/", id]);
        });
      }

}
