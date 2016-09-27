import './style.scss';
import React from 'react';
import { getCarousel } from '../../actions/index.js';
import store from '../../store';
import { owlAdapter, CookieStore } from '../../utils';

let $ = window.jQuery;
export default class HeadCarousel extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { error: false, show: true };
  }

  componentWillMount() {
    const { dispatch } = store;
    let that = this;
    dispatch(getCarousel()).then(function(data) {
      if (data.status === 0) {
        let version = CookieStore.get('carouselVersion');
        let custom = CookieStore.get('carouselCustom');
        CookieStore.set('carouselVersion', data.metadata.version);
        if (data.metadata.version.toString() !== version){
          that.setState({ error: false, show: true, data: data.data });
          setTimeout(function() {
            owlAdapter({}, $('#HeadCarousel')).carousel();
          }, 500);
        }else{
          if (custom === 'true') {
            that.setState({ error: false, show: false });
          }else{
            that.setState({ error: false, show: true, data: data.data });
            setTimeout(function() {
              owlAdapter({}, $('#HeadCarousel')).carousel();
            }, 500);
          }
        }
      }else {
        that.setState({ error: true, show: false });
      }
    }).catch(function(err) {
      that.setState({ error: true, show: false });
    });
  }

  closeCarousel() {
    CookieStore.set('carouselCustom', true);
    this.setState({ error: false, show: false });
  }
  
  render() {
    let ch = $('.carouselCon').height();
    let cw = document.documentElement.clientWidth;
    return(
      <div className={'carouselCon ' + (this.state.error || this.state.show === false ? 'hide' : '')}
           ref='carouselcon' >
        <i className='close' onTouchEnd={this.closeCarousel.bind(this) }></i>
        {
          this.state.error || this.state.show === false ?
            ''
             :
            <div id='HeadCarousel' className='owl-carousel owl-theme'>
              {
                (this.state.data && this.state.data.length) ?
                  this.state.data.map(function(v, i) {
                    return (
                      <div key={'headcarousel_' + i} className='item' style={{ height: ch, width: cw }}>
                        <div className='carouselItem' style={{ backgroundImage: `url('${v.image.thumb}')`}}>
                          <a href={v.link} target='_blank' ></a>
                        </div>
                      </div>
                    );
                  })
                 :
                  ''
              }
            </div>
        }
      </div>
    );
  }
}