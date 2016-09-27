import fetch from 'isomorphic-fetch';
import assign from 'lodash.assign';

let wx = window.wx;
export default function wechat() {
  let ajaxSettings = assign({}, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  let param = {
    url: encodeURI(location.href),
    jsApiList: [
      'onMenuShareTimeline', 'onMenuShareAppMessage'
    ],
    debug: false
  };
  ajaxSettings.body = JSON.stringify(param);

  return fetch(
    'http://wxconnect.bamaying.com/api/5770df7243ceb10d03d8c97a/js_config',
    ajaxSettings
  ).then(function(response) {
    return response.json();
  }).then(function(data) {
    wx.config(data.data);
  }).catch(function(error) {
    console.log(error);
  });
}

wechat.shareTimeLine = function(param) {
  wx.onMenuShareTimeline(param);
};

wechat.shareAppMessage = function(param) {
  wx.onMenuShareAppMessage(param);
};
