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
        total[key] = _r(value);
      },
      update_weight: function(w){
        weight = w;
      },
      total: function(){
        cif_total_eur = _.reduce(_.values(total), function(x, y){
          return x + y;}, 0);
        return cif_total_eur;
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

  // Compute the commission:
  // Input :
  //   - percentage: #commission-value
  //   - CIF value: CIF.status()
  // Description:
  //  Update #commission = percentage * CIF Value
  $('#commission_slider').slider({
    min: 0,
    value: 15,
    max: 100,
    slide: function(event, ui) {
      $('#commission_value').text(ui.value);
      var rate = $('#commission_value').text()/100;
      _update_view_with_all_currency('#commission', CIF.total() * rate);
    }
  });

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
    var g_weight = 1;
    var g_cif_total_eur = 0;

    var EurUsdCurrencyIntegrity = {
      func: function(){},
      compute_and_update_view: function(id){
        var cif_value_usd = XE.from_eur_to_usd(g_cif_total_eur);
        var value_output_usd = this.func(cif_value_usd);
        var value_output_eur = XE.from_usd_to_eur(value_output_usd);
        _update_view_with_all_currency(id, value_output_eur);
      },
    };

    function _obj_maker(f){
      return (function(){
        var o = Object.create(EurUsdCurrencyIntegrity);
        o.func = f
        return o;
        }())
    };

    var cif_dependent =
    [
      {
        'id': '#empadronamiento',
        'obj': _obj_maker(function(cif_value_usd){
          console.log('Computing Cert. de Empadronamiento...');
          var x = _p($('#table_empadronamiento').data('value'));
          console.log('The fix is: ' + x);
          console.log('Done!');
          console.log('-------------------------------');
          return x;
        })
      },
      {
        'id': '#timbre',
        'obj': _obj_maker(function(cif_value_usd){
          console.log('Computing Timbre Professional...');
          var x = _p($('#table_timbre').data('value'));
          console.log('The fix is: ' + x);
          console.log('Done!');
          console.log('-------------------------------');
          return x;
        })
      },
      {
        'id': '#guia',
        'obj': _obj_maker(function(cif_value_usd){
          console.log('Computing Guia de transito...');
          var x = _p($('#table_guia').data('value'));
          console.log('The fix is: ' + x);
          console.log('Done!');
          console.log('-------------------------------');
          return x;
        })
      },
      {
        'id': '#recargo',
        'obj': _obj_maker(function(cif_value_usd){
          console.log('Computing Recargo...');
          var rate = _p($('#table_recargo').data('value'));
          console.log('Rate is: ' + rate);
          var x = cif_value_usd * rate;
          console.log('CIF (' + _r(cif_value_usd) + ') * Recargo = USD '
              + _r(x));
          console.log('Done!');
          console.log('-------------------------------');
          return x;
        })
      },
      {
        'id': '#vat',
        'obj': _obj_maker(function(cif_value_usd){
          console.log('Computing VAT...');
          var vat = _p($('#table_iva').data('iva')) +
            _p($('#table_ant_iva').data('ant_iva'));
          console.log('Rate is: ' + vat);
          var vat_usd = cif_value_usd * vat;
          console.log('CIF (' + _r(cif_value_usd) + ') * VAT = USD ' + _r(vat_usd));
          console.log('Done!');
          console.log('-------------------------------');
          return vat_usd;
        })
      },
      {
        'id': '#extrao',
        'obj': _obj_maker(function(cif_value_usd){
          console.log('Computing Extraordinarios Tax...');
          console.log('Lookup CIF value ('+ _r(cif_value_usd) +') in table...');
          var x = _table_lookup('#table_extrao', cif_value_usd);
          console.log('Done!');
          console.log('-------------------------------');
          return x;
        })
      },
      {
        'id': '#puerto',
        'obj': _obj_maker(function(cif_value_usd){
          var weight = g_weight;
          console.log('Computing Puerto Tax...');
          console.log('CIF: USD ' + _r(cif_value_usd));
          console.log('Weight: Ton ' + weight);
          var ratio = cif_value_usd / weight;
          console.log('Ratio : CIF / Weight = ' + _r(ratio));
          var multiplicator = (function(ratio){
            console.log('Lookup ratio ('+ _r(ratio) +') in Puerto table for multiplicator...');
            return _table_lookup('#table_puerto', ratio);
          }(ratio)); //lookup in table based on the ratio

          // TODO : Add the Lei de estiba in model
          var ley = cif_value_usd * 0.25 / 100;
          var x = weight * multiplicator;
          console.log('Ley de estiba : ' + _r(cif_value_usd) + ' * 0.25 / 100 = USD ' + _r(ley));
          console.log('Puerto tax : ' + weight + ' * ' + multiplicator + ' = USD ' + _r(x));
          console.log('Total Puerto tax and ley de estiba = USD ' + _r((x + ley)));
          console.log('Done!');
          console.log('-------------------------------');
          return x + ley;
        })
      },
      {
        'id': '#despachante',
        'obj': _obj_maker(function(cif_value_usd){
          // Fix price in USD
          console.log('Computing Despachante fee...');
          console.log('CIF: USD ' + _r(cif_value_usd));
          var gastos = $('#despa_gastos').data('despa_gastos')
          console.log('Lookup CIF value ('+ _r(cif_value_usd) +') in table...');
          var commission = (function(cif_value){
            return cif_value * _table_lookup('#table_despachante', cif_value) / 100;
          }(cif_value_usd));
          var total = _r(commission) + _r(gastos);
          console.log('Total: commission ('+ _r(commission)
                +') + gastos ('+ gastos +') = USD ' + _r(total));
          console.log('Done!');
          console.log('-------------------------------');
          return total;
        })
      },
      {
        'id': '#tsa',
        'obj': _obj_maker(function(cif_value_usd){
          console.log('Computing TSA tax...');
          console.log('Lookup CIF value ('+ _r(cif_value_usd) +') in table...');
          var x = _table_lookup('#table_tsa', cif_value_usd).split(':');
          var result;
          console.log('Checking if rate or fix should be applied...');
          if (x[0] != 0){
            result = cif_value_usd * x[0] / 100;
            console.log('Total [rate]: ('+ _r(cif_value_usd)
                +') * rate ('+ x[0] +') = USD ' + _r(result));
          } else {
            result = _r(x[1]);
            console.log('Total [fix]: USD ' + _r(result));
          }
          console.log('Done!');
          console.log('-------------------------------');
          return result;
        })
      }
    ];

    function _table_lookup(id, value){
      var result;
      $.each($(id + ' tr'), function(){
        if ($(this).data("low") < value && value < $(this).data("up")){
          result = $(this).data("value");
          console.log('Value found : ' + result);
        };
      });
      return result;
    };

    return {
      compute_and_update_view: function(cif_total_eur, weight){
        g_cif_total_eur = cif_total_eur;
        g_weight = weight;
        var l = cif_dependent.length;
        for(var i = 0; i < l; i++){
          var id = cif_dependent[i]['id'];
          cif_dependent[i].obj.compute_and_update_view(id);
        }
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

    $(id + ' :input[name="eur"]').val(_r(eur_value));
    $(id + ' :input[name="usd"]').val(_r(usd_value));
    $(id + ' :input[name="uyu"]').val(_r(uyu_value));
  };

  function _p(x){
    return parseFloat(x)
  };

  function _r(x) {
    return Math.round(x)
  };

});// end of document ready
