import './style.scss';
import React from 'react';

let  that = null;
let $ = window.jQuery;
export default class ConfirmPopup extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    that = this;
  }

  popupConfirm() {
    this.confirmFunc();
    this.popupCancel();
  }

  popupCancel() {
    ConfirmPopup.hide();
  }

  render() {
    return (
      <div className='popupCover'>
        <div className='confirmCon'>
          <p>确定要删除吗?</p>
          <div className='buttonCon'>
            <span className='submit' onClick={this.popupConfirm.bind(this)}>
              <i className='split'></i>
              确 定</span>
            <span className='cancel' onClick={this.popupCancel.bind(this)}>取 消</span>
          </div>
        </div>
      </div>
    );
  }
}

ConfirmPopup.show = function(cb) {
  that.confirmFunc = cb;
  $('.popupCover').show();
  setTimeout(function() {
    $('.confirmCon').addClass('show');
  }, 100);
};

ConfirmPopup.hide = function() {
  $('.popupCover').hide();
  $('.confirmCon').removeClass('show');
};
