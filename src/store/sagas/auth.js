import axios from 'axios';
import { put, delay } from 'redux-saga/effects';

import * as actions from '../actions/index';

export function* logoutSaga(action) {
    yield localStorage.removeItem('token');
    yield localStorage.removeItem('userId');
    yield localStorage.removeItem('expirationDate');
    yield put(actions.logoutSucceed());
}

export function* checkAuthTimeoutSaga(action) {
    yield delay(action.expirationTime * 1000);
    yield put(actions.logout());
}

export function* authUserSaga(action) {
    yield put(actions.authStart());

    const authData = {
        email: action.email,
        password: action.password,
        returnSecureToken: true,
    };

    let url =
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCEOEhd1CpekGDbD_9MgaPxISQ_5AgykLs';
    if (!action.isSignUp) {
        url =
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCEOEhd1CpekGDbD_9MgaPxISQ_5AgykLs';
    }

    try {
        const response = yield axios.post(url, authData);
        yield localStorage.setItem('token', response.data.idToken);
        yield localStorage.setItem('userId', response.data.localId);
        yield localStorage.setItem(
            'expirationDate',
            new Date(new Date().getTime() + response.data.expiresIn * 1000)
        );
        yield put(actions.authSuccess(response.data.idToken, response.data.localId));
        yield put(actions.checkAuthTimeout(response.data.expiresIn));
    } catch (err) {
        yield put(actions.authFail(err.response.data.error));
    }
}
