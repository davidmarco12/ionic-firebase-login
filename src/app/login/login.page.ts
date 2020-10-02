import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  constructor(private authSvc: AuthService, private router: Router) { }

  async onLogin(email, password){
    try{
      const user = await this.authSvc.logIn(email.value, password.value);
      if(user){
        const isVerified = await this.authSvc.isEmailVerified(user);
        this.redirectUser(isVerified);
      }
    }catch(e){
      console.log('error en el onLogin',e);
    }
  }

  async onLoginGoogle(){
    try{
      const user = await this.authSvc.logInGoogle();
      if(user){
        const isVerified = await this.authSvc.isEmailVerified(user);
        this.redirectUser(isVerified);
      }
    }catch(e){
      console.log('error en el onLoginGoogle',e)
    }
  }

  redirectUser(isVerified:boolean){
    if(isVerified){
      this.router.navigate(['admin']);
    }else{
      this.router.navigate(['verify-email']);
    }
  }


}
