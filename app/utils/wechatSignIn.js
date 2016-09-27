import CookieStore from './cookie';

export default function wechatSignIn() {
  let location = window.location.href.split('?')[0];

  if (/micromessenger/i.test(navigator.userAgent)) {
    CookieStore.set('__referrer__', window.location.href || '');
    window.location = process.env.NODE_ENV === 'production' ?
      `http://wxconnect.bamaying.com/api/577fbb574c5ae76c22083695/authorize_url?redirect=${encodeURI(location)}&state=WechatSignIn` :
      `http://wxtest.bamaying.com/api/5765481ac0b6e94863510578/authorize_url?redirect=${encodeURI('http://172.19.88.105')}&state=WechatSignIn`;
  }
}
