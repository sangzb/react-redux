export default function(location) {
  let _l = location || window.location;
  let type = 'question';
  let pathname = _l.pathname;
  if (pathname.indexOf('complaint') > 0) {
    type = 'complaint';
  }else if (pathname.indexOf('friend') > 0) {
    type = 'friend';
  }else if (pathname.indexOf('idle') > 0) {
    type = 'idle';
  }
  return type;
}