import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Platform, NavController, } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { StorageService } from '../services/storage.service';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Location } from "@angular/common";


@Component({
  selector: 'app-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
})
export class ItemPage implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
  private authService: AuthService,
  private router: Router,
  private location: Location,
  private alertService: AlertService,
  private storage: StorageService,
  private navCtrl: NavController,) { }

  jbody1 = [];
  searchText;
  rows;
  response;
  comm_name;
  colorName;
  color_name;
  id;
  jbodylen;
  items = [];
  isShown = true;

  myBackButton(){
  this.location.back();
  }
  myRefreshButton(){
  this.ngOnInit();
  }


  setItemDetail(item) {
  console.log("storage item",item);
  localStorage.removeItem('SITEM');
  localStorage.removeItem('SCOLOR');
  localStorage.removeItem('SCOMM');
  localStorage.setItem('SITEM', item.item_code);
  localStorage.setItem('SCOLOR', item.color);
  localStorage.setItem('SCOMM', item.commercial_name);
  }

  getAllItem(): void {
  console.log("1");
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    const commName = this.activatedRoute.snapshot.paramMap.get('comm_name');
    console.log("id",id);
    console.log("commName",commName);
    this.color_name = id;
    this.comm_name = commName;
    this.authService.getAllItem(id, this.comm_name)
      .subscribe(resp=>{
      console.log("resp",resp);
      this.response = resp;
      if(this.response){    
       if(this.response.message != "No Item Found"){
       //this.jbody1 = resp[0];
       this.jbody1 = this.response.message;
       this.jbodylen = this.response.message.length;
       for(let i = 0; i < this.jbody1.length; i++) {
        this.items.push(this.jbody1[i]);
        //console.log("items",this.items);
        this.items = this.items.filter( function( item, index, inputArray ) {
           return inputArray.indexOf(item) == index;
        });
        this.items.sort();
       }
       if(this.jbodylen == 0){
         this.showItemasZero();
       }
       //console.log("resp[0]",resp[0]);  
       //console.log("jbody1",this.jbody1);
       //this.spinner.hide();
       this.isShown = false;
       }
       else{
        //this.spinner.hide();
        this.isShown = false; 
        this.showItemasZero();
       }     
      }
      else {
        console.log("inside err jbody",this.jbody1);
      }
     })   
     
  }





  showItemasZero(){
      console.log("inside showItemasZero");
      this.alertService.presentToast("No Item Found !!");
  }

  getItems(ev: any) {
         // Reset items back to all of the items
         

         // set val to the value of the searchbar
         const val = ev.target.value;

         // if the value is an empty string don't filter the items
         if (val && val.trim() !== '') {
             console.log("val",val);
             //this.isItemAvailable = true;
             this.items = this.items.filter((item) => {
                return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
             })
         } else {
             //this.isItemAvailable = false;
             this.getAllItem();
         }
    }

  ngOnInit() {
  this.isShown = true;
  this.getAllItem();
  }

}
