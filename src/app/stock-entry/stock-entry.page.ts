import { Component, OnInit } from '@angular/core';
import { FavoriteService } from '../services/favorite.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Platform, NavController, } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { StorageService } from '../services/storage.service';
import { Location } from "@angular/common";
import { NgForm } from '@angular/forms';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-stock-entry',
  templateUrl: './stock-entry.page.html',
  styleUrls: ['./stock-entry.page.scss'],
})
export class StockEntryPage implements OnInit {

  constructor(private favoriteService: FavoriteService,
  private authService: AuthService,
  private alertService: AlertService,) { }
   stockEntry:any = [];

   targetWarehouse;
   body01;
   jbody1;
   jbodylen;
   series;
   checkSeries;
   
   
   total_a;
   total_b;
   total_c;
   total;
   jbody;
   //jbody1;
   data;
   response;


   defaultSelectedRadio = "BM/21/";
  //Get value on ionChange on IonRadioGroup
  selectedRadioGroup:any;
  //Get value on ionSelect on IonRadio item
  selectedRadioItem:any;

  radio_list = [
    {
      id: '1',
      name: 'radio_list',
      value: 'BM/21/',
      text: 'BM/21/',
      disabled: false,
      checked: true,
      color: 'primary'
    }, {
      id: '2',
      name: 'radio_list',
      value: 'MT/21/',
      text: 'MT/21/',
      disabled: false,
      checked: false,
      color: 'secondary'
    }
  ];

  radioGroupChange(event) {
    console.log("radioGroupChange",event.detail.value);
    this.selectedRadioGroup = event.detail.value;
    localStorage.setItem('SERIES', this.selectedRadioGroup);
  }

  radioFocus() {
    console.log("radioFocus");
  }
  radioSelect(event) {
    console.log("radioSelect",event.detail);
    this.selectedRadioItem = event.detail;
  }
  radioBlur() {
    console.log("radioBlur");
  }



   getFavoriteStock(){
   
   this.favoriteService.getAllFavoriteStock().then(result => {
      this.stockEntry = result;
      console.log("result",result);
      //this.convertDraftJSON(result);
      if(result === null){
      console.log("inside if",result);
      var nullPresent = "YES";
      return nullPresent;
      }else{
      console.log("inside else if",result);
      var nullPresent = "NO";
      return nullPresent;
      //this.getTotal(this.stockEntry);
      
      }
      
   }).then((nullPresent) => {
       if(nullPresent = "YES"){
        console.log("nullPresent",nullPresent);
         return;
       }else{
       console.log("nullPresent",nullPresent);
        this.getTotal(this.stockEntry);
       }
   })
   
  }

  getFavoriteStocks(){

  this.favoriteService.getAllFavoriteStocks();
   
   this.favoriteService.getAllFavoriteStocks().then(result => {
      
      console.log("result",result);
     
      
   })
   
  }


  getTotal(jbody1){
  console.log("inside getTotal",jbody1);
  this.body01 = [];
  this.body01= jbody1;
  
  this.total = 0;
  for(let j=0;j<this.body01.length;j++){ 
      // console.log("this.body01.length ",this.body01.length); 
       //console.log("this.body01[j].qty ",this.body01[j].qty); 
        //console.log("this.body01[j].qty ",typeof(this.body01[j].qty));
        this.total_c = parseFloat(this.body01[j].qty);
        //console.log("typeof this.total_c",typeof(this.total_c));
       this.total += this.total_c;
       //console.log(this.total);
  }
  return (this.total).toFixed(3); 

  }

  unfavoriteStock(jbody) {
    //console.log("unfavoriteStockjbody", jbody);
    //console.log("unfavoriteStockjbody", jbody.isfavorites);
    this.favoriteService.unfavoriteStock(jbody).then(() => {
      //this.isFavorite = false;
      //this.jbody.isfavorites = false;
      this.getFavoriteStock();
    });
  }

  draft(){

   this.checkSeries = localStorage.getItem('SERIES');
   if(this.checkSeries == null){
    console.log("null");
    this.showSelectSeries();
   }else{
   this.favoriteService.getAllFavoriteStock().then(result => {
     
   var current_timestamp = moment().format("YYYY-MM-DD HH:mm:ss");
   console.log("current_timestamp",current_timestamp);
   var postDate = moment().format("YYYY-MM-DD");
   var postTime = moment().format("HH:mm:ss");
   var series = localStorage.getItem('SERIES');

    this.data = {
                'name': '',
                'owner': '',
                'creation': current_timestamp,
                'modified': current_timestamp,
                'modified_by': '',
                'idx': 0,
                'docstatus': 0,
                'naming_series': series,
                'stock_entry_type': 'Material Transfer',
                'purpose': 'Material Transfer',
                'add_to_transit': 0,
                'company': 'Pranera Services and Solutions Pvt. Ltd.,',
                'posting_date': postDate,
                'submitted_date': postDate,
                'posting_time': postTime,
                'attention': '',
                'submitted_by': '',
                'party_dc_numer': 'None',
                'barcode_name': '',
                'set_posting_time': 1,
                'inspection_requires': 0,
                'from_bom': 0,
                'apply_putaway_rule': 0,
                'fg_completed_qty': 0,
                'use_multi_level_bom':0,
                'from_warehouse': '',
                'to_warehouse': '',
                'quantity': 0,
                'no_of_countable_units': 0,
                'countable_uom': 'Rolls',
                'value_of_goods': '0',
                'total_incoming_value': 0,
                'total_outgoing_value': 0,
                'value_difference': 0,
                'total_additional_costs': 0,
                'from_address': '',
                'project': '',
                'letterhead': 'PSS',
                'is_opening': 'No',
                'security_passed': '',
                'per_transferred': '',
                'total_amount': 0,
                'purpose_of_transport': '',
                'vehicle_number': 'None',
                'no_of_rolls': 0,
                'lot_received_date': '',
                'knitting_unit': '',
                'dyeing_unit': '',
                'finishing_unit': '',
                'is_return': 0,
                'doctype': 'Stock Entry',
                'item': [],
                'chemical_details': [],
                'additional_costs': [],
                'items': result
            }

    //console.log("this.data",this.data);
    console.log("this.data",JSON.stringify(this.data)); 
    var jsonData = JSON.stringify(this.data)
    //return jsonData;

    this.authService.postData(jsonData)
      .subscribe(resp=>{
      console.log("resp",resp);
      this.response = resp;
      if(this.response){    
       if(this.response.statusCode == 200){
       var jsonSuccess = JSON.parse(this.response.body);
       console.log("",jsonSuccess.data.name);
       var id = jsonSuccess.data.name;
       this.showDraftDocNo(id);
       this.favoriteService.removeAllFavoriteStocks();
       localStorage.removeItem('SERIES');
       }
       else{
        console.log("inside err jbody",this.jbody1);
       }     
      }
      else {
        console.log("inside err jbody",this.jbody1);
      }
     })  
      
   })

   }
   

  }

