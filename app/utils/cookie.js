import Cookies from 'js-cookie';

// _bamaying__
const COOKIE_PREFIX = '_bmy_scorpio_';

const keyWithPrefix = (key) => {
  return `${COOKIE_PREFIX}${key || ''}`;
};

export default class CookieStore {
  static set(key, value, options) {
    key = keyWithPrefix(key);
    value = value !== undefined ? value : '';
    options = options || { expires: 20 };
    Cookies(key, value, options);
  }

  static get(key) {
    key = keyWithPrefix(key);
    return Cookies.get(key);
  }

  static exists(key) {
    key = keyWithPrefix(key);
    return !!Cookies.get(key);
  }

  static getRaw(key) {
    return Cookies.get(key);
  }

  static setRaw(key, value, options) {
    Cookies.set(key, value, options);
  }
}
