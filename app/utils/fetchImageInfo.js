export default function fetchImageInfo (fileUrl) {
  return new Promise(function (resolve) {
    let image = new Image();
    image.src = fileUrl;
    image.onload = function () {
      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight
      });
    };

    image.onabort = image.onerror = function () {
      resolve({ width: 0, height: 0 });
    };
  });
}
