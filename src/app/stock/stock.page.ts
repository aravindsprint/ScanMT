import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { Platform, NavController } from "@ionic/angular";
import { AlertService } from "src/app/services/alert.service";
import { StorageService } from "../services/storage.service";
import { Location } from "@angular/common";
import { NgForm } from "@angular/forms";
import { Injectable } from "@angular/core";

import { BarcodeScanner } from "@awesome-cordova-plugins/barcode-scanner/ngx";

//import { SocialSharing } from '@ionic-native/social-sharing/ngx';
//import { AudioService } from 'src/app/services/audio.service';
//import { NativeAudio } from '@ionic-native/native-audio/ngx';
//import '@capacitor-community/http';
//import { Plugins } from '@capacitor/core';
//import { Device } from '@ionic-native/device/ngx';

import { FavoriteService } from "../services/favorite.service";
import { Storage } from "@ionic/storage";
import { Ng2SearchPipeModule } from "ng2-search-filter";

import { ModalController } from "@ionic/angular";
import { ModalComponent } from "../modal/modal.component";

import { IonicSelectableComponent } from "ionic-selectable";

import { EditStockPage } from '../edit-stock/edit-stock.page';

//const WAREHOUSES = 'warehouseNames';

//@Injectable()

@Component({
  selector: "app-stock",
  templateUrl: "./stock.page.html",
  styleUrls: ["./stock.page.scss"],
})
export class StockPage implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    //private device: Device,
    private router: Router,
    private alertService: AlertService,
    private location: Location,
    //private storage: StorageService,
    private barcodeScanner: BarcodeScanner,
    //private socialSharing: SocialSharing,
    //private audio: AudioService,
    private storage: Storage,
    private favoriteService: FavoriteService,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) {}

  warehouses;
  warehouse;
  targetWarehouse;
  showSetTargetWarehouse;
  showSelectedTargetWarehouse;
  //favstocks = [];
  favstocks:any = [];
  batchNoArray = [];
  warehouseArray = [];
  batchfilteredClasses = [];
  warehousefilteredClasses = [];
  resultoffavstocks;
  stockpresent;

  warehouseChange(event: { component: IonicSelectableComponent; value: any }) {
    console.log("warehouse:", event.value);
    this.warehouse = event.value;
    this.targetWarehouse = this.warehouse.name;
    console.log("targetWarehouse:", this.targetWarehouse);
    localStorage.setItem("TARGETWAREHOUSE", this.targetWarehouse);
    this.showSetTargetWarehouse = false;
    this.showSelectedTargetWarehouse = true;
  }

  jbody1 = [];
  jbody01;
  searchText;
  batch_no;
  batchno;
  batch_nos;
  rows;
  response;
  comm_name;
  colorName;
  color_name;
  id1;
  jbodylen;
  sum;
  total = 0;
  item_code;
  isShown = true;
  data: any;
  barCode: any;
  barcode_Data;
  scanCode;
  batch;
  t_warehouse;
  s_warehouse;
  defaultTargetWarehouse;
  defaultwarehouse;
  favstocksLength;

  stockIdWarehouse;
  stockIdBatchNo;

  showbarCode = false;
  showDelivered = false;
  notauthorized = false;
  //UniqueDeviceID:string;
  //device_uid;
  //uid:string;

  filterTerm: string;
  filterTerm1: string;
  filterTerm2: string;


