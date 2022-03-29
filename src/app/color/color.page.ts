import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Platform, NavController, } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { StorageService } from '../services/storage.service';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Location } from "@angular/common";

@Component({
  selector: 'app-color',
  templateUrl: './color.page.html',
  styleUrls: ['./color.page.scss'],
})
export class ColorPage implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
  private authService: AuthService,
  private router: Router,
  private alertService: AlertService,
  private location: Location,
  private storage: StorageService,
  private navCtrl: NavController,) { }

  id1;
  //setCommName;
  response;
  jbody1;
  commName;
  comm_name;
  items = [];
  isShown = true;

  myBackButton(){
  this.location.back();
  }
  myRefreshButton(){
  this.ngOnInit();
  }


  getAllColor(): void {
    console.log("1");
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log("id",id);
    this.id1 = id;
    this.commName = id;
    this.authService.getAllColor(id)
      .subscribe(resp=>{
      console.log("resp",resp);
      this.response = resp;
      if(this.response){
       if(this.response.message != "No Color Found"){             
       
       //this.jbody1 = this.response[0];
       this.jbody1 = this.response.message;
       for(let i = 0; i < this.jbody1.length; i++) {
        this.items.push(this.jbody1[i]);
        //console.log("items",this.items);
        this.items = this.items.filter( function( item, index, inputArray ) {
           return inputArray.indexOf(item) == index;
        });
        this.items.sort();
       }
       //console.log("resp[0]",resp[0]);  
       //console.log("jbody1",this.jbody1);
       //this.spinner.hide();
       this.isShown = false;
       }
       else{
        //console.log("resp.message",resp.message)
        //this.spinner.hide();
        this.isShown = false; 
        this.showColorasZero();
       }     
      }
      else {
        console.log("inside err jbody",this.jbody1);
      }
     })
    
     
  }

 
  showColorasZero(){
      //console.log("inside showColorasZero");
      this.alertService.presentToast("No Color Found !!");
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
             this.getAllColor();
         }
     }

  ngOnInit() {
   this.isShown = true;
   this.getAllColor();
  }

}
