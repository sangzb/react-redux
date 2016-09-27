import './style.scss';
import React from 'react';
import iScroll from 'iscroll';
import { owlAdapter } from '../../utils';

let scrollOption = {
  shrinkScrollbars: 'clip',
  mouseWheel: true,
  click: true
};
export default class ImagesPanel extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { style: { width: '100%', height: '2rem', marginRight: '0' } };
    this.initImages = this.initImages.bind(this);
  }

  componentWillReceiveProps(nextPorps) {
    if (this.props.pics !== nextPorps.pics) {
      this.initImages(nextPorps.pics, this.props.limit);
    }
  }

  componentDidMount() {
    this.initImages(this.props.pics, this.props.limit);
  }
  
  initImages(pics, limit) {
    let lng = pics ? pics.length : (this.props.pics || []).length;
    if (limit && lng > limit) {
      lng = limit;
    }
    switch (lng) {
      case 1:
        this.setState({style: {width: '100%', height: '100%', marginRight: '0', marginBottom: '2%'}});
        break;
      case 2:
        this.setState({style: {width: '49%', height: '100%', marginRight: '2%', marginBottom: '2%'}});
        break;
      case 4:
        this.setState({style: {width: '49%', height: '49%', marginRight: '2%', marginBottom: '2%'}});
        break;
      case 3:
        this.setState({style: {width: '32%', height: '100%', marginRight: '1%', marginBottom: '2%'}});
        break;
      case 5:
      case 6:
        this.setState({style: {width: '32%', height: '50%', marginRight: '1%', marginBottom: '1%'}});
        break;
      default:
        this.setState({style: {width: '32%', height: '32%', marginRight: '1%', marginBottom: '1%'}});
        break;
    }
  }

  showPhotos() {
    const { pics } = this.props;
    let imgcon = $('<div id="ImagePanel" class="owl-carousel owl-theme"></div>').unbind('click').click(
      function() {
        $(this).empty().remove();
      }
    );
    imgcon.appendTo($('body'));
    if (this.props.showImage) {
      let height = document.documentElement.clientHeight;
      let width = document.documentElement.clientWidth;
      pics.map(function(v) {
        $('<div class=\'item\' style="height: '+ height +'px;width:' + width + 'px"><img src=\' '+ v.largeUrl +' \' /></div>').appendTo(imgcon);
      });
      owlAdapter({}, imgcon).carousel();
      $('.item img', imgcon).load(function() {
        if (this.height/this.width > height/width) {
          new iScroll(this.parentNode, scrollOption);
        }else {
          this.parentNode.style.display = 'table-cell';
        }
        this.style.opacity = 1;
      });

    }
  }
  
  render() {
    const { pics, limit } = this.props;
    let width = document.documentElement.clientWidth;
    let _limit = limit || pics.length;
    if (_limit > pics.length) {
      _limit = pics.length;
    }
    let rate = 1;
    if (_limit === 2) {
      rate = 0.5;
    }else if (_limit === 3){
      rate = 0.33;
    }else if (_limit == 5 || _limit == 6) {
      rate = 0.66;
    }
    let conWidth = parseInt(0.6 * width);
    conWidth = conWidth > 200 ? 200 : conWidth;
    return(
      <div className='imagesCon' onClick={this.showPhotos.bind(this)} style={ (pics && pics.length) ? { width: conWidth, height: conWidth * rate } : {}}>
        {
          pics ? pics.map(function(v, i) {
            if (limit) {
              if (i < limit) {
                let style = JSON.parse(JSON.stringify(this.state.style));
                style.backgroundImage = 'url(' + v.largeUrl + ')';
                if (pics.length === 2) {
                  if(i % 2) {
                    style.marginRight = 0;
                  }
                }
                return(
                  <i key={'img_' + i} className='imageItem' style={style}></i>
                );
              }else {
                return (
                  ''
                );
              }
            }else {
              let style = JSON.parse(JSON.stringify(this.state.style));
              style.backgroundImage = 'url(' + v.largeUrl + ')';
              if (pics.length === 2 || pics.length === 4) {
                if(i % 2) {
                  style.marginRight = 0;
                }
              }else if (pics.length === 3 || pics.length === 5) {
                if (i === 2) {
                  style.marginRight = 0;
                }
              }else {
                if(((i + 1) % 3) === 0) {
                  style.marginRight = 0;
                }
              }
              return(
                <i key={'img_' + i} className='imageItem' style={style}></i>
              );
            }

          }, this)  : ''
        }
      </div>
    );
  }
}

