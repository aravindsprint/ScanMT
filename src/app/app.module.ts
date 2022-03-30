import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';




import { AppRoutingModule } from './app-routing.module';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpClientModule }    from '@angular/common/http';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { FavoriteService } from './services/favorite.service';
import { IonicStorageModule } from '@ionic/storage';

import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';

//import { SocialSharing } from '@ionic-native/social-sharing/ngx';
//import { AudioService } from 'src/app/services/audio.service';
//import { NativeAudio } from '@ionic-native/native-audio/ngx';
//import { Device } from '@ionic-native/device/ngx';
import { Ng2CompleterModule } from 'ng2-completer';
import { AutoCompleteModule } from 'ionic4-auto-complete';

//import {AutocompleteLibModule} from 'angular-ng-autocomplete';
//import { NgSelectModule } from '@ng-select/ng-select';
import { IonicSelectableModule } from 'ionic-selectable';
import { CommonModule } from '@angular/common';
import {EditStockPageModule} from 'src/app/edit-stock/edit-stock.module';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, CommonModule, IonicModule.forRoot(), IonicStorageModule.forRoot(), AppRoutingModule, Ng2SearchPipeModule, HttpClientModule,],
  providers: [
    StatusBar,
    Ng2CompleterModule,
    AutoCompleteModule,
    IonicSelectableModule,
    //NgSelectModule,
    //AutocompleteLibModule,
    SplashScreen,
    //SocialSharing,
    //AudioService,
    //NativeAudio,
    //Device,
    BarcodeScanner,
    FavoriteService,
    EditStockPageModule,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    NativeStorage],
  bootstrap: [AppComponent],
})
export class AppModule {}
