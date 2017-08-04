import React from 'react';
import PropTypes from 'prop-types';
// 样式
import './style.scss';

class LoadingMore extends React.Component {
  shouldComponentUpdate (newProps) {
    return newProps.enabled !== this.props.enabled;
  }

  render () {
    let { enabled, infoText } = this.props;
    enabled = enabled !== false;
    if (!enabled) {
      return null;
    }
    return (
      <div className='loading-more'>
        <div className='loader-inner line-scale'>
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
        <span>
          {
            infoText ? infoText : '拼命加载中'
          }
        </span>
        <div className='loader-inner line-scale right-to-left'>
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
    );
  }
}

LoadingMore.propTypes = {
  enabled: PropTypes.bool,
  infoText: PropTypes.string
};

export default LoadingMore;
