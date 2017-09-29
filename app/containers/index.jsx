import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { createSelector } from 'reselect';
import jQuery from 'jquery';

class IndexPage extends React.Component {
  constructor (props, context) {
    super(props, context);
    this.state = {};
    console.log(jQuery('body').animate);
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
