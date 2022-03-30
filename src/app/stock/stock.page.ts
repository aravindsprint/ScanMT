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

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: ModalComponent,
      componentProps: { propsType: "modal" },
      cssClass: "modal",
    });
    return await modal.present();
  }

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
          this.warehouses = this.jbody2;
          return this.warehouses;
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
            this.openModal();

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
                this.openModal();
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
            this.openModal();

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
          this.openModal();
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
            this.openModal();

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
          this.openModal();
      }else{
       return;
      }
      
     });
    }
  }


  favoriteStockss(jbody) {
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
        this.openModal();
      }else{
       this.favstocksLength = this.favstocks.length;
       return this.favstocksLength;
      }   
      
     
      }).then((resultfavstocks) => {
    
       if(this.favstocksLength == 0){
         console.log("null 1");
            //this.setBatchDetail(jbody);
            this.favoriteService.favoriteStock(jbody);
            this.openModal();

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
          this.openModal();
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
