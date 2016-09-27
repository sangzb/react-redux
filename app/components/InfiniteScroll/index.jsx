import React from 'react';
import ReactDom from 'react-dom';

const InfiniteScroll = React.createClass({
  getDefaultProps() {
    return {
      className: '',
      containerHeight: 500,
      useWindowAsScrollContainer: false,
      loadingSpinnerDelegate: (
        <div className='center loading-more-indicator'>
          <i className='fa fa-spin fa-spinner'></i>
          Loading more ...
        </div>
      ),
      isInfiniteLoading: false,
      onInfiniteLoad: function() {},
      infiniteLoadBeginEdgeOffset: 0
    };
  },

  domNode: null,
  componentUnmounted: false,

  componentWillReceiveProps(props) {
    const { prevIsInfiniteLoading } = this.props;
    const { isInfiniteLoading } = props;
    if (isInfiniteLoading != null && prevIsInfiniteLoading != isInfiniteLoading) {
      this.setState({ isInfiniteLoading });
    }
  },

  componentDidMount() {
    // 初始化元素
    this.getNode();
    const { useWindowAsScrollContainer } = this.props;
    if (useWindowAsScrollContainer) this.attachEvent();
  },

  attachEvent() {
    window.addEventListener('scroll', this.handleScroll);
  },

  detatchEvent() {
    window.removeEventListener('scroll', this.handleScroll);
  },

  buildStyle() {
    const { containerHeight, useWindowAsScrollContainer } = this.props;
    if (useWindowAsScrollContainer) return {};
    return {
      height: `${containerHeight}px`,
      overflowX: 'hidden',
      overflowY: 'scroll',
      WebkitOverflowScrolling: 'touch'
    };
  },

  noop() {},

  render() {
    const { className, children, loadingSpinnerDelegate, useWindowAsScrollContainer } = this.props;
    const { isInfiniteLoading } = this.state || {};

    return (
      <div style={ this.buildStyle() }
           onScroll={ useWindowAsScrollContainer ? this.noop : this.handleScroll }
           className={ className } >
        <div ref='infiniteScrollElement' className='infinite-scroll-element'>
          { children }
          <div>
            { loadingSpinnerDelegate }
          </div>
        </div>
      </div>
    );
  },

  scrollTop() {
    const { useWindowAsScrollContainer } = this.props;
    let el = this.getNode();

    if (useWindowAsScrollContainer) {
      let scrollTop = window.pageYOffset != undefined ?
                      window.pageYOffset :
                      (document.documentElement || document.body.parentNode || document.body).scrollTop || 0;
      if (el) {
        return (-el.getBoundingClientRect().top);
      } else {
        return scrollTop;
      }
    } else {
      if (el && el.parentNode) return el.parentNode.scrollTop;
      return 0;
    }
  },

  shouldHandleScroll() {
    if (this.isComponentUnmounted) return false;
    const { isInfiniteLoading, infiniteLoadBeginEdgeOffset } = this.props;
    if (isInfiniteLoading) return false;
    if (!infiniteLoadBeginEdgeOffset) return false;
    return true;
  },

  getContainerHeight() {
    if (this.containerHeight) return this.containerHeight || 0;
    const { containerHeight, useWindowAsScrollContainer } = this.props;
    if (useWindowAsScrollContainer) {
      this.containerHeight = window.innerHeight;
    } else {
      this.containerHeight = containerHeight;
    }
    return this.containerHeight || 0;
  },

  getLowestPossibleScrollTop() {
    let offsetHeight = this.getNode() ? this.getNode().offsetHeight : 0;
    return offsetHeight - this.scrollTop() - this.getContainerHeight();
  },

  passedEdgeForInfiniteScroll() {
    const { infiniteLoadBeginEdgeOffset } = this.props;
    if (this.getLowestPossibleScrollTop() < infiniteLoadBeginEdgeOffset) return true;
  },

  handleInfiniteLoad() {
    const { onInfiniteLoad } = this.props;
    const { isInfiniteLoading } = this.state || {};
    if (isInfiniteLoading !== true) this.setState({ isInfiniteLoading: true });
    onInfiniteLoad();
  },

  handleScroll() {
    if (!this.shouldHandleScroll()) return;
    const { isInfiniteLoading } = this.state || {};
    if (this.passedEdgeForInfiniteScroll() && !isInfiniteLoading) {
      this.handleInfiniteLoad();
    }
  },

  getNode() {
    if (this.domNode) return this.domNode;
    if (!this.domNode) this.domNode = ReactDom.findDOMNode(this.refs.infiniteScrollElement);
    return this.domNode;
  },

  componentWillUnmount() {
    this.componentUnmounted = true;
    this.detatchEvent();
  }
});

export default InfiniteScroll;
