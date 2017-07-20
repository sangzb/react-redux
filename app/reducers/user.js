import assign from 'lodash.assign';
import { C, CookieStore, wechatSignIn } from '../utils';

let signInSignature = function(value) {
  let name = '_webapp_sig';
  if (value === true) {
    CookieStore.set(name, '1');
  } else if (value === false) {
    CookieStore.set(name, '');
  }
  // bamaying muse sign in flag
  return CookieStore.get(name) || '';
};

let isSignedIn = function() {
  return signInSignature() ? C('YES') : C('NO');
};

const initialState = assign({
  isLoading: C('NO'),
  message: '',
  user: {},
  //isSignedIn: true//isSignedIn()
  isSignedIn: isSignedIn()
});

export const user = function(state, action) {
  switch (action.type) {
    case C('REQUEST_FETCH_MY_INFO'):
    case C('REQUEST_USER_SIGN_IN'):
      return assign({}, state, { isLoading: C('YES') });
    case C('RECIEVE_USER_SIGN_IN'):
      if (action.status >= 0 && action.status < 2) {
        // 取消准备执行的登录操作
        if (window.signInWechatTimer) clearTimeout(window.signInWechatTimer);

        if (action.data && action.data.token_type && action.data.access_token) {
          signInSignature(true);
          CookieStore.set('access_token', `${action.data.token_type} ${action.data.access_token}`);
        }
        return assign({}, state, {
          message: action.message,
          isLoading: C('NO'),
          isSignedIn: isSignedIn(),
          user: action.data
        });
      } else {
        return assign({}, state, {
          message: action.message,
          isLoading: C('NO')
        });
      }

    case C('RECIEVE_FETCH_MY_INFO'):
      return assign({}, state, {
        message: action.message,
        isLoading: C('NO'),
        user: action.data || {}
      });
    case C('RECIEVE_USER_SIGN_OUT'):
      signInSignature(false);
      CookieStore.set('access_token', '');
      // 清除之前的登出操作
      if (window.signInWechatTimer) clearTimeout(window.signInWechatTimer);
      //window.signInWechatTimer = setTimeout(wechatSignIn, 1500);
      return assign({}, state, {
        message: action.message,
        isSignedIn: false
      });
    default:
      return state || initialState;
  }
};
