import React from 'react';
import PropTypes from 'prop-types';

export default class Bundle extends React.Component {
  constructor (props, context) {
    super(props, context);
    this.state = {
      mod: null
    };
  }

  componentWillMount () {
    this.load(this.props);
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps);
    }
  }

  load (props) {
    this.setState({
      mod: null
    });
    props.load((mod) => {
      this.setState({
        // handle both es imports and cjs
        mod: mod['default'] ? mod['default'] : mod
      });
    });
  }

  render () {
    if (!this.state.mod) {
      return false;
    } else {
      return this.props.children(this.state.mod);
    }
  }
}

Bundle.propTypes = {
  load: PropTypes.bool,
  children: PropTypes.object
};