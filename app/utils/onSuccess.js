export default function(callback) {
  return function onSuccess(data) {
    if (data && data.status >= 0 && data.status <= 1) {
      if (typeof callback === 'function') return callback(data);
    }
  };
}
