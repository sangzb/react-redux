export default function owlAdapter (config, con) {
  let $ = window.jQuery;
  let _config = config || {};
  let _con = $(con);
  let _default = {
    slideSpeed : 300,
    paginationSpeed : 400,
    items: 1,
    dots: true
  };

  function carouseled() {
    return _con.show().owlCarousel(Object.assign(_default, _config));
  }

  return {
    carousel: carouseled
  };
}