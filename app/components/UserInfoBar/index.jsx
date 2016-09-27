import './style.scss';
import React from 'react';

export default class UserInfoBar extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  render() {
    const { active, avator, title, postText, disabled, anonymous, poster, userId } = this.props;
    return(
      <section className='userInfoBar'>
        {
          active ? <i className='avator' style={{ backgroundImage: `url(${avator})`}}></i> : ''
        }
        {
          active ? <span className='username'>{title}</span> : ''
        }
        {
          active && poster ? (
            <span className='poster'></span>
          ) : ('')
        }
        {
          active && anonymous ? (
            userId !== 17810 ?
              <span className='anonymous'></span> :
              ''
          ) : ''
        }
        <span className={'postnum ' + (disabled ? 'disabled' : '')}>{postText}</span>
      </section>
    );
  }
}
