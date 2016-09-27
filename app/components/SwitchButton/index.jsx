import './style.scss';
import React from 'react';


let action = true;
let actionHandler = null;
export default class SwitchButton extends React.Component {
  constructor ( props ) {
    super( props );
    const { status } = this.props;
    let switchStatus = status;
    this.state = {
      isChecked: switchStatus
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.isChecked !== nextState.isChecked) {
      this.props.setStatus(nextState.isChecked);
    }

    if (this.props.status !== nextProps.status) {
      this.setState({ isChecked: nextProps.status });
    }
  }
  
  render () {
    return(
      <div className="switch-container" onTouchEnd={this._handleChange.bind(this)}>
        <label>
          <span
            className={'switch ' + (this.state.isChecked ? 'checked' : '')}
            ></span>
          <div>
            <span><g className="icon icon-toolbar grid-view"></g></span>
            <span><g className="icon icon-toolbar ticket-view"></g></span>
            <div></div>
          </div>
        </label>
      </div>
    );
  }


  _handleChange () {
    const { userInfo } = this.props;
    let isAvatar = (userInfo && userInfo.incognito && userInfo.incognito.avatar);
    let isNickName = (userInfo && userInfo.incognito && userInfo.incognito.userName);
    if (action) {
      if (!this.state.isChecked) {
        if (isNickName) {
          //this.props.anonymous();
        }else {
          this.props.anonymous();
        }
      }
      action = false;
      this.setState( { isChecked: !this.state.isChecked } );
      if (actionHandler) {
        clearTimeout(actionHandler);
      }
      actionHandler = setTimeout(function() {
        action = true;
      }, 500);
    }
  }
}
