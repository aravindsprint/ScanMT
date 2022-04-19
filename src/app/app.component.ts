import { Component } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { AlertService } from './services/alert.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/stockdetails', icon: 'home' },
    { title: 'Stock Entry', url: '/stock-entry', icon: 'create' },
    //{ title: 'Inbox', url: '/folder/Inbox', icon: 'mail' },
    //{ title: 'Outbox', url: '/folder/Outbox', icon: 'paper-plane' },
    //{ title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
    //{ title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    //{ title: 'Trash', url: '/folder/Trash', icon: 'trash' },
   // { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
  ];
  //public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private storage: NativeStorage,
    private navCtrl: NavController,
    private router: Router,
    private alertService: AlertService,    
  ) {
    this.initializeApp();
  }

  localIP;
  local_IP;
  ipaddress;


  initializeApp() {
    this.platform.ready().then(() => {

      var isLogged = localStorage.getItem('isLoggedIn');
      console.log("isLogged",isLogged);

      if(isLogged == 'true') {
      this.router.navigate(['/stockdetails']).then(() => {
       //window.location.reload();
      });
      }else{
      this.router.navigate(['']).then(() => {
       //window.location.reload();
       });
      }
      this.statusBar.styleDefault();
      // Commenting splashScreen Hide, so it won't hide splashScreen before auth check
      this.splashScreen.hide();
      this.authService.getToken();
      this.getIP();

    });
  }

  getIP() {
    this.localIP = window.location.origin;
    console.log("localIP",this.localIP);
    this.local_IP = this.localIP.slice(7,18);
    this.ipaddress = this.local_IP;
    console.log("ipaddress",this.ipaddress);
    //this.storage.setItem('IPADDR', this.ipaddress);
    this.storage.setItem('IPADDR', this.ipaddress)
        .then(
          (data) => {
            console.log('IPADDR', data);
          },
          error => console.error('Error storing item', error)
        );
    
    //localStorage.setItem('IPADDR', this.ipaddress);
   
  }

  // When Logout Button is pressed 
  logout() {
    this.authService.logout().subscribe(
      data => {
        this.alertService.presentToast("Logged Out!");        
      },
      error => {
        console.log(error);
      },
      () => {
        this.navCtrl.navigateRoot('/landing');
      }
    );
  }
}
