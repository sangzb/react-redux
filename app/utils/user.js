import { CookieStore, wechatSignIn } from './index.js';
import { userSignIn, fetchMyInfo } from '../actions';

export default function (user, dispatch, location) {
  if (user.isSignedIn) {
    dispatch(fetchMyInfo());
  } else {
    if (location.query.state === 'WechatSignIn' && location.query.code) {
      dispatch(userSignIn({ code: location.query.code })).then((data) => {
        if (data && data.status >= 0 && data.status < 2) {
          let referrer = CookieStore.get('__referrer__');
          if (referrer) {
            CookieStore.set('__referrer__', '');
            window.location.href = referrer;
          }
        }
      });
    } else {
      wechatSignIn();
    }
  }
}