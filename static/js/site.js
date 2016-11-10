var FormSliders = function () {
    return {
        //Form Sliders
      initFormSliders: function () {
         // Regular slider
         $('#commission').slider({
          min: 0,
          max: 100,
          slide: function(event, ui)
          {
            $('#commission-value').text(ui.value);
          }
        });
      }
    };
}();
