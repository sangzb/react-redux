import './style.scss';
import React from 'react';


let $ = window.jQuery;
let animateHandler = null;
export default class ProcessCover extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { icon: true };
  }

  componentDidMount() {
    $(this.refs.coverage).css('display', 'none').bind('touchmove', function(e) {
      e.preventDefault();
      e.stopPropagation();
    });
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.param !== nextProps.param) {
      if(nextProps.param.isLoading === true || (nextProps.param.message && nextProps.param.message.length)) {
        this.showCover(nextProps.param.message);
      }else {
        this.hideAnimate();
      }
    }
  }


  hideAnimate() {
    const { param } = this.props;
    if(param.noanimate) {
      this.refs.coverage.style.display = 'none';
    }else {
      let elem = $(this.refs.coverage);
      elem.stop().animate({ opacity: 0}, function() {
        elem.css({ display: 'none' });
      });
    }
  }

  showCover(message) {
    let elem = $(this.refs.coverage);
    elem.stop();
    let that = this;
    this.refs.coverage.style.display = 'block';
    this.refs.coverage.style.opacity = 1;
    if(message && message.length) {
      this.setState({ icon: false, text: message});
      if (animateHandler){
        clearTimeout(animateHandler);
      }
      animateHandler = setTimeout(function() {
        that.hideAnimate();
      }, 500);
    }else {
      if (message === true) {
        this.setState({ icon: false });
        this.refs.coverage.style.opacity = 0;
      }else{
        this.setState({ icon: true });
      }
    }
  }
  
  render() {
    return (
      <div className={'CoverCon '} ref='coverage'>
        <div className='CoverLayer'></div>
        <div className='CoverContentLayer'>
          {
            this.state.icon ? (
              <i className='loadingicon'></i>
            ) : (
              <span className='loadingtext'>
                {
                  this.state.text
                }
              </span>
            )
          }
        </div>
      </div>
    );
  }
}

