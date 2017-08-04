import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { createSelector } from 'reselect';

class IndexPage extends React.Component {
  constructor (props, context) {
    super(props, context);
    this.state = {};
  }

  render () {
    return (
      <div>index pavge</div>
    );
  }
}

const tagsSelector = function tagsSelectorName (state) {
  return state.tagsPage;
};

const ContentPageSelector = createSelector(
  [tagsSelector],
  (tags) => (
    { tags }
  )
);

export default connect(ContentPageSelector)(withRouter(IndexPage));
