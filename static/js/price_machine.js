$(document).ready(function(){

  // Module variable
  var XE = (function(){
    // AP ID: 1bc44a86ebb244dcad64ceb38d56847f
    var currency = {
      'usd_usd': 0,
      'usd_eur': 0,
      'usd_uyu': 0,
    };

    return {
      init: function(){
        $.getJSON('/static/js/latest.json', function(data){
          currency.usd_usd = data.rates.USD;
          currency.usd_eur = data.rates.EUR;
          currency.usd_uyu = data.rates.UYU;
          // Update view
          $('#ex_usd').val(currency.usd_usd);
          $('#ex_eur').val(currency.usd_eur);
          $('#ex_uyu').val(currency.usd_uyu);
        });
      },
      rate: function(cur){
        return currency[cur];
      },
      from_eur_to_usd: function(eur_value){
        return eur_value / currency['usd_eur'];
      },
      from_usd_to_eur: function(usd_value){
        return usd_value * currency['usd_eur'];
      },
      from_eur_to_uyu: function(eur_value){
        return eur_value / currency['usd_eur'] * currency['usd_uyu'];
      }
    };
  }());

  XE.init();

  var CIF = (function(){
    // Every calculation that use the CIF in Uruguay should
    // be made with USD
    var weight = 1;
    var total = {
      'purchase': 0,
      'transport': 0,
      'inspection': 0,
    };

    return {
      plus: function(key, value){
        total[key] = Math.round(value);
      },
      update_weight: function(w){
        weight = w;
      },
      status: function(){
        // And update the differente value depending on CIF, ie Despachante.
        cif_total_eur = _.reduce(_.values(total), function(x, y){
          return x + y;}, 0);
        CIFFunctions().compute_and_update_view(cif_total_eur, weight);
        return cif_total_eur;
      }
    };

  }());

  /*
   * Collect information from the user to create CIF
   * Start of price simulation
   */

  $('#input_price').change(function(){
    // Retrieving purchase price
    var purchase_price = $(this).val();
    _update_view_with_all_currency('#purchase_price', purchase_price);
    CIF.plus('purchase', purchase_price);
    _update_view_with_all_currency('#cif', CIF.status());
  });// end of change function

  $('#select_machine').change(function(){
    // Compute transport price based on machine selection
    var $machine_id = $(this).val();
    var length = $('#' + $machine_id + ' td[name="length"]').data("length");
    var width = $('#' + $machine_id + ' td[name="width"]').data("width");
    var weight = $('#' + $machine_id + ' td[name="weight"]').data("weight");

    var base_price = $('#table_price_mvd').data("base_price");
    var transport_price = (function compute_price_transport(price, length, width){
        var base_price = price * length;
        var extra = 0;
        if (width > 2.5){
            extra = Math.ceil((width - 2.5) / 0.25) * 0.1 * base_price;
        }
        return base_price + extra;
      }(base_price, length, width));

    _update_view_with_all_currency('#transport', transport_price);
    CIF.plus('transport', transport_price);
    CIF.update_weight(weight);
    _update_view_with_all_currency('#cif', CIF.status());
  }); // end of change function

  $('#select_inspection').change(function(){
    // Check if inspection has been required
    var price_inspection = 0;
    if ($(this).is(':checked')){
      inspection_price = $('#table_inspection').data('inspection');
      $('#note-inspection').html(
          '<strong>Adding:</strong> EUR ' + inspection_price
      );
      CIF.plus('inspection', inspection_price);
      _update_view_with_all_currency('#cif', CIF.status());
    } else {
      inspection_price = 0;
      $('#note-inspection').html('');
      CIF.plus('inspection', inspection_price);
      _update_view_with_all_currency('#cif', CIF.status());
    }
  });

  /*
   * The following functions are called at every CIF update
   */

  var CIFFunctions = function(){

    var Compute_with_CIF_UpdateView = {
      func: function(){},
    // compute_and_update_view: function(id, cif_value_eur){
      compute_and_update_view: function(){
        var cif_value_usd = XE.from_eur_to_usd(arguments[1]);
        var value_output_usd = this.func(cif_value_usd, arguments);
        var value_output_eur = XE.from_usd_to_eur(value_output_usd);
        _update_view_with_all_currency(arguments[0], value_output_eur);
      },
    };

    var tas = Object.create(Compute_with_CIF_UpdateView);
    var vat = Object.create(Compute_with_CIF_UpdateView);
    var despachante = Object.create(Compute_with_CIF_UpdateView);
    var puerto = Object.create(Compute_with_CIF_UpdateView);
    var extrao = Object.create(Compute_with_CIF_UpdateView);

    extrao.func = function(cif_value_usd, args){
      console.log('pass');
    };

    puerto.func = function(cif_value_usd, args){
      weight = args[2];
      console.log('Compute Puerto Tax...');
      console.log('CIF: USD ' + Math.round(cif_value_usd));
      console.log('Weight: Ton ' + weight);
      var ratio = cif_value_usd / weight;
      console.log('Ratio : CIF / Weight = ' + Math.round(ratio));
      var multiplicator = (function(ratio){
        console.log('Lookup ratio ('+ Math.round(ratio) +') in Puerto table for multiplicator...');
        var result;
        $.each($('#table_puerto tr'), function(){
          if ($(this).data("ratio_low") < ratio && ratio < $(this).data("ratio_up")){
            result = $(this).data("multiplicator");
            console.log('The multiplicator to apply is : ' + result);
          };
        });
        return result;
      }(ratio)); //lookup in table based on the ratio

      // TODO : Add the Lei de estiba in model
      var ley = cif_value_usd * 0.25 / 100;
      var x = weight * multiplicator;
      console.log('Ley de estiba : ' + Math.round(cif_value_usd) + ' * 0.25 / 100 = USD ' + Math.round(ley));
      console.log('Puerto tax : ' + weight + ' * ' + multiplicator + ' = USD ' + Math.round(x));
      console.log('Total Puerto tax and ley de estiba = USD ' + Math.round((x + ley)));
      console.log('Done!');
      console.log('-------------------------------');
      return x + ley;
    };

    despachante.func = function(cif_value_usd){
      // Fix price in USD
      var gastos = $('#despa_gastos').data('despa_gastos')
      var commission = (function(cif_value){
        var result;
        $.each($('#table_despachante tr'), function(){
          if ($(this).data("low") < cif_value && cif_value < $(this).data("up")){
            result = cif_value * $(this).data("percentage") / 100;
          };
        });
        return result;
      }(cif_value_usd));

      return commission + gastos
    };

    vat.func = function(cif_value_usd){
      var vat = parseFloat($('#table_iva').data('iva')) +
        parseFloat($('#table_ant_iva').data('ant_iva'));
      return vat_usd = cif_value_usd * vat;
    };

    tas.func = function(cif_value_usd){
      return cif_value_usd;
    };

    return {
      compute_and_update_view : function(){
        cif_total_eur = arguments[0];
        weight = typeof arguments[1] === 'number' ? arguments[1] : 1;
        puerto.compute_and_update_view('#puerto', cif_total_eur, weight);
        despachante.compute_and_update_view('#despachante', cif_total_eur);
        vat.compute_and_update_view('#vat', cif_total_eur);
        tas.compute_and_update_view('#tas', cif_total_eur);
      }
    };
  };
  /*
   * helper functions
   */

  function _update_view_with_all_currency(id, eur_value){
    // Because I am retrieving the information with USD Base
    // I have to convert the value to USD before computing the UYU
    // I keep the USD value based because it is easier to everyone
    // to check its currency
    //
    // Condition:
    // Value of eur_value should be in EUR
    usd_value = XE.from_eur_to_usd(eur_value);
    uyu_value = XE.from_eur_to_uyu(eur_value);

    $(id + ' :input[name="eur"]').val(Math.round(eur_value));
    $(id + ' :input[name="usd"]').val(Math.round(usd_value));
    $(id + ' :input[name="uyu"]').val(Math.round(uyu_value));
  };
});// end of document ready
