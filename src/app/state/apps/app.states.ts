import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AdminLogin, AutoLogin, CreateAdmin, Logout } from './app.actions';
import { Navigate } from '@ngxs/router-plugin';
import { Injectable } from '@angular/core';
import { AdminService } from "../../service/admin.service";
import { Router } from '@angular/router';

interface StateModel {
  user: any;
  token: string;
  error: any;
}

@State<StateModel>({
  name: 'auth',
  defaults: {
    user: null,
    token: '',
    error: null,
  },
})
@Injectable()
export class AuthState {
  @Selector()
  static user(state: StateModel) {
    return state.user;
  }

  @Selector()
  static token(state: StateModel) {
    return state.token;
  }

  @Selector()
  static error(state: StateModel) {
    return state.error;
  }

  constructor(private service: AdminService, private router: Router) {}

  @Action(AutoLogin)
  async autoLogin({ dispatch }: StateContext<StateModel>) {
    try {
      const session = localStorage.getItem('PLOGIN');
      if (typeof session !== 'string') {
        throw Error('LOGIN NOT FOUND');
      }
      const logins = JSON.parse(session);
      dispatch(new AdminLogin(logins));
    } catch (err) {
      console.error('AutoLogin error:', err);
    }
  }

  @Action(AdminLogin)
  adminLogin(
    { patchState, dispatch }: StateContext<StateModel>,
    { payload }: AdminLogin
  ) {
    console.log('Storing token in local storage:', payload.token); // Debug log
    localStorage.setItem('PLOGIN', JSON.stringify(payload));
    patchState({
      user: payload.user,
      token: payload.token,
    });
    dispatch(new Navigate(['payment-reconciliation']));
  }

  @Action(Logout)
  logout({ patchState, dispatch }: StateContext<StateModel>) {
    localStorage.removeItem('PLOGIN');
    window.location.reload();
  }
}