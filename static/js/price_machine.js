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
    var weight = 8;
    var total = {
      'purchase': 0,
      'transport': 0,
      'inspection': 0,
    };

    return {
      plus: function(key, value){
        total[key] = Math.round(value);
      },
      status: function(){
        // And update the differente value depending on CIF, ie Despachante.
        cif_total_eur = _.reduce(_.values(total), function(x, y){
          return x + y;}, 0);
        compute_puerto_and_update_view(cif_total_eur, weight);
        compute_despachante_and_update_view(cif_total_eur);
        return cif_total_eur;
      }
    };
  }());

  // Start of price simulation
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

  function compute_puerto_and_update_view(cif_value_eur, weight){
    var cif_value_usd = XE.from_eur_to_usd(cif_value_eur);
    var ratio = cif_value_usd / weight;
    var multiplicator = (function(ratio){
      var result;
      $.each($('#table_puerto tr'), function(){
        if ($(this).data("ratio_low") < ratio && ratio < $(this).data("ratio_up")){
          result = $(this).data("multiplicator");
        };
      });
      return result;
    }(ratio)); //lookup in table based on the ratio

    _update_view_with_all_currency('#puerto',
        XE.from_usd_to_eur(weight * multiplicator));
  };

  function compute_despachante_and_update_view(cif_value_eur){
    // convert the EUR to USD
    var gastos_usd = $('#despa_gastos').data('despa_gastos')
    var gastos_eur = XE.from_usd_to_eur(gastos_usd);

    var cif_value_usd = XE.from_eur_to_usd(cif_value_eur);
    // convert back to EUR for display
    var commission = (function compute_desp_commission(cif_value){
      var result;
      $.each($('#table_despachante tr'), function(){
        if ($(this).data("low") < cif_value && cif_value < $(this).data("up")){
          result = cif_value * $(this).data("percentage") / 100;
        };
      });
      return result;
    }(cif_value_usd));
    var com_eur = XE.from_usd_to_eur(commission);

    _update_view_with_all_currency('#despachante', com_eur + gastos_eur);
  };


  // helper function
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
