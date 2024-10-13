import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalLoginService {

  private showLoginSubject = new BehaviorSubject<boolean>(false);

  showLogin$ = this.showLoginSubject.asObservable();

  openLogin() {
    console.log('openLogin: showLogin is now true');
    this.showLoginSubject.next(true);
  }

  closeLogin() {
    console.log('closeLogin: showLogin is now false');
    this.showLoginSubject.next(false);
  }
}
