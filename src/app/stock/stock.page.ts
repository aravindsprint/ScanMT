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
          if(user_name == 'Aravind Govindara' || user_name == 'JayaPrakash' || user_name == 'muthuveera'){
           this.warehouses = [{idx:0, name:'JV - READY FOR BILLING - PSS'}, 
           {idx:1, name:'JV/RFD - PSS'},{idx:2, name:'JV/CM1 - PSS'},
           {idx:3, name:'JV/CM2 - PSS'},{idx:4, name:'JV/CM3 - PSS'},
           {idx:5, name:'JV - (TEMP)READY FOR BILLING - PSS'}
           ];
           return this.warehouses;
          }else if(user_name == 'mareeshwaran' || user_name == 'Aravind Govindaraj'){
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
