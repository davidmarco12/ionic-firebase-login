import { Injectable } from '@angular/core';
import { User } from '../shared/user.interface';
import { AngularFireAuth } from '@angular/fire/auth'
import { auth } from 'firebase';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user$: Observable<User>;



  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) =>{
        if(user){
          return this.afs.doc<User>('users/'+user.uid).valueChanges();
        }
        return of(null);  
      })
    );
   }

  async register(email: string, password: string):Promise <User>{
    try{
      const { user } = await this.afAuth.createUserWithEmailAndPassword(email, password);
      await this.sendVerificationEmail();
      return user;
    }catch(e){
      console.log('error en register',e);
    }
  }
  
  async logIn(email: string, password:string ):Promise <User>{
    try{
      const {user} = await this.afAuth.signInWithEmailAndPassword(email, password);
      this.updateUserData(user);
      return user;
    }catch(e){
      console.log('error en log in',e);
    }
  } 
  
  async logInGoogle():Promise <User>{
    try{
      const {user} = await this.afAuth.signInWithPopup(new auth.GoogleAuthProvider());
      this.updateUserData(user);
      return user;
    }catch(e){
      console.log('error en log in',e);
    }  
  }
  
  async logOut():Promise <void>{
    try{
      await this.afAuth.signOut();
    }catch(e){
      console.log('error en reset password',e);
    }
  }

  async sendVerificationEmail():Promise <void>{
    try{
      return (await this.afAuth.currentUser).sendEmailVerification();
    }catch(e){
      console.log('error en sendverificacionemail',e);
    }
  }

  async isEmailVerified(user:User){
    return user.emailVerified === true ? true : false;
  }
  
  async resetPassword(email: string):Promise <void>{
    try{
      return this.afAuth.sendPasswordResetEmail(email);
    }catch(e){
      console.log('error en reset password',e);
    } 
  }


  private updateUserData(user: User){
    const userRef: AngularFirestoreDocument<User> = this.afs.doc('users/'+user.uid);
    
    
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified
    };

    return userRef.set(data, {merge: true});
  
  }


}
