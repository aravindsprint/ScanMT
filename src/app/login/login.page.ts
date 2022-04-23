import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private navCtrl: NavController,
    private router: Router,
    private alertService: AlertService
  ) { }

  jbody;
  response;
  username;

  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  hideShowPassword() {
     this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
     this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  ngOnInit() {
  }

   // Dismiss Login Modal
  dismissLogin() {
    this.modalController.dismiss();
  }

  login(form: NgForm) {
    this.authService.login(form.value.email, form.value.password).subscribe(
      resp=>{
      console.log("resp",resp);
      this.response = resp;
      console.log("resp",this.response.statusCode);
     
      if(this.response.statusCode == 200){       
       
       this.jbody = JSON.parse(this.response.body);  
       form.resetForm();
       console.log("jbody",this.jbody.message);
       this.username = this.jbody.full_name;
       console.log("username",this.username);
       localStorage.setItem("USERNAME", this.username);
       this.alertService.presentToast("Logged In");
       this.dismissLogin();
       //this.navCtrl.navigateRoot('/commname');
       //this.navCtrl.navigateForward('/commname');
       //this.navCtrl.navigateRoot('/folder/Inbox');
       this.router.navigate(['/stockdetails']).then(() => {
       window.location.reload();
       });      
      }
      else {
        this.alertService.presentToast("Invalid Password");
      }
      },
      //data => {
        //console.log(data);
        //this.alertService.presentToast("Logged In");
      //},
      error => {
        console.log(error);
      },
      //() => {
        //this.dismissLogin();
        //this.navCtrl.navigateRoot('');
      //}
    );
  }

}
