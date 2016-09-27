import fetch from 'isomorphic-fetch';
import sweetAlert from 'sweetalert';
import assign from 'lodash.assign';

import { CookieStore, C } from '../utils';
import { BASE_URI } from '../constants';

const baseUri = BASE_URI + 'api';

function removeEmptyPair(params) {
  params = params || {};
  let newObj = {};
  Object.keys(params).forEach(function(key) {
    if (params[key] !== undefined &&
        params[key] !== '' &&
        params[key] !== null
    ) newObj[key] = params[key];
  });
  return newObj;
}

// 用于替换接口 url 中的参数，比如：
//   path = '/category/:id/posts'
//   params = { id: 5, tag: 'kid' }
//   => '/category/5/posts?tag=kid'
//   => {}
function assembleUrl(path, params, method) {
  path = path || '';
  params = params || {};
  params = removeEmptyPair(params);
  method = method ? method.toLowerCase() : 'get';
  Object.keys(params).forEach(function(key) {
    let _path = path.replace(`:${key}`, params[key]);
    if (_path === path) {
      if (method === 'get') {
        if (_path.indexOf('?') === -1) {
          _path = `${_path}?${key}=${params[key]}`;
        } else {
          _path = `${_path}&${key}=${params[key]}`;
        }
        delete params[key];
      }
    } else {
      delete params[key];
    }
    path = _path;
  });
  return path;
}

// 接口辅助方法, 返回 接口 操作 action
// _state 将会覆盖默认的 state
export default function(apiConfig = {}) {
  apiConfig.formatter = apiConfig.formatter || 'normal';

  // 请求数据
  let request = function(params) {
    return {
      type: C(`REQUEST_${params._state || apiConfig.state}`),
      params
    };
  };

  // 收到数据
  let recieve = function(params, data) {
    return assign({}, {
      params,
      type: C(`RECIEVE_${params._state || apiConfig.state}`),
      receivedAt: new Date()
    }, data);
  };

  let signOutUser = function() {
    return assign({}, {
      type: 'RECIEVE_USER_SIGN_OUT',
      message: '为登陆或登陆已超时'
    });
  };

  let formatter = (function(type) {
    switch (type) {
      case 'normal':
        return function(data) {
          data = data || {};
          return {
            status: data.status || 0,
            data: data.data || {},
            message: data.message || '',
            metadata: data.metadata || {}
          };
        };
      case 'backfire':
        return function(data) {
          return {
            status: 0,
            data: data || {},
            message: '数据获取成功',
            metadata: {}
          };
        };
      default:
        return function(data) { return data; };
    }
  })(apiConfig.formatter);

  return function (params, headers, settings) {

    params = params ||  {};
    settings = settings || {};
    // 返回 dispatcher
    return function (dispatch) {

      let handleStatus = function(status, message) {
        switch (status) {
          case 401:
            // sweetAlert({
            //   title: '出错啦',
            //   text: message || '您需要登陆才能继续访问',
            //   type: 'error',
            //   showConfirmButton: false,
            //   timer: 1500
            // });
            dispatch(signOutUser());
            break;
          case 422:
            sweetAlert({
              title: '出错啦',
              text: message || '参数错误',
              type: 'error'
            });
            break;
          case 1:
            sweetAlert({
              title: '成功',
              text: message || '请求成功',
              type: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            break;
          case 2:
            sweetAlert({
              title: '出错啦',
              text: message || '请求失败',
              type: 'error',
              showConfirmButton: false,
              timer: 2000
            });
            break;
          default:
        }
      };

      dispatch(request(params));

      let csrfParam = CookieStore.get('csrf_param');
      let csrfToken = CookieStore.get('csrf_token');

      let data = params;

      // 添加 csrf 支持
      if (csrfParam) {
        if (~['put', 'post', 'delete'].indexOf(apiConfig.method)) {
          if (data instanceof FormData) {
            data.append(csrfParam, csrfToken);
          } else {
            data = assign({ [csrfParam]: csrfToken }, data);
          }
        }
      }

      let accessToken = CookieStore.get('access_token');

      let method = (apiConfig.method || 'get').toUpperCase();

      let url = assembleUrl(apiConfig.url, data, method);

      //headers = assign({}, apiConfig.headers, headers);
      headers = assign({}, apiConfig.headers, C('apiHeader'));
      if (accessToken) {
        headers = assign({
          'Authorization': accessToken,
          'Access-Token': accessToken
        }, headers);
      }

      if (!(data instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }

      let ajaxSettings = assign({}, settings, {
        method: method,
        credentials: 'include',
        headers: headers
      });

      if (method !== 'GET' && method !== 'HEAD') {
        ajaxSettings.body = data instanceof FormData ? data : JSON.stringify(data);
      }

      function jsonResponse(response) {
        if (response && (response.status === 401 || response.status === 418)) {
          dispatch(signOutUser());
          return {
            status: 401,
            message: '请求错误'
          };
        }
        if (response && response.status === 204 && response.statusText === 'No Content') {
          return {
            status: 204,
            message: '数据获取成功'
          };
        }
        // 特殊处理更新用户匿名头像,昵称
        if (response && response.status === 200 && ~response.url.indexOf('stars/profile')) {
          if (params && params.incognitoName) {
            return {
              params,
              status: 200,
              message: '数据获取成功'
            };
          }
        }
        return response.json();
      }
      let _url = ~url.indexOf('http://') ? url : baseUri + url;
      _url =  _url.replace('2995', '3000');
      
      return fetch(
        _url,
        ajaxSettings
      ).then(jsonResponse).then(
        (data) => {
          dispatch(recieve(params, formatter(data)));
          handleStatus(data.status, data.message);
          return data;
        }
      ).catch((err) => {
        console.log(err, err.stack);
        dispatch(recieve(params, {
          status: 500,
          data: {},
          message: '请求错误',
          metadata: {}
        }));
      });
    };
  };
}
