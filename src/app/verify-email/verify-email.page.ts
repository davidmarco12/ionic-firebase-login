import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { User } from '../shared/user.interface';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage implements OnInit {

  user$: Observable<User> = this.authSvc.afAuth.user;

  constructor(private authSvc: AuthService) { }

  ngOnInit() {
  }

  async onSendEmail(): Promise<void>{
    try{
      await this.authSvc.sendVerificationEmail();
    }catch(e){
      console.log(e)
    }
  }

  ngOnDestroy():void{
    this.authSvc.logOut
  }

}