async openModal(jbody,index) {
 const modal = await this.modalCtrl.create({
 component: EditStockPage,
 componentProps: { jbody: jbody }
 });
 modal.onDidDismiss().then(data=>{
    //this.playersList[index]=data.data
    console.log("data",data)
  })
 return await modal.present();
}

  //async openModal() {
    //const modal = await this.modalCtrl.create({
      //component: ModalComponent,
      //componentProps: { propsType: "modal" },
      //cssClass: "modal",
    //});
    //return await modal.present();
  //}

  getTotal(jbody1) {
    this.jbody01 = jbody1;
    //console.log("this.jbody01",this.jbody01.length);
    //console.log("this.jbody01",this.jbody01.length);
    this.total = 0;
    for (let j = 0; j < this.jbody01.length; j++) {
      //this.total = 0;
      //console.log("this.jbody01[j].actualqty ",this.jbody01[j].actualqty);
      this.total += parseFloat(this.jbody01[j].actualqty);
      //console.log(this.total);
    }
    return this.total.toFixed(3);
  }

  getItems1(ev: any) {
    // Reset items back to all of the items
    //this.getAllStock();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() !== "") {
      //console.log("val",val);
      //this.isItemAvailable = true;
      this.jbody1 = this.jbody1.filter((item) => {
        //console.log("item",item);
        //console.log("item",item.warehouse);
        //this.getTotal(item);
        return item.warehouse.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    } else {
      //this.isItemAvailable = false;
      //this.getAllStock();
      //this.getAllBatchStock(this.scanCode);
      this.getAllBatchStock(this.batch);
    }
  }

  getItems2(ev: any) {
    // Reset items back to all of the items
    //this.getAllStock();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() !== "") {
      //console.log("val",val);
      //this.isItemAvailable = true;
      this.jbody1 = this.jbody1.filter((item) => {
        //console.log("item",item);
        //console.log("item",item.batch_no);
        //this.getTotal(item);
        return item.batch_no.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    } else {
      //this.isItemAvailable = false;
      //this.getAllStock();
      //this.getAllBatchStock(this.scanCode);
      this.getAllBatchStock(this.batch);
    }
  }

  getItems3(ev: any) {
    // Reset items back to all of the items
    //this.getAllStock();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() !== "") {
      //console.log("val",val);
      //this.isItemAvailable = true;
      this.jbody1 = this.jbody1.filter((item) => {
        //console.log("item",item);
        //console.log("item",item.batch_status);
        //this.getTotal(item);
        return item.batch_status.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    } else {
      //this.isItemAvailable = false;
      //this.getAllStock();
      this.getAllBatchStock(this.scanCode);
      //this.getAllBatchStock(this.batch);
    }
  }

  film: any;
  jbodys;

  jbody = {
    isfavorites: false,
    qty: 0,
    change_batch_status: "",
    s_warehouse: "",
    t_warehouse: "",
  };
  jbody2;

  myBackButton() {
    this.location.back();
  }

  myRefreshButton() {
    this.ngOnInit();
  }

  setBatchDetail(item) {
    localStorage.removeItem("IDX");
    localStorage.removeItem("ITEMCODE");
    localStorage.removeItem("SOURCEWAREHOUSE");
    localStorage.removeItem("BATCH");
    localStorage.removeItem("BATCHSTATUS");
    localStorage.removeItem("CHANGEBATCHSTATUS");
    localStorage.removeItem("QTY");
    localStorage.removeItem("TRANSFERQTY");
    localStorage.removeItem("STOCKUOM");
    localStorage.setItem("IDX", item.idx);
    localStorage.setItem("ITEMCODE", item.item_code);
    localStorage.setItem("SOURCEWAREHOUSE", item.warehouse);
    localStorage.setItem("BATCH", item.batch_no);
    localStorage.setItem("BATCHSTATUS", item.batch_status);
    localStorage.setItem("CHANGEBATCHSTATUS", item.batch_status);
    localStorage.setItem("QTY", item.actualqty);
    localStorage.setItem("TRANSFERQTY", item.actualqty);
    localStorage.setItem("STOCKUOM", item.stock_uom);
  }



  showStockasAdded() {
    this.alertService.presentToast("Stock has been Added Already !!");
  }

  selectTargetWarehouse() {
    //console.log("inside showStockasZero");
    //this.notifyService.showZero("No Stock Found !!", "Message")
    this.alertService.presentToast("Select Target Warehouse !!");
  }

  unfavoriteStock(jbody) {
    console.log("unfavoriteStockjbody", jbody);
    console.log("unfavoriteStockjbody", jbody.isfavorites);
    this.favoriteService.unfavoriteStock(jbody).then(() => {
      //this.isFavorite = false;
      this.jbody.isfavorites = false;
    });
  }

  batchform(form: NgForm) {
    this.batch_nos = form.value.batchno;
    console.log("this.batch_nos", this.batch_nos);
    this.getAllBatchStock(this.batch_nos);
  }

  getAllBatchStock(batch) {
    console.log("001");
    this.batch_nos = batch;
    this.authService.getAllBatchStock(this.batch_nos).subscribe((resp) => {
      //console.log("inside auth resp",resp);

      this.response = resp;
      if (this.response) {
        //this.jbody1 = this.response[0];
        if (this.response.message != "Please check the batch no, no Stock Found") {
          this.jbody1 = this.response.message;
          //below for favorite
          for (let i = 0; i < this.jbody1.length; i++) {
            this.jbody1[i].isfavorites = false;
            //this.jbody[i].change_batch_status = this.jbody[i].batch_status;
            //this.jbody[i].qty = this.jbody[i].actualqty;
            console.log(
              "this.jbody1[i].isfavorites",
              this.jbody1[i].isfavorites
            );
          }
          //this.getFavoriteStock();
          this.jbodylen = this.response.message.length;
          if (this.jbodylen == 0) {
            this.showStockasZero();
          }
          //console.log("jbodylen",this.jbodylen);
          //console.log("resp[0]",resp.message[0]);
          //console.log("jbody1",this.jbody1);
          //this.spinner.hide();
          this.isShown = false;
          this.getTotal(this.jbody1);
        } else {
          //this.spinner.hide();
          this.isShown = false;
          this.showStockasZero();
        }
      } else {
        //this.spinner.hide();
        this.isShown = false;
        //console.log("inside err jbody",this.jbody1);
      }
    });
  }

  showStockasZero() {
    //console.log("inside showStockasZero");
    //this.notifyService.showZero("No Stock Found !!", "Message")
    this.alertService.presentToast("Please check the batch no, no Stock Found !!");
  }

  getFavoriteStock() {
    console.log("inside getFavoriteStock");

    this.favoriteService.getAllFavoriteStock().then((result) => {
      console.log("result01 1", result);
    });
  }

  getStorageItem() {
    var storageItem = localStorage.getItem("SITEM");
    console.log("storageItem", storageItem);
  }

  openBarCodeScanner() {
    this.barcodeScanner
      .scan()
      .then((barcodeData) => {
        this.barcode_Data = barcodeData;
        console.log("Barcode data", this.barcode_Data);
        this.barCode = barcodeData;
        //   Barcode data {"cancelled":0,"text":"8413384010008","format":"EAN_13"}
        if (barcodeData) {
          this.scanCode = barcodeData["text"];
          if (this.scanCode) {
            console.log("scanCode", this.scanCode);
            var batchno = this.scanCode.split("=");
            this.batch = batchno[3];
            this.getAllBatchStock(this.batch);
            //this.getAllBatchStock(this.scanCode);
            this.showbarCode = true;
            //this.notauthorized = false;
          }
        } else {
          console.log("=== No data scanned !");
        }
      })
      .catch((err) => {
        console.log("Error", err);
      });
  }

  clearInfo() {
    console.log("inside clearInfo");
    this.showbarCode = false;
    this.showSetTargetWarehouse = true;
    this.showSelectedTargetWarehouse = false;
    this.batch = "";
    this.scanCode = "";
    //this.warehouse = "";
    this.targetWarehouse = localStorage.removeItem("TARGETWAREHOUSE");
    this.favoriteService.removeAllFavoriteStocks();
  }

  getWarehouses() {
    this.authService.getAllWarehouses().subscribe((resp) => {
      this.response = resp;
      if (this.response) {
        if (this.response.message != "No Warehouse Found") {
          this.jbody2 = this.response.message;

          this.jbodylen = this.response.message.length;
          if (this.jbodylen == 0) {
            this.showStockasZero();
          }

          this.isShown = false;
          console.log("jbody2", this.jbody2);
          //this.storage.set(WAREHOUSES, this.jbody2);
          //var warehouseresult = this.storage.get(WAREHOUSES);
          //console.log("warehouseresult",warehouseresult);
          var user_name = localStorage.getItem("USERNAME");
          if(user_name == 'Aravind Govindara' || user_name == 'JayaPrakash'){
           this.warehouses = [{idx:0, name:'JV - READY FOR BILLING - PSS'}, 
           {idx:1, name:'JV/RFD - PSS'},{idx:2, name:'JV/CM1 - PSS'},
           {idx:3, name:'JV/CM2 - PSS'},{idx:4, name:'JV/CM3 - PSS'},
           {idx:5, name:'JV - (TEMP)READY FOR BILLING - PSS'}
           ];
           return this.warehouses;
          }
          else if(user_name == 'muthuveera' || user_name == 'Aravind Govindaraj'){
          this.warehouses = [
          {idx:1,name:'JV - (TEMP)READY FOR BILLING - PSS'},
          {idx:2,name:'JV - READY FOR BILLING - PSS'},
          {idx:3,name:'JV/1stFloor(TEMP-1) - PSS'},
          {idx:4,name:'JV/1stFloor(TEMP-2) - PSS'},
          {idx:5,name:'JV/A201 - PSS'},
          {idx:6,name:'JV/A202 - PSS'},
          {idx:7,name:'JV/A203 - PSS'},
          {idx:8,name:'JV/A204 - PSS'},
          {idx:9,name:'JV/A205 - PSS'},
          {idx:10,name:'JV/A206 - PSS'},
          {idx:11,name:'JV/A207 - PSS'},
          {idx:12,name:'JV/A208 - PSS'},
          {idx:13,name:'JV/A209 - PSS'},
          {idx:14,name:'JV/A210 - PSS'},
          {idx:15,name:'JV/A211 - PSS'},
          {idx:16,name:'JV/A212 - PSS'},
          {idx:17,name:'JV/A213 - PSS'},
          {idx:18,name:'JV/A214 - PSS'},
          {idx:19,name:'JV/A215 - PSS'},
          {idx:20,name:'JV/A216 - PSS'},
          {idx:21,name:'JV/A217 - PSS'},
          {idx:22,name:'JV/A218 - PSS'},
          {idx:23,name:'JV/A219 - PSS'},
          {idx:24,name:'JV/A220 - PSS'},
          {idx:25,name:'JV/A221 - PSS'},
          {idx:26,name:'JV/A222 - PSS'},
          {idx:27,name:'JV/A223 - PSS'},
          {idx:28,name:'JV/A224 - PSS'},
          {idx:29,name:'JV/A225 - PSS'},
          {idx:30,name:'JV/A226 - PSS'},
          {idx:31,name:'JV/A227 - PSS'},
          {idx:32,name:'JV/A228 - PSS'},
          {idx:33,name:'JV/A229 - PSS'},
          {idx:34,name:'JV/A230 - PSS'},
          {idx:35,name:'JV/A231 - PSS'},
          {idx:36,name:'JV/A232 - PSS'},
          {idx:37,name:'JV/A233 - PSS'},
          {idx:38,name:'JV/A234 - PSS'},
          {idx:39,name:'JV/A235 - PSS'},
          {idx:40,name:'JV/A236 - PSS'},
          {idx:41,name:'JV/A237 - PSS'},
          {idx:42,name:'JV/A238 - PSS'},
          {idx:43,name:'JV/A239 - PSS'},
          {idx:44,name:'JV/A240 - PSS'},
          {idx:45,name:'JV/A241 - PSS'},
          {idx:46,name:'JV/A242 - PSS'},
          {idx:47,name:'JV/A243 - PSS'},
          {idx:48,name:'JV/A244 - PSS'},
          {idx:49,name:'JV/A245 - PSS'},
          {idx:50,name:'JV/A246 - PSS'},
          {idx:51,name:'JV/A247 - PSS'},
          {idx:52,name:'JV/A248 - PSS'},
          {idx:53,name:'JV/A249 - PSS'},
          {idx:54,name:'JV/A250 - PSS'},
          {idx:55,name:'JV/B201 - PSS'},
          {idx:56,name:'JV/B202 - PSS'},
          {idx:57,name:'JV/B203 - PSS'},
          {idx:58,name:'JV/B204 - PSS'},
          {idx:59,name:'JV/B205 - PSS'},
          {idx:60,name:'JV/B206 - PSS'},
          {idx:61,name:'JV/B207 - PSS'},
          {idx:62,name:'JV/B208 - PSS'},
          {idx:63,name:'JV/B209 - PSS'},
          {idx:64,name:'JV/B210 - PSS'},
          {idx:65,name:'JV/B211 - PSS'},
          {idx:66,name:'JV/B212 - PSS'},
          {idx:67,name:'JV/B213 - PSS'},
          {idx:68,name:'JV/B214 - PSS'},
          {idx:69,name:'JV/B215 - PSS'},
          {idx:70,name:'JV/B216 - PSS'},
          {idx:71,name:'JV/B217 - PSS'},
          {idx:72,name:'JV/B218 - PSS'},
          {idx:73,name:'JV/B219 - PSS'},
          {idx:74,name:'JV/B220 - PSS'},
          {idx:75,name:'JV/B221 - PSS'},
          {idx:76,name:'JV/B222 - PSS'},
          {idx:77,name:'JV/B223 - PSS'},
          {idx:78,name:'JV/B224 - PSS'},
          {idx:79,name:'JV/B225 - PSS'},
          {idx:80,name:'JV/B226 - PSS'},
          {idx:81,name:'JV/B227 - PSS'},
          {idx:82,name:'JV/B228 - PSS'},
          {idx:83,name:'JV/B229 - PSS'},
          {idx:84,name:'JV/B230 - PSS'},
          {idx:85,name:'JV/B231 - PSS'},
          {idx:86,name:'JV/B232 - PSS'},
          {idx:87,name:'JV/B233 - PSS'},
          {idx:88,name:'JV/B234 - PSS'},
          {idx:89,name:'JV/B235 - PSS'},
          {idx:90,name:'JV/B236 - PSS'},
          {idx:91,name:'JV/B237 - PSS'},
          {idx:92,name:'JV/B238 - PSS'},
          {idx:93,name:'JV/B239 - PSS'},
          {idx:94,name:'JV/B240 - PSS'},
          {idx:95,name:'JV/B241 - PSS'},
          {idx:96,name:'JV/B242 - PSS'},
          {idx:97,name:'JV/B243 - PSS'},
          {idx:98,name:'JV/B244 - PSS'},
          {idx:99,name:'JV/B245 - PSS'},
          {idx:100,name:'JV/B246 - PSS'},
          {idx:101,name:'JV/B247 - PSS'},
          {idx:102,name:'JV/B248 - PSS'},
          {idx:103,name:'JV/B249 - PSS'},
          {idx:104,name:'JV/B250 - PSS'},
          {idx:105,name:'JV/C201 - PSS'},
          {idx:106,name:'JV/C202 - PSS'},
          {idx:107,name:'JV/C203 - PSS'},
          {idx:108,name:'JV/C204 - PSS'},
          {idx:109,name:'JV/C205 - PSS'},
          {idx:110,name:'JV/C206 - PSS'},
          {idx:111,name:'JV/C207 - PSS'},
          {idx:112,name:'JV/C208 - PSS'},
          {idx:113,name:'JV/C209 - PSS'},
          {idx:114,name:'JV/C210 - PSS'},
          {idx:115,name:'JV/C211 - PSS'},
          {idx:116,name:'JV/C212 - PSS'},
          {idx:117,name:'JV/C213 - PSS'},
          {idx:118,name:'JV/C214 - PSS'},
          {idx:119,name:'JV/C215 - PSS'},
          {idx:120,name:'JV/C216 - PSS'},
          {idx:121,name:'JV/C217 - PSS'},
          {idx:122,name:'JV/C218 - PSS'},
          {idx:123,name:'JV/C219 - PSS'},
          {idx:124,name:'JV/C220 - PSS'},
          {idx:125,name:'JV/C221 - PSS'},
          {idx:126,name:'JV/C222 - PSS'},
          {idx:127,name:'JV/C223 - PSS'},
          {idx:128,name:'JV/C224 - PSS'},
          {idx:129,name:'JV/C225 - PSS'},
          {idx:130,name:'JV/C226 - PSS'},
          {idx:131,name:'JV/C227 - PSS'},
          {idx:132,name:'JV/C228 - PSS'},
          {idx:133,name:'JV/C229 - PSS'},
          {idx:134,name:'JV/C230 - PSS'},
          {idx:135,name:'JV/C231 - PSS'},
          {idx:136,name:'JV/C232 - PSS'},
          {idx:137,name:'JV/C233 - PSS'},
          {idx:138,name:'JV/C234 - PSS'},
          {idx:139,name:'JV/C235 - PSS'},
          {idx:140,name:'JV/C236 - PSS'},
          {idx:141,name:'JV/C237 - PSS'},
          {idx:142,name:'JV/C238 - PSS'},
          {idx:143,name:'JV/C239 - PSS'},
          {idx:144,name:'JV/C240 - PSS'},
          {idx:145,name:'JV/C241 - PSS'},
          {idx:146,name:'JV/C242 - PSS'},
          {idx:147,name:'JV/CM1 - PSS'},
          {idx:148,name:'JV/CM2 - PSS'},
          {idx:149,name:'JV/CM3 - PSS'},
          {idx:150,name:'JV/CM4 - PSS'},
          {idx:151,name:'JV/CM5 - PSS'},
          {idx:152,name:'JV/CM6 - PSS'},
          {idx:153,name:'JV/D201 - PSS'},
          {idx:154,name:'JV/D202 - PSS'},
          {idx:155,name:'JV/D203 - PSS'},
          {idx:156,name:'JV/D204 - PSS'},
          {idx:157,name:'JV/D205 - PSS'},
          {idx:158,name:'JV/D206 - PSS'},
          {idx:159,name:'JV/D207 - PSS'},
          {idx:160,name:'JV/D208 - PSS'},
          {idx:161,name:'JV/D209 - PSS'},
          {idx:162,name:'JV/D210 - PSS'},
          {idx:163,name:'JV/D211 - PSS'},
          {idx:164,name:'JV/D212 - PSS'},
          {idx:165,name:'JV/D213 - PSS'},
          {idx:166,name:'JV/D214 - PSS'},
          {idx:167,name:'JV/D215 - PSS'},
          {idx:168,name:'JV/D216 - PSS'},
          {idx:169,name:'JV/D217 - PSS'},
          {idx:170,name:'JV/D218 - PSS'},
          {idx:171,name:'JV/D219 - PSS'},
          {idx:172,name:'JV/D220 - PSS'},
          {idx:173,name:'JV/D221 - PSS'},
          {idx:174,name:'JV/D222 - PSS'},
          {idx:175,name:'JV/D223 - PSS'},
          {idx:176,name:'JV/D224 - PSS'},
          {idx:177,name:'JV/D225 - PSS'},
          {idx:178,name:'JV/D226 - PSS'},
          {idx:179,name:'JV/D227 - PSS'},
          {idx:180,name:'JV/D228 - PSS'},
          {idx:181,name:'JV/D229 - PSS'},
          {idx:182,name:'JV/D230 - PSS'},
          {idx:183,name:'JV/D231 - PSS'},
          {idx:184,name:'JV/D232 - PSS'},
          {idx:185,name:'JV/D233 - PSS'},
          {idx:186,name:'JV/D234 - PSS'},
          {idx:187,name:'JV/D235 - PSS'},
          {idx:188,name:'JV/D236 - PSS'},
          {idx:189,name:'JV/D237 - PSS'},
          {idx:190,name:'JV/D238 - PSS'},
          {idx:191,name:'JV/D239 - PSS'},
          {idx:192,name:'JV/D240 - PSS'},
          {idx:193,name:'JV/D241 - PSS'},
          {idx:194,name:'JV/D242 - PSS'},
          {idx:195,name:'JV/D243 - PSS'},
          {idx:196,name:'JV/D244 - PSS'},
          {idx:197,name:'JV/D245 - PSS'},
          {idx:198,name:'JV/E201 - PSS'},
          {idx:199,name:'JV/E202 - PSS'},
          {idx:200,name:'JV/E203 - PSS'},
          {idx:201,name:'JV/E204 - PSS'},
          {idx:202,name:'JV/E205 - PSS'},
          {idx:203,name:'JV/E206 - PSS'},
          {idx:204,name:'JV/E207 - PSS'},
          {idx:205,name:'JV/E208 - PSS'},
          {idx:206,name:'JV/E209 - PSS'},
          {idx:207,name:'JV/E210 - PSS'},
          {idx:208,name:'JV/E211 - PSS'},
          {idx:209,name:'JV/E212 - PSS'},
          {idx:210,name:'JV/E213 - PSS'},
          {idx:211,name:'JV/E214 - PSS'},
          {idx:212,name:'JV/E215 - PSS'},
          {idx:213,name:'JV/E216 - PSS'},
          {idx:214,name:'JV/E217 - PSS'},
          {idx:215,name:'JV/E218 - PSS'},
          {idx:216,name:'JV/E219 - PSS'},
          {idx:217,name:'JV/E220 - PSS'},
          {idx:218,name:'JV/E221 - PSS'},
          {idx:219,name:'JV/E222 - PSS'},
          {idx:220,name:'JV/E223 - PSS'},
          {idx:221,name:'JV/E224 - PSS'},
          {idx:222,name:'JV/E225 - PSS'},
          {idx:223,name:'JV/E226 - PSS'},
          {idx:224,name:'JV/E227 - PSS'},
          {idx:225,name:'JV/E228 - PSS'},
          {idx:226,name:'JV/E229 - PSS'},
          {idx:227,name:'JV/E230 - PSS'},
          {idx:228,name:'JV/E231 - PSS'},
          {idx:229,name:'JV/E232 - PSS'},
          {idx:230,name:'JV/E233 - PSS'},
          {idx:231,name:'JV/E234 - PSS'},
          {idx:232,name:'JV/E235 - PSS'},
          {idx:233,name:'JV/E236 - PSS'},
          {idx:234,name:'JV/F201 - PSS'},
          {idx:235,name:'JV/F202 - PSS'},
          {idx:236,name:'JV/F203 - PSS'},
          {idx:237,name:'JV/F204 - PSS'},
          {idx:238,name:'JV/F205 - PSS'},
          {idx:239,name:'JV/F206 - PSS'},
          {idx:240,name:'JV/F207 - PSS'},
          {idx:241,name:'JV/F208 - PSS'},
          {idx:242,name:'JV/F209 - PSS'},
          {idx:243,name:'JV/F210 - PSS'},
          {idx:244,name:'JV/F211 - PSS'},
          {idx:245,name:'JV/F212 - PSS'},
          {idx:246,name:'JV/F213 - PSS'},
          {idx:247,name:'JV/F214 - PSS'},
          {idx:248,name:'JV/F215 - PSS'},
          {idx:249,name:'JV/F216 - PSS'},
          {idx:250,name:'JV/F217 - PSS'},
          {idx:251,name:'JV/F218 - PSS'},
          {idx:252,name:'JV/F219 - PSS'},
          {idx:253,name:'JV/F220 - PSS'},
          {idx:254,name:'JV/F221 - PSS'},
          {idx:255,name:'JV/F222 - PSS'},
          {idx:256,name:'JV/F223 - PSS'},
          {idx:257,name:'JV/F224 - PSS'},
          {idx:258,name:'JV/F225 - PSS'},
          {idx:259,name:'JV/F226 - PSS'},
          {idx:260,name:'JV/F227 - PSS'},
          {idx:261,name:'JV/F228 - PSS'},
          {idx:262,name:'JV/F229 - PSS'},
          {idx:263,name:'JV/F230 - PSS'},
          {idx:264,name:'JV/F231 - PSS'},
          {idx:265,name:'JV/F232 - PSS'},
          {idx:266,name:'JV/F233 - PSS'},
          {idx:267,name:'JV/F234 - PSS'},
          {idx:268,name:'JV/F235 - PSS'},
          {idx:269,name:'JV/F236 - PSS'},
          {idx:270,name:'JV/G201 - PSS'},
          {idx:271,name:'JV/G202 - PSS'},
          {idx:272,name:'JV/G203 - PSS'},
          {idx:273,name:'JV/G204 - PSS'},
          {idx:274,name:'JV/G205 - PSS'},
          {idx:275,name:'JV/G206 - PSS'},
          {idx:276,name:'JV/G207 - PSS'},
          {idx:277,name:'JV/G208 - PSS'},
          {idx:278,name:'JV/G209 - PSS'},
          {idx:279,name:'JV/G210 - PSS'},
          {idx:280,name:'JV/G211 - PSS'},
          {idx:281,name:'JV/G212 - PSS'},
          {idx:282,name:'JV/G213 - PSS'},
          {idx:283,name:'JV/G214 - PSS'},
          {idx:284,name:'JV/G215 - PSS'},
          {idx:285,name:'JV/G216 - PSS'},
          {idx:286,name:'JV/G217 - PSS'},
          {idx:287,name:'JV/G218 - PSS'},
          {idx:288,name:'JV/G219 - PSS'},
          {idx:289,name:'JV/G220 - PSS'},
          {idx:290,name:'JV/G221 - PSS'},
          {idx:291,name:'JV/G222 - PSS'},
          {idx:292,name:'JV/G223 - PSS'},
          {idx:293,name:'JV/G224 - PSS'},
          {idx:294,name:'JV/G225 - PSS'},
          {idx:295,name:'JV/G226 - PSS'},
          {idx:296,name:'JV/G227 - PSS'},
          {idx:297,name:'JV/G228 - PSS'},
          {idx:298,name:'JV/G229 - PSS'},
          {idx:299,name:'JV/G230 - PSS'},
          {idx:300,name:'JV/G231 - PSS'},
          {idx:301,name:'JV/G232 - PSS'},
          {idx:302,name:'JV/G233 - PSS'},
          {idx:303,name:'JV/G234 - PSS'},
          {idx:304,name:'JV/G235 - PSS'},
          {idx:305,name:'JV/G236 - PSS'},
          {idx:306,name:'JV/G237 - PSS'},
          {idx:307,name:'JV/G238 - PSS'},
          {idx:308,name:'JV/G239 - PSS'},
          {idx:309,name:'JV/G240 - PSS'},
          {idx:310,name:'JV/G331 - PSS'},
          {idx:311,name:'JV/G332 - PSS'},
          {idx:312,name:'JV/H201 - PSS'},
          {idx:313,name:'JV/H202 - PSS'},
          {idx:314,name:'JV/H203 - PSS'},
          {idx:315,name:'JV/H204 - PSS'},
          {idx:316,name:'JV/H205 - PSS'},
          {idx:317,name:'JV/H206 - PSS'},
          {idx:318,name:'JV/H207 - PSS'},
          {idx:319,name:'JV/H208 - PSS'},
          {idx:320,name:'JV/H209 - PSS'},
          {idx:321,name:'JV/H210 - PSS'},
          {idx:322,name:'JV/H211 - PSS'},
          {idx:323,name:'JV/H212 - PSS'},
          {idx:324,name:'JV/H213 - PSS'},
          {idx:325,name:'JV/H214 - PSS'},
          {idx:326,name:'JV/H215 - PSS'},
          {idx:327,name:'JV/H216 - PSS'},
          {idx:328,name:'JV/H217 - PSS'},
          {idx:329,name:'JV/H218 - PSS'},
          {idx:330,name:'JV/H219 - PSS'},
          {idx:331,name:'JV/H220 - PSS'},
          {idx:332,name:'JV/I201 - PSS'},
          {idx:333,name:'JV/I202 - PSS'},
          {idx:334,name:'JV/I203 - PSS'},
          {idx:335,name:'JV/I204 - PSS'},
          {idx:336,name:'JV/I205 - PSS'},
          {idx:337,name:'JV/I206 - PSS'},
          {idx:338,name:'JV/I207 - PSS'},
          {idx:339,name:'JV/I208 - PSS'},
          {idx:340,name:'JV/I209 - PSS'},
          {idx:341,name:'JV/I210 - PSS'},
          {idx:342,name:'JV/I211 - PSS'},
          {idx:343,name:'JV/I212 - PSS'},
          {idx:344,name:'JV/I213 - PSS'},
          {idx:345,name:'JV/I214 - PSS'},
          {idx:346,name:'JV/I215 - PSS'},
          {idx:347,name:'JV/I216 - PSS'},
          {idx:348,name:'JV/I217 - PSS'},
          {idx:349,name:'JV/I218 - PSS'},
          {idx:350,name:'JV/I219 - PSS'},
          {idx:351,name:'JV/J201 - PSS'},
          {idx:352,name:'JV/J202 - PSS'},
          {idx:353,name:'JV/J203 - PSS'},
          {idx:354,name:'JV/J204 - PSS'},
          {idx:355,name:'JV/J205 - PSS'},
          {idx:356,name:'JV/J206 - PSS'},
          {idx:357,name:'JV/J207 - PSS'},
          {idx:358,name:'JV/J208 - PSS'},
          {idx:359,name:'JV/J209 - PSS'},
          {idx:360,name:'JV/J210 - PSS'},
          {idx:361,name:'JV/J211 - PSS'},
          {idx:362,name:'JV/J212 - PSS'},
          {idx:363,name:'JV/J213 - PSS'},
          {idx:364,name:'JV/J214 - PSS'},
          {idx:365,name:'JV/J215 - PSS'},
          {idx:366,name:'JV/J216 - PSS'},
          {idx:367,name:'JV/J217 - PSS'},
          {idx:368,name:'JV/J218 - PSS'},
          {idx:369,name:'JV/J219 - PSS'},
          {idx:370,name:'JV/K201 - PSS'},
          {idx:371,name:'JV/K202 - PSS'},
          {idx:372,name:'JV/K203 - PSS'},
          {idx:373,name:'JV/K204 - PSS'},
          {idx:374,name:'JV/K205 - PSS'},
          {idx:375,name:'JV/K206 - PSS'},
          {idx:376,name:'JV/K207 - PSS'},
          {idx:377,name:'JV/K208 - PSS'},
          {idx:378,name:'JV/K209 - PSS'},
          {idx:379,name:'JV/K210 - PSS'},
          {idx:380,name:'JV/K211 - PSS'},
          {idx:381,name:'JV/K212 - PSS'},
          {idx:382,name:'JV/K213 - PSS'},
          {idx:383,name:'JV/K214 - PSS'},
          {idx:384,name:'JV/K215 - PSS'},
          {idx:385,name:'JV/K216 - PSS'},
          {idx:386,name:'JV/K217 - PSS'},
          {idx:387,name:'JV/L201 - PSS'},
          {idx:388,name:'JV/L202 - PSS'},
          {idx:389,name:'JV/L203 - PSS'},
          {idx:390,name:'JV/L204 - PSS'},
          {idx:391,name:'JV/L205 - PSS'},
          {idx:392,name:'JV/L206 - PSS'},
          {idx:393,name:'JV/L207 - PSS'},
          {idx:394,name:'JV/L208 - PSS'},
          {idx:395,name:'JV/L209 - PSS'},
          {idx:396,name:'JV/L210 - PSS'},
          {idx:397,name:'JV/L211 - PSS'},
          {idx:398,name:'JV/L212 - PSS'},
          {idx:399,name:'JV/L213 - PSS'},
          {idx:400,name:'JV/L214 - PSS'},
          {idx:401,name:'JV/L215 - PSS'},
          {idx:402,name:'JV/L216 - PSS'},
          {idx:403,name:'JV/L217 - PSS'},
          {idx:404,name:'JV/LR101 - PSS'},
          {idx:405,name:'JV/LR102 - PSS'},
          {idx:406,name:'JV/LR103 - PSS'},
          {idx:407,name:'JV/LR104 - PSS'},
          {idx:408,name:'JV/LR105 - PSS'},
          {idx:409,name:'JV/LR106 - PSS'},
          {idx:410,name:'JV/LR107 - PSS'},
          {idx:411,name:'JV/LR108 - PSS'},
          {idx:412,name:'JV/LR109 - PSS'},
          {idx:413,name:'JV/LR110 - PSS'},
          {idx:414,name:'JV/LR111 - PSS'},
          {idx:415,name:'JV/LR112 - PSS'},
          {idx:416,name:'JV/LR113 - PSS'},
          {idx:417,name:'JV/LR114 - PSS'},
          {idx:418,name:'JV/LR115 - PSS'},
          {idx:419,name:'JV/LR116 - PSS'},
          {idx:420,name:'JV/LR117 - PSS'},
          {idx:421,name:'JV/LR118 - PSS'},
          {idx:422,name:'JV/LR119 - PSS'},
          {idx:423,name:'JV/LR120 - PSS'},
          {idx:424,name:'JV/LR121 - PSS'},
          {idx:425,name:'JV/LR122 - PSS'},
          {idx:426,name:'JV/LR123 - PSS'},
          {idx:427,name:'JV/LR124 - PSS'},
          {idx:428,name:'JV/LR125 - PSS'},
          {idx:429,name:'JV/LR126 - PSS'},
          {idx:430,name:'JV/LR127 - PSS'},
          {idx:431,name:'JV/M201 - PSS'},
          {idx:432,name:'JV/M202 - PSS'},
          {idx:433,name:'JV/M203 - PSS'},
          {idx:434,name:'JV/M204 - PSS'},
          {idx:435,name:'JV/M205 - PSS'},
          {idx:436,name:'JV/M206 - PSS'},
          {idx:437,name:'JV/M207 - PSS'},
          {idx:438,name:'JV/M208 - PSS'},
          {idx:439,name:'JV/M209 - PSS'},
          {idx:440,name:'JV/M210 - PSS'},
          {idx:441,name:'JV/M211 - PSS'},
          {idx:442,name:'JV/M212 - PSS'},
          {idx:443,name:'JV/M213 - PSS'},
          {idx:444,name:'JV/M214 - PSS'},
          {idx:445,name:'JV/M215 - PSS'},
          {idx:446,name:'JV/M216 - PSS'},
          {idx:447,name:'JV/M217 - PSS'},
          {idx:448,name:'JV/M218 - PSS'},
          {idx:449,name:'JV/N201 - PSS'},
          {idx:450,name:'JV/N202 - PSS'},
          {idx:451,name:'JV/N203 - PSS'},
          {idx:452,name:'JV/N204 - PSS'},
          {idx:453,name:'JV/N205 - PSS'},
          {idx:454,name:'JV/N206 - PSS'},
          {idx:455,name:'JV/N207 - PSS'},
          {idx:456,name:'JV/N208 - PSS'},
          {idx:457,name:'JV/N209 - PSS'},
          {idx:458,name:'JV/N210 - PSS'},
          {idx:459,name:'JV/N211 - PSS'},
          {idx:460,name:'JV/N212 - PSS'},
          {idx:461,name:'JV/N213 - PSS'},
          {idx:462,name:'JV/N214 - PSS'},
          {idx:463,name:'JV/N215 - PSS'},
          {idx:464,name:'JV/N216 - PSS'},
          {idx:465,name:'JV/N217 - PSS'},
          {idx:466,name:'JV/N218 - PSS'},
          {idx:467,name:'JV/RFD - PSS'},
          {idx:468,name:'JV/RFD01 - PSS'},
          {idx:469,name:'JV/RFD02 - PSS'},
          {idx:470,name:'JV/RFD03 - PSS'},
          {idx:471,name:'JV/RFD04 - PSS'},
          {idx:472,name:'JV/RFD05 - PSS'},
          {idx:473,name:'JV/RFD06 - PSS'}

           ];
           return this.warehouses;
          }
          else if(user_name == 'mareeshwaran' ){
           this.warehouses = [{idx: 4243, name: 'PT/SASTRI/A201 - PSS'},
            {idx: 4244, name: 'PT/SASTRI/A202 - PSS'},
            {idx: 4245, name: 'PT/SASTRI/B201 - PSS'},
            {idx: 4246, name: 'PT/SASTRI/B202 - PSS'},
            {idx: 4247, name: 'PT/SASTRI/B203 - PSS'},
            {idx: 4248, name: 'PT/SASTRI/B204 - PSS'},
            {idx: 4249, name: 'PT/SASTRI/B205 - PSS'},
            {idx: 4250, name: 'PT/SASTRI/C201 - PSS'},
            {idx: 4251, name: 'PT/SASTRI/C202 - PSS'},
            {idx: 4252, name: 'PT/SASTRI/C203 - PSS'},
            {idx: 4253, name: 'PT/SASTRI/D201 - PSS'},
            {idx: 4254, name: 'PT/SASTRI/D202 - PSS'},
            {idx: 4255, name: 'PT/SASTRI/D203 - PSS'},
            {idx: 4256, name: 'PT/SASTRI/D204 - PSS'},
            {idx: 4257, name: 'PT/SASTRI/D205 - PSS'},
            {idx: 4258, name: 'PT/SASTRI/E201 - PSS'},
            {idx: 4259, name: 'PT/SASTRI/E202 - PSS'},
            {idx: 4260, name: 'PT/SASTRI/E203 - PSS'},
            {idx: 4261, name: 'PT/SASTRI/E204 - PSS'},
            {idx: 4262, name: 'PT/SASTRI/E205 - PSS'},
            {idx: 4263, name: 'PT/SASTRI/E206 - PSS'},
            {idx: 4264, name: 'PT/SASTRI/E207 - PSS'},
            {idx: 1814, name: 'PT/SASTRI/F1 - PSS'},
            {idx: 4203, name: 'PT/SASTRI/F1 TEMP - PSS'},
            {idx: 1815, name: 'PT/SASTRI/F10 - PSS'},
            {idx: 1816, name: 'PT/SASTRI/F11 - PSS'},
            {idx: 1817, name: 'PT/SASTRI/F12 - PSS'},
            {idx: 1818, name: 'PT/SASTRI/F13 - PSS'},
            {idx: 1819, name: 'PT/SASTRI/F14 - PSS'},
            {idx: 1820, name: 'PT/SASTRI/F15 - PSS'},
            {idx: 1821, name: 'PT/SASTRI/F16 - PSS'},
            {idx: 1822, name: 'PT/SASTRI/F17 - PSS'},
            {idx: 1823, name: 'PT/SASTRI/F18 - PSS'},
            {idx: 1824, name: 'PT/SASTRI/F19 - PSS'},
            {idx: 1825, name: 'PT/SASTRI/F2 - PSS'},
            {idx: 4204, name: 'PT/SASTRI/F2 TEMP - PSS'},
            {idx: 1826, name: 'PT/SASTRI/F20 - PSS'},
            {idx: 4265, name: 'PT/SASTRI/F201 - PSS'},
            {idx: 4266, name: 'PT/SASTRI/F202 - PSS'},
            {idx: 4267, name: 'PT/SASTRI/F203 - PSS'},
            {idx: 1827, name: 'PT/SASTRI/F21 - PSS'},
            {idx: 1828, name: 'PT/SASTRI/F22 - PSS'},
            {idx: 1829, name: 'PT/SASTRI/F23 - PSS'},
            {idx: 1830, name: 'PT/SASTRI/F24 - PSS'},
            {idx: 1831, name: 'PT/SASTRI/F25 - PSS'},
            {idx: 1832, name: 'PT/SASTRI/F26 - PSS'},
            {idx: 1833, name: 'PT/SASTRI/F27 - PSS'},
            {idx: 1834, name: 'PT/SASTRI/F28 - PSS'},
            {idx: 1835, name: 'PT/SASTRI/F29 - PSS'},
            {idx: 1836, name: 'PT/SASTRI/F3 - PSS'},
            {idx: 4205, name: 'PT/SASTRI/F3 TEMP - PSS'},
            {idx: 1837, name: 'PT/SASTRI/F30 - PSS'},
            {idx: 1838, name: 'PT/SASTRI/F31 - PSS'},
            {idx: 1839, name: 'PT/SASTRI/F32 - PSS'},
            {idx: 1840, name: 'PT/SASTRI/F33 - PSS'},
            {idx: 1841, name: 'PT/SASTRI/F34 - PSS'},
            {idx: 1842, name: 'PT/SASTRI/F35 - PSS'},
            {idx: 1843, name: 'PT/SASTRI/F36 - PSS'},
            {idx: 1844, name: 'PT/SASTRI/F37 - PSS'},
            {idx: 1845, name: 'PT/SASTRI/F38 - PSS'},
            {idx: 1846, name: 'PT/SASTRI/F39 - PSS'},
            {idx: 1847, name: 'PT/SASTRI/F4 - PSS'},
            {idx: 1848, name: 'PT/SASTRI/F40 - PSS'},
            {idx: 1849, name: 'PT/SASTRI/F41 - PSS'},
            {idx: 1850, name: 'PT/SASTRI/F42 - PSS'},
            {idx: 1851, name: 'PT/SASTRI/F43 - PSS'},
            {idx: 1852, name: 'PT/SASTRI/F44 - PSS'},
            {idx: 1853, name: 'PT/SASTRI/F45 - PSS'},
            {idx: 1854, name: 'PT/SASTRI/F5 - PSS'},
            {idx: 1855, name: 'PT/SASTRI/F6 - PSS'},
            {idx: 1856, name: 'PT/SASTRI/F7 - PSS'},
            {idx: 1857, name: 'PT/SASTRI/F8 - PSS'},
            {idx: 1858, name: 'PT/SASTRI/F9 - PSS'},
            {idx: 1859, name: 'PT/SASTRI/G1 - PSS'},
            {idx: 1860, name: 'PT/SASTRI/G10 - PSS'},
            {idx: 1861, name: 'PT/SASTRI/G11 - PSS'},
            {idx: 1862, name: 'PT/SASTRI/G12 - PSS'},
            {idx: 1863, name: 'PT/SASTRI/G13 - PSS'},
            {idx: 1864, name: 'PT/SASTRI/G14 - PSS'},
            {idx: 1865, name: 'PT/SASTRI/G15 - PSS'},
            {idx: 1866, name: 'PT/SASTRI/G16 - PSS'},
            {idx: 1867, name: 'PT/SASTRI/G17 - PSS'},
            {idx: 1868, name: 'PT/SASTRI/G18 - PSS'},
            {idx: 1869, name: 'PT/SASTRI/G19 - PSS'},
            {idx: 1890, name: 'PT/SASTRI/G2 - PSS'},
            {idx: 1870, name: 'PT/SASTRI/G20 - PSS'},
            {idx: 4268, name: 'PT/SASTRI/G201 - PSS'},
            {idx: 4269, name: 'PT/SASTRI/G202 - PSS'},
            {idx: 4270, name: 'PT/SASTRI/G203 - PSS'},
            {idx: 4271, name: 'PT/SASTRI/G204 - PSS'},
            {idx: 1871, name: 'PT/SASTRI/G3 - PSS'},
            {idx: 1872, name: 'PT/SASTRI/G4 - PSS'},
            {idx: 1873, name: 'PT/SASTRI/G5 - PSS'},
            {idx: 1874, name: 'PT/SASTRI/G6 - PSS'},
            {idx: 1875, name: 'PT/SASTRI/G7 - PSS'},
            {idx: 1876, name: 'PT/SASTRI/G8 - PSS'},
            {idx: 1877, name: 'PT/SASTRI/G9 - PSS'},
            {idx: 1878, name: 'PT/SASTRI/GROUND LOFT/01 - PSS'},
            {idx: 1879, name: 'PT/SASTRI/GROUND LOFT/02 - PSS'},
            {idx: 1880, name: 'PT/SASTRI/GROUND LOFT/03 - PSS'},
            {idx: 1881, name: 'PT/SASTRI/GROUND LOFT/04 - PSS'},
            {idx: 1882, name: 'PT/SASTRI/GROUND LOFT/05 - PSS'},
            {idx: 1891, name: 'PT/SASTRI/OUT1 - PSS'},
            {idx: 1883, name: 'PT/SASTRI/R1 - PSS'},
            {idx: 1884, name: 'PT/SASTRI/R2 - PSS'},
            {idx: 1885, name: 'PT/SASTRI/R3 - PSS'},
            {idx: 1886, name: 'PT/SASTRI/R4 - PSS'},
            {idx: 1887, name: 'PT/SASTRI/R5 - PSS'},
            {idx: 1888, name: 'PT/SASTRI/R6 - PSS'},
            {idx: 1889, name: 'PT/SASTRI/R7 - PSS'},
            {idx: 2529, name: 'PT/SASTRI/RFB - PSS'}];
           return this.warehouses;
          }
          else{
          this.warehouses = this.jbody2;
          return this.warehouses;
          }
        } else {
          this.isShown = false;
          this.showStockasZero();
        }
      } else {
        this.isShown = false;
        console.log("inside err jbody", this.jbody2);
      }
    });
  }


   favoriteStock(jbody) {
    console.log("favoriteStockjbody", jbody);
    console.log("favoriteStockjbody", jbody.isfavorites);
    this.defaultwarehouse = localStorage.getItem("TARGETWAREHOUSE");
    console.log("this.defaultTargetWarehouse", this.defaultwarehouse);
    if (this.defaultwarehouse == null || this.defaultwarehouse == undefined) {
      this.selectTargetWarehouse();
    } else {

      this.favoriteService.getAllFavoriteStock().then((result) => {
      console.log("result01 2", result);
      this.stockIdWarehouse = jbody.warehouse;
      console.log("jbody",jbody);
      console.log("this.stockIdWarehouse",this.stockIdWarehouse);
      this.stockIdBatchNo = jbody.batch_no;
      this.favstocks = result;
        console.log("favstocks", this.favstocks);
        if (this.favstocks != null) {
        console.log(" not equal null");
        console.log("this.favstocks.length",this.favstocks.length);
        if(this.favstocks.length == 0){
         console.log("null 1");
            this.setBatchDetail(jbody);
            this.favoriteService.favoriteStock(jbody).then(() => {
            this.jbody.isfavorites = true;
            this.jbody.change_batch_status = jbody.batch_status;
            this.jbody.qty = jbody.actualqty;
            });
            //this.openModal();

        }else{
        for (let i = 0; i < this.favstocks.length; i++) {
          console.log("this.favstocks.length",this.favstocks.length);
            if (this.favstocks[i].batch_no == this.stockIdBatchNo) {
              console.log("this.favstocks[i].batch_no",this.favstocks[i].batch_no);
              for (let j = 0; j < this.favstocks.length; j++) {
              console.log("this.favstocks[j].batch_no",this.favstocks[j].batch_no);
              console.log("this.favstocks[j].warehouse",this.favstocks[j].warehouse);
              console.log("this.stockIdWarehouse",this.stockIdWarehouse);
              console.log("this.stockIdBatchNo",this.stockIdBatchNo);
                if (
                  this.favstocks[j].warehouse == this.stockIdWarehouse 
                  && this.favstocks[j].batch_no == this.stockIdBatchNo
                ) {
                  console.log("before null 2");
                  this.showStockasAdded();
                  return;
                }
                else{
                console.log("need to add as new stock");
                console.log("null 2");
                this.setBatchDetail(jbody);
                this.favoriteService.favoriteStock(jbody).then(() => {
                this.jbody.isfavorites = true;
                this.jbody.change_batch_status = jbody.batch_status;
                this.jbody.qty = jbody.actualqty;
                });
                //this.openModal();
                } 
              }
            }
            else{
            console.log("null 3");
            this.setBatchDetail(jbody);
            this.favoriteService.favoriteStock(jbody).then(() => {
            this.jbody.isfavorites = true;
            this.jbody.change_batch_status = jbody.batch_status;
            this.jbody.qty = jbody.actualqty;
            });
            //this.openModal();

            }
          }

        }
          
        }
        else{
          console.log("null 4");
          this.setBatchDetail(jbody);
          this.favoriteService.favoriteStock(jbody).then(() => {
          this.jbody.isfavorites = true;
          this.jbody.change_batch_status = jbody.batch_status;
          this.jbody.qty = jbody.actualqty;
          });
          //this.openModal();
        }
      });
    }
  }


  favoriteStocks(jbody) {
    this.setBatchDetail(jbody);
    //console.log("favoriteStockjbody", jbody);
    //console.log("favoriteStockjbody", jbody.isfavorites);
    this.defaultwarehouse = localStorage.getItem("TARGETWAREHOUSE");
    //console.log("this.defaultTargetWarehouse", this.defaultwarehouse);
    if (this.defaultwarehouse == null || this.defaultwarehouse == undefined) {
      this.selectTargetWarehouse();
    } else {

      this.favoriteService.getAllFavoriteStock().then((result) => {
      console.log("result01 3", result);
      this.stockIdWarehouse = jbody.warehouse;
      //console.log("jbody",jbody);
      //console.log("this.stockIdWarehouse",this.stockIdWarehouse);
      this.stockIdBatchNo = jbody.batch_no;
      this.favstocks = result;
      //console.log("favstocks", this.favstocks);
      console.log("result01 3 1", result);
      
      return this.favstocks;
     
      }).then((resultfavstocks) => {
      //console.log("resultfavstocks",resultfavstocks);
      this.resultoffavstocks = resultfavstocks;
      this.favstocksLength = resultfavstocks.length;
      console.log("favstocksLength", this.favstocksLength);
       //console.log(this.favstocksLength);
       if(this.favstocksLength == 0){
         console.log("null 1");
            //this.setBatchDetail(jbody);
            this.favoriteService.favoriteStock(jbody);
            //this.openModal();

        }else{
          //console.log("this.favstocksLength != 0");
          this.stockIdBatchNo = localStorage.getItem("BATCH");
          
          this.batchNoArray.push(this.stockIdBatchNo);
          //console.log("this.batchNoArray",this.batchNoArray);
          //console.log("this.resultoffavstocks",this.resultoffavstocks);
          

          let classKeys = this.batchNoArray;
          let classesInList = this.resultoffavstocks;

          this.batchfilteredClasses = classesInList.filter(cls => classKeys.includes(cls.batch_no));
          console.log(this.batchfilteredClasses.length);

          if(this.batchfilteredClasses.length > 0){
          this.stockIdWarehouse = localStorage.getItem("SOURCEWAREHOUSE");
          this.warehouseArray.push(this.stockIdWarehouse);

          let wclassKeys = this.warehouseArray;
          let wclassesInList = this.batchfilteredClasses;
          this.warehousefilteredClasses = wclassesInList.filter(cls => wclassKeys.includes(cls.warehouse));
          console.log(this.warehousefilteredClasses.length);
          if(this.warehousefilteredClasses.length > 0){
                  this.showStockasAdded();
                  var stockPresent = "YES";
                  return stockPresent;
          }else{
                console.log("undefined 1");
                var stockPresent = "NO";
                return stockPresent;

          }
                  

          }
          else{
                  console.log("undefined 2");
                  var stockPresent = "NO";
                  return stockPresent;

          }

        }
       
     }).then((stockPresent) => {
      console.log("stockPresent",stockPresent);
      console.log("undefined 3");
      this.stockpresent = stockPresent;
      if(this.stockpresent === undefined || this.stockpresent == "NO"){
          this.favoriteService.favoriteStock(jbody);
          //this.openModal();
      }else{
       return;
      }
      
     });
    }
  }


  favoriteStockss(jbody, i) {
    this.setBatchDetail(jbody);
    //console.log("favoriteStockjbody", jbody);
    //console.log("favoriteStockjbody", jbody.isfavorites);
    this.defaultwarehouse = localStorage.getItem("TARGETWAREHOUSE");
    //console.log("this.defaultTargetWarehouse", this.defaultwarehouse);
    if (this.defaultwarehouse == null || this.defaultwarehouse == undefined) {
      this.selectTargetWarehouse();
    } else {

      this.favoriteService.getAllFavoriteStock().then((result) => {
      console.log("result01 3", result);
      this.stockIdWarehouse = jbody.warehouse;
      this.stockIdBatchNo = jbody.batch_no;
      this.favstocks = result;
      console.log("result01 3 1", result);
      this.resultoffavstocks = this.favstocks;
      if(this.favstocks == null){
        console.log("yes undefined");
        this.favoriteService.favoriteStock(jbody);
        this.openModal(jbody, i);
      }else{
       this.favstocksLength = this.favstocks.length;
       return this.favstocksLength;
      }   
      
     
      }).then((resultfavstocks) => {
    
       if(this.favstocksLength == 0){
         console.log("null 1");
            //this.setBatchDetail(jbody);
            this.favoriteService.favoriteStock(jbody);
            this.openModal(jbody, i);

        }else{
          //console.log("this.favstocksLength != 0");
          this.stockIdBatchNo = localStorage.getItem("BATCH");
          
          this.batchNoArray.push(this.stockIdBatchNo);
          //console.log("this.batchNoArray",this.batchNoArray);
          //console.log("this.resultoffavstocks",this.resultoffavstocks);
          

          let classKeys = this.batchNoArray;
          let classesInList = this.resultoffavstocks;

          this.batchfilteredClasses = classesInList.filter(cls => classKeys.includes(cls.batch_no));
          console.log(this.batchfilteredClasses.length);

          if(this.batchfilteredClasses.length > 0){
          this.stockIdWarehouse = localStorage.getItem("SOURCEWAREHOUSE");
          console.log("this.stockIdWarehouse",this.stockIdWarehouse);
          console.log(" before this.warehouseArray",this.warehouseArray);
          this.warehouseArray = [];
          console.log(" after this.warehouseArray",this.warehouseArray);
          this.warehouseArray.push(this.stockIdWarehouse);

          let wclassKeys = this.warehouseArray;
          let wclassesInList = this.batchfilteredClasses;
          this.warehousefilteredClasses = wclassesInList.filter(cls => wclassKeys.includes(cls.warehouse));
          console.log(this.warehousefilteredClasses.length);
          if(this.warehousefilteredClasses.length > 0){
                  this.showStockasAdded();
                  var stockPresent = "YES";
                  return stockPresent;
          }else{
                console.log("undefined 1");
                var stockPresent = "NO";
                return stockPresent;

          }
                  

          }
          else{
                  console.log("undefined 2");
                  var stockPresent = "NO";
                  return stockPresent;

          }

        }
       
     }).then((stockPresent) => {
      console.log("stockPresent",stockPresent);
      console.log("undefined 3");
      this.stockpresent = stockPresent;
      if(this.stockpresent === undefined || this.stockpresent == "NO"){
          this.favoriteService.favoriteStock(jbody);
          this.openModal(jbody, i);
      }else{
       return;
      }
      
     });
    }
  }


  ngOnInit() {
    this.isShown = true;
    //this.getStorageItem();
    //this.getWarehouses();
    //this.getAllBatchStock();

    this.warehouses = this.getWarehouses();
    //console.log("this.warehouses",this.warehouses);

    this.targetWarehouse = localStorage.getItem("TARGETWAREHOUSE");
    //this.warehouse = localStorage.getItem('TARGETWAREHOUSE');
    console.log("this.targetWarehouse", this.targetWarehouse);
    if (this.targetWarehouse == null || this.targetWarehouse == undefined) {
      this.showSetTargetWarehouse = true;
      this.showSelectedTargetWarehouse = false;
    } else {
      this.showSetTargetWarehouse = false;
      this.showSelectedTargetWarehouse = true;
    }
  }
}
