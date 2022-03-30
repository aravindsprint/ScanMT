import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { FavoriteService } from '../services/favorite.service';
import { Storage } from '@ionic/storage';
import { AuthService } from 'src/app/services/auth.service';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AlertService } from 'src/app/services/alert.service';

import { NavParams } from '@ionic/angular';

const STORAGE_KEY = 'favoriteStocks';

@Injectable()

@Component({
  selector: 'app-edit-stock',
  templateUrl: './edit-stock.page.html',
  styleUrls: ['./edit-stock.page.scss'],
})
export class EditStockPage implements OnInit {

  constructor(private modalCtrl: ModalController,
  private favoriteService: FavoriteService,
  private alertService: AlertService,
  private authService: AuthService,
  private navParams: NavParams,
  public storage: Storage) { 
  
  }
  

  stock:any
  idx;
  item_code;
  s_warehouse;
  t_warehouse;
  batch;
  batch_status;
  change_batch_status;
  actualqty;
  qty;
  stock_uom;
  jbodylen;
  jbody1;
  response;
  tqty;
  aqty;
  result:any = [];
  eqty;
  stockData;


  
  BatchStatuses = ['QC PENDING', 'GRADE 2', 'GRADE 3', 'TO REPROCESS',
  'QC OK', 'REJECT', 'DIRECT', 'SCRAP', 'Hold to Sales Order'];

  getItemDetail(){
     this.idx = localStorage.getItem('IDX');
     this.item_code = localStorage.getItem('ITEMCODE');
     this.s_warehouse = localStorage.getItem('SOURCEWAREHOUSE');
     this.t_warehouse = localStorage.getItem('TARGETWAREHOUSE');
     this.batch = localStorage.getItem('BATCH');
     this.batch_status = localStorage.getItem('BATCHSTATUS');
     this.change_batch_status = localStorage.getItem('CHANGEBATCHSTATUS');
     this.actualqty = localStorage.getItem('QTY');
     this.qty = 0;
     this.stock_uom = localStorage.getItem('STOCKUOM');
    }

  
  onChange(value) {  
  console.log(value);
  localStorage.setItem('TRANSFERQTY',value);
  this.eqty = localStorage.getItem('TRANSFERQTY');
  }

  onSelectChange(value) {  
  console.log(value);
  localStorage.setItem('BATCHSTATUS',value);
  }
   
 


  update(){
     this.favoriteService.getAllFavoriteStock().then(result => {
     this.result = result;
     if(this.result == null){
      console.log("this.result equal null",this.result);
     }
     else{
      console.log("this.result",this.result);
      for(var i = 0; i < this.result.length; i++){
         var stockId = localStorage.getItem('IDX');
         console.log("stockId",stockId);
         if(stockId == result[i].idx){
         console.log("result[i].qty",result[i].qty);
         result[i].isfavorites = true;
         result[i].s_warehouse = localStorage.getItem('SOURCEWAREHOUSE');
         result[i].t_warehouse = localStorage.getItem('TARGETWAREHOUSE');
         result[i].batch_no = localStorage.getItem('BATCH');
         result[i].change_batch_status = localStorage.getItem('BATCHSTATUS');
         result[i].qty = parseFloat(localStorage.getItem('TRANSFERQTY'));
         //result[i].actual_qty = localStorage.getItem('TRANSFERQTY');
         this.tqty = parseFloat(result[i].qty);
         this.aqty = localStorage.getItem('QTY');
         console.log("this.tqty",this.tqty);
         console.log("this.aqty",this.aqty);
         
          if(this.tqty > this.aqty){
            this.showQtyError();
           }
           else{
           var batch = result[i].batch_no;
           var change_batch_status = result[i].change_batch_status;
           result[i].qty = parseFloat(localStorage.getItem('TRANSFERQTY'));
           console.log("result[i].batch_no",result[i].batch_no);
           console.log("result[i].change_batch_status",result[i].change_batch_status);
           console.log("result[i].qty",result[i].qty);
           this.storage.set(STORAGE_KEY, result);
           this.updateBatchStatus(batch, change_batch_status);
           //localStorage.setItem('TRANSFERQTY','0');
           this.modalCtrl.dismiss();
           //window.location.reload();   
           return result;
          }        
         }
        }
     }
   
     });
    }

    showQtyError(){
      this.alertService.presentToast("Don't Enter Transfer Qty More than Actual Qty!!");
    }
  
  updateBatchStatus(batch, change_batch_status){
      
      console.log("batch",batch);
      console.log("change_batch_status",change_batch_status);
     
      this.authService.updateBatchStatus(batch,change_batch_status)
      .subscribe(resp=>{
     
      this.response = resp;
      if(this.response){       
       
       if(this.response.message != "No Batch Found"){
       this.jbody1 = this.response.message;
       }
       else{
        //this.showStockasZero(); 
       }  
      }
      else { 
        //console.log("inside err jbody",this.jbody1);
      }
     })
  }

  getAllFavoriteStock() {
    var favStock = this.storage.get(STORAGE_KEY);
    console.log("favStock",favStock);
    //this.storage.remove(STORAGE_KEY);
    return this.storage.get(STORAGE_KEY);
  }

  getData(){
  this.stockData = this.navParams.get('jbody');
  this.s_warehouse = localStorage.getItem('SOURCEWAREHOUSE');
  this.t_warehouse = localStorage.getItem('TARGETWAREHOUSE');
  this.batch = localStorage.getItem('BATCH');
  }

  ngOnInit() {

   this.getData();
   //this.getItemDetail();
  }


}
