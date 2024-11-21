import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalLoginService {
  private showLoginSubject = new BehaviorSubject<boolean>(false);

  showLogin$ = this.showLoginSubject.asObservable();

  openLogin() {
    this.showLoginSubject.next(true);
  }

  closeLogin() {
    this.showLoginSubject.next(false);
  }
}
