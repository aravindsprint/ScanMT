
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { EnvService } from './env.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  token:any;
  IPADDRESS;
  localIP;
  local_IP;
  ipaddress;
 

  constructor(
    private http: HttpClient,
    private storage: NativeStorage,
    private env: EnvService,
  ) { }


  login(email: String, password: String) {

    this.localIP = window.location.origin;
    console.log("localIP",this.localIP);
    this.local_IP = this.localIP.slice(7,20);
    this.ipaddress = this.local_IP;
    if(this.ipaddress != "172.16.18.39"){
     return this.http.post(this.env.API_URL1 + 'api/request',
      {email: email, password: password}
    ).pipe(
      tap(token => {
        this.storage.setItem('token', token)
        .then(
          () => {
            console.log('Token Stored');
          },
          error => console.error('Error storing item', error)
        );
        this.token = token;
        this.isLoggedIn = true;
        return token;
      }),
    );

    }
    else{
     return this.http.post(this.env.API_URL + 'api/request',
      {email: email, password: password}
    ).pipe(
      tap(token => {
        this.storage.setItem('token', token)
        .then(
          () => {
            console.log('Token Stored');
          },
          error => console.error('Error storing item', error)
        );
        this.token = token;
        this.isLoggedIn = true;
        return token;
      }),
    );


    }

    //return this.http.post(this.env.API_URL + 'api/request',
      //{email: email, password: password}
    //).pipe(
      //tap(token => {
        //this.storage.setItem('token', token)
        //.then(
          //() => {
            //console.log('Token Stored');
          //},
          //error => console.error('Error storing item', error)
        //);
        //this.token = token;
        //this.isLoggedIn = true;
        //return token;
      //}),
    //);
  }

  logout() {
    this.localIP = window.location.origin;
    console.log("localIP",this.localIP);
    this.local_IP = this.localIP.slice(7,20);
    this.ipaddress = this.local_IP;
    if(this.ipaddress != "172.16.18.39"){
    return this.http.get(this.env.API_URL1 + 'api/logout')
    .pipe(
      tap(data => {
        this.storage.remove("token");
        this.isLoggedIn = false;
        delete this.token;
        return data;
      })
    )

    }
    else{
    return this.http.get(this.env.API_URL + 'api/logout')
    .pipe(
      tap(data => {
        this.storage.remove("token");
        this.isLoggedIn = false;
        delete this.token;
        return data;
      })
    )

    }

    //const headers = new HttpHeaders({
      //'Authorization': this.token["token_type"]+" "+this.token["access_token"]
    //});
   
  }

  user() {
   
  }

  checkCommNameDB() {
    this.localIP = window.location.origin;
    console.log("localIP",this.localIP);
    this.local_IP = this.localIP.slice(7,20);
    this.ipaddress = this.local_IP;
    if(this.ipaddress != "172.16.18.39"){
     return this.http.get(this.env.API_URL1+'api/checkCommNameDB');
   
    }
    else{
     return this.http.get(this.env.API_URL+'api/checkCommNameDB');
    }
   
  }


   getAllWarehouses(){
    //console.log("inside getAllItem");
    this.localIP = window.location.origin;
    console.log("localIP",this.localIP);
    this.local_IP = this.localIP.slice(7,20);
    this.ipaddress = this.local_IP;
    if(this.ipaddress != "172.16.18.39"){
    return this.http.get(this.env.API_URL1+'api/getAllWarehouses');
    }
    else{
    return this.http.get(this.env.API_URL+'api/getAllWarehouses');
    }
   
  }

  getCommName(){
    //console.log("inside getAllItem");
    this.localIP = window.location.origin;
    console.log("localIP",this.localIP);
    this.local_IP = this.localIP.slice(7,20);
    this.ipaddress = this.local_IP;
    if(this.ipaddress != "172.16.18.39"){
    return this.http.get(this.env.API_URL1+'api/getCommName');
    }
    else{
    return this.http.get(this.env.API_URL+'api/getCommName');
    }
   
  }

  getCommNameFromDB(){
    //console.log("inside getAllItem");
    this.localIP = window.location.origin;
    console.log("localIP",this.localIP);
    this.local_IP = this.localIP.slice(7,20);
    this.ipaddress = this.local_IP;
    if(this.ipaddress != "172.16.18.39"){
    return this.http.get(this.env.API_URL1+'api/getCommNameFromDB');
    }
    else{
    return this.http.get(this.env.API_URL+'api/getCommNameFromDB');
    }
    //console.log("after getAllItem");  
  }

 

  getAllColor(id){
    this.localIP = window.location.origin;
    console.log("localIP",this.localIP);
    this.local_IP = this.localIP.slice(7,20);
    this.ipaddress = this.local_IP;
    if(this.ipaddress != "172.16.18.39"){
    var data = id;      
    return this.http.get(this.env.API_URL1+'api/getAllColor/' + id);
    }
    else{
    var data = id;      
    return this.http.get(this.env.API_URL+'api/getAllColor/' + id);
    }
   
   
  }

  createTables(){
    this.localIP = window.location.origin;
    console.log("localIP",this.localIP);
    this.local_IP = this.localIP.slice(7,20);
    this.ipaddress = this.local_IP;
    if(this.ipaddress != "172.16.18.39"){
    return this.http.get(this.env.API_URL1+'api/createTables');
    }
    else{
      return this.http.get(this.env.API_URL+'api/createTables');
    }
  }

  getAllItem(id, commName){
    this.localIP = window.location.origin;
    console.log("localIP",this.localIP);
    this.local_IP = this.localIP.slice(7,20);
    this.ipaddress = this.local_IP;
    if(this.ipaddress != "172.16.18.39"){
    var data = id;
    var commName = commName;
    return this.http.get(this.env.API_URL1+'api/getAllItem/' + id +'/'+ commName);
    }
    else{
    var data = id;
    var commName = commName;
    return this.http.get(this.env.API_URL+'api/getAllItem/' + id +'/'+ commName);
    }
   
   
  }
 
  getAllStock(id, colorName, commName){
    this.localIP = window.location.origin;
    console.log("localIP",this.localIP);
    this.local_IP = this.localIP.slice(7,20);
    this.ipaddress = this.local_IP;
    if(this.ipaddress != "172.16.18.39"){
    var id = id;
    var colorName = colorName;
    var commName = commName;
    return this.http.get(this.env.API_URL1+'api/getAllStocks',
    {
    params:{
    id:id,
    colorName:colorName,
    commName:commName
    }
    });

    }
    else{
    var id = id;
    var colorName = colorName;
    var commName = commName;
    return this.http.get(this.env.API_URL+'api/getAllStocks',
    {
    params:{
    id:id,
    colorName:colorName,
    commName:commName
    }
    });

    }
   

   
    }


  getAllBatchStock(batch_nos){
    this.localIP = window.location.origin;
    console.log("localIP",this.localIP);
    this.local_IP = this.localIP.slice(7,20);
    this.ipaddress = this.local_IP;
    if(this.ipaddress != "172.16.18.39"){
    var batch = batch_nos;
    return this.http.get(this.env.API_URL1+'api/getAllBatchStock',
    {
    params:{
    batch:batch
    }
    });

    }
    else{
    var batch = batch_nos;
    return this.http.get(this.env.API_URL+'api/getAllBatchStock',
    {
    params:{
    batch:batch
    }
    });

    }
   
    }


    postData(jsonData){
    this.localIP = window.location.origin;
    console.log("localIP",this.localIP);
    this.local_IP = this.localIP.slice(7,20);
    this.ipaddress = this.local_IP;
    if(this.ipaddress != "172.16.18.39"){
    var jsonData = jsonData;
    return this.http.get(this.env.API_URL1+'api/postData',
    {
    params:{
    jsonData:jsonData
    }
    });

    }
    else{
    var jsonData = jsonData;
    return this.http.get(this.env.API_URL+'api/postData',
    {
    params:{
    jsonData:jsonData
    }
    });

    }
   
    }


   updateBatchStatus(batch,change_batch_status){
    this.localIP = window.location.origin;
    console.log("localIP",this.localIP);
    this.local_IP = this.localIP.slice(7,20);
    this.ipaddress = this.local_IP;
    if(this.ipaddress != "172.16.18.39"){
    var batch = batch;
    var change_batch_status = change_batch_status;
    return this.http.get(this.env.API_URL1+'api/updateBatchStatus',
    {
    params:{
    batch:batch,
    change_batch_status:change_batch_status
    }
    });

    }
    else{
    var batch = batch;
    var change_batch_status = change_batch_status;
    return this.http.get(this.env.API_URL+'api/updateBatchStatus',
    {
    params:{
    batch:batch,
    change_batch_status:change_batch_status
    }
    });

    }
   
    }      

  getToken() {
    return this.storage.getItem('token').then(
      data => {
        this.token = data;
        if(this.token != null) {
          this.isLoggedIn=true;
        } else {
          this.isLoggedIn=false;
        }
      },
      error => {
        this.token = null;
        this.isLoggedIn=false;
      }
    );
  }
}