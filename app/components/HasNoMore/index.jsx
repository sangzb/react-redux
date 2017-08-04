import React from 'react';
import PropTypes from 'prop-types';

// 样式
import './style.scss';

class HasNoMore extends React.Component {
  shouldComponentUpdate (newProps) {
    return newProps.hasMore !== this.props.hasMore;
  }

  render () {
    let { hasMore, infoText } = this.props;
    if (hasMore !== 'nomore') {
      return null;
    }
    return (
      <div className='has-no-more'>
        {
          infoText ? infoText : '已经到底啦 ^_^'
        }
      </div>
    );
  }
}

HasNoMore.propTypes = {
  hasMore: PropTypes.bool,
  infoText: PropTypes.string
};

export default HasNoMore;