  showSelectSeries() {
    this.alertService.presentToast("Select Naming series");
  }

  showDraftDocNo(id) {
    this.alertService.presentToast("Your Doc no "+ id +" is in Draft");
  }

  showSubmitDocNo(id) {
    this.alertService.presentToast("Your Doc no "+ id +" is Submitted");
  }
  
  submit(){

  this.checkSeries = localStorage.getItem('SERIES');
   if(this.checkSeries == null){
    console.log("null");
    this.showSelectSeries();
   }else{
   this.favoriteService.getAllFavoriteStocks().then(result => {
     
   var current_timestamp = moment().format("YYYY-MM-DD HH:mm:ss");
   console.log("current_timestamp",current_timestamp);
   var postDate = moment().format("YYYY-MM-DD");
   var postTime = moment().format("HH:mm:ss");
   var series = localStorage.getItem('SERIES');
    this.data = {
                'name': '',
                'owner': '',
                'creation': current_timestamp,
                'modified': current_timestamp,
                'modified_by': '',
                'idx': 0,
                'docstatus': 1,
                'naming_series': series,
                'stock_entry_type': 'Material Transfer',
                'purpose': 'Material Transfer',
                'add_to_transit': 0,
                'company': 'Pranera Services and Solutions Pvt. Ltd.,',
                'posting_date': postDate,
                'submitted_date': postDate,
                'posting_time': postTime,
                'attention': '',
                'submitted_by': '',
                'party_dc_numer': 'None',
                'barcode_name': '',
                'set_posting_time': 1,
                'inspection_requires': 0,
                'from_bom': 0,
                'apply_putaway_rule': 0,
                'fg_completed_qty': 0,
                'use_multi_level_bom':0,
                'from_warehouse': '',
                'to_warehouse': '',
                'quantity': 0,
                'no_of_countable_units': 0,
                'countable_uom': 'Rolls',
                'value_of_goods': '0',
                'total_incoming_value': 0,
                'total_outgoing_value': 0,
                'value_difference': 0,
                'total_additional_costs': 0,
                'from_address': '',
                'project': '',
                'letterhead': 'PSS',
                'is_opening': 'No',
                'security_passed': '',
                'per_transferred': '',
                'total_amount': 0,
                'purpose_of_transport': '',
                'vehicle_number': 'None',
                'no_of_rolls': 0,
                'lot_received_date': '',
                'knitting_unit': '',
                'dyeing_unit': '',
                'finishing_unit': '',
                'is_return': 0,
                'doctype': 'Stock Entry',
                'item': [],
                'chemical_details': [],
                'additional_costs': [],
                'items': result
            }

    //console.log("this.data",this.data);
    console.log("this.data",JSON.stringify(this.data)); 
    var jsonData = JSON.stringify(this.data)
    //return jsonData;

    this.authService.postData(jsonData)
      .subscribe(resp=>{
      console.log("resp",resp);
      this.response = resp;
      if(this.response){    
       if(this.response.statusCode == 200){
       var jsonSuccess = JSON.parse(this.response.body);
       console.log("",jsonSuccess.data.name);
       var id = jsonSuccess.data.name;
       this.showSubmitDocNo(id);
       this.favoriteService.removeAllFavoriteStocks();
       localStorage.removeItem('SERIES');
       }
       else{
        console.log("inside err jbody",this.jbody1);
       }     
      }
      else {
        console.log("inside err jbody",this.jbody1);
      }
     })  
      
   })

   }   
  }

  clearStockEntry() {
    console.log("clearStockEntry");
    //this.stockEntry = [];
    this.favoriteService.removeAllFavoriteStocks();
    this.favoriteService.getAllFavoriteStock();
    localStorage.removeItem('SERIES');
  }

  
  ngOnInit() {
  this.targetWarehouse = localStorage.getItem('TARGETWAREHOUSE');
  //this.getFavoriteStocks();
  this.getFavoriteStock();
  
  }

}
