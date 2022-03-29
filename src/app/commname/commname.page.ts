import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Platform, NavController, } from '@ionic/angular';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormControl } from "@angular/forms";
//import 'rxjs/add/operator/debounceTime';
import { Location } from "@angular/common";
//import { debounceTime } from "rxjs/operators";
 


@Component({
  selector: 'app-commname',
  templateUrl: './commname.page.html',
  styleUrls: ['./commname.page.scss'],
})
export class CommnamePage implements OnInit {

  searchTerm: string = '';
  public folder: string;
  searchControl: FormControl;
  searching: any = false;
  rows;
  response;
  jbody1;
  isShown = true;
  
  items = [];

  

  constructor(private activatedRoute: ActivatedRoute,
  private authService: AuthService,
  private router: Router,
  private location: Location,
  private navCtrl: NavController,) {
   this.searchControl = new FormControl();
  }

  myRefreshButton(){
  this.ngOnInit();
  }
  
  checkCommNameDB(): void {
     this.authService.checkCommNameDB()
      .subscribe(resp=>{
      console.log("resp_1",resp);
      this.response = resp;
      if(this.response){            
       this.rows = this.response.message;
       console.log("rows",this.rows);
       if(this.rows > 0){
         this.getCommNameFromDB();
       }
       else{
         this.getCommName();
       }
          
      }
      else {
        console.log("inside err jbody");
      }
     })
    }

  getCommName(): void {
    this.authService.getCommName()
      .subscribe(resp=>{
      console.log("resp",resp);
      this.response = resp;
      if(this.response){       
       
       //this.jbody1 = resp[0];
       this.jbody1 = this.response.message;
       //console.log("resp[0]",this.response[0]);  
       //console.log("jbody1",this.jbody1);
       for(let i = 0; i < this.jbody1.length; i++) {
        this.items.push(this.jbody1[i].commercial_name);
        console.log("items",this.items);
        this.items = this.items.filter( function( item, index, inputArray ) {
           return inputArray.indexOf(item) == index;
        });
        this.items.sort();
        } 
        this.isShown = false;    
      }
      else {
        console.log("inside err jbody",this.jbody1);
      }
     })
     
  }

  getCommNameFromDB(): void {
    this.authService.getCommNameFromDB()
      .subscribe(resp=>{
      console.log("resp",resp);
      this.response = resp;
      if(this.response){       
       
       //this.jbody1 = resp[0];
       this.jbody1 = this.response.message;
       //this.spinner.hide();
       this.isShown = false; 
       //console.log("resp[0]",resp[0]);  
       //console.log("jbody1",this.jbody1);
       console.log("jbody1",this.jbody1[0]);
       //console.log("jbody1",this.jbody1[0].commercial_name); 

      for(let i = 0; i < this.jbody1.length; i++) {
        this.items.push(this.jbody1[i]);
        console.log("items",this.items);
        this.items = this.items.filter( function( item, index, inputArray ) {
           return inputArray.indexOf(item) == index;
        });
        this.items.sort();
      }
    
      }
      else {
        console.log("inside err jbody",this.jbody1);
      }
     })
     
  }

  

  createTables(): void {
    this.authService.createTables()
      .subscribe(resp=>{
      console.log("resp",resp);
     })
    }


 


  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    this.isShown = true;
    //this.createTables();
    //this.checkCommNameDB();
    this.getCommNameFromDB();
  }


    

  

}
