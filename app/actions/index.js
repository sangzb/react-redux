import apiAction from './apiAction' ;
const APIURI = (process.env.NODE_ENV === 'development' ? 'http://45.77.22.206/api/' : 'http://45.77.22.206/api/');

//temp
export const toptop = apiAction({
  method: 'post',
  url: `${APIURI}discussion/517/top`,
  state: 'TOP_TOP_TOP',
  formatter: 'backfire'
});