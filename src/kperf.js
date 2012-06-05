/*!
 * Koliseo KPerf Widget v1.0
 *
 * Copyright 2011 Nacho Coloma
 * Licensed under the MIT license.
 */

/**
  Displays a widget with a list of performances for a concrete show
  Requires: jquery
  Options:
    showId {String} the show ID (required)
    locale {String} the locale to use, default is the browser locale or "en" if none.
    dateFormat {String} the date format to use, default is the locale-specific default.
    maxEntries {number} the maximum number of entries to display, default 5.
    insertCss {boolean} insert automatically the stylesheet if not already present. Default true.
*/
(function($, w) {

  /**
    All locale-dependent entries
    You can specify new locales before loading this script. E.g.:
    window.Koliseo = {
      resources: {
        fr: {
          // entries go here
        }
      }
    };
  */
  var allResources = $.extend({
    en: {
      ticketsAvailable: 'tickets available',
      seeOther: 'see other dates',
      buy: 'Buy tickets',
      empty: 'No performances found',
      dateFormat: 'Ddd Mm* d*',
      weekDays: 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday',
      months: 'January February March April May June July August September October November December'
    },
    es: {
      ticketsAvailable: 'de entradas disponibles',
      seeOther: 'ver otras fechas',
      buy: 'Comprar',
      empty: 'No hay actuaciones disponibles',
      dateFormat: 'Ddd d* de Mm*',
      weekDays: 'Domingo Lunes Martes Miércoles Jueves Viernes Sábado',
      months: 'Enero Febrero Marzo Abril Mayo Junio Julio Agosto Septiembre Octubre Noviembre Diciembre'
    }
  }, w.Koliseo? w.Koliseo.resources : undefined);

  $.fn.kperf = function(opt) {

    var 

      /** the options provided by the user */
      options,

      /** i18n resources for the current locale */
      res,

      /** the widget container */
      $element = this,

      /** Transform 0-1 into 0-100 */
      toPercentage = function(value) {
        return +((value * 100).toFixed(0));
      },

      /** extract the date from a ISO8601 dateTime */
      extractDate = function(dateTimeStr) {
        return (/(.+)T/).exec(dateTimeStr)[1];
      },

      /** format a date to the current locale */
      formatDate = function (date, f) {
        var 
          nm = res.months.split(' ')[date.getMonth()],
          nd = res.weekDays.split(' ')[date.getDay()],
          padLeft = function(str) {
            str = String(str);
            var pad = "00";
            return pad.substring(0, pad.length - str.length) + str;
          };

        return f
          .replace(/yyyy/g, date.getFullYear())
          .replace(/yy/g, String(date.getFullYear()).substr(2,2))
          .replace(/MMM/g, nm.substr(0,3).toUpperCase())
          .replace(/Mmm/g, nm.substr(0,3))
          .replace(/MM\*/g, nm.toUpperCase())
          .replace(/Mm\*/g, nm)
          .replace(/mm/g, padLeft(date.getMonth()+1))
          .replace(/DDD/g, nd.substr(0,3).toUpperCase())
          .replace(/Ddd/g, nd.substr(0,3))
          .replace(/DD\*/g, nd.toUpperCase())
          .replace(/Dd\*/g, nd)
          .replace(/dd/g, padLeft(date.getDate()))
          .replace(/d\*/g, date.getDate());
      },

      /** Render the "buy" button */
      renderBuyButton = function() {
        $element.append('<div class="kbuttonbar"><a class="kbtn kprimary" href="' + options.showURL + '">' + res.buy + '</a></div>');
      },
      
      /** Render the provided list of performances */
      renderPerformances = function(performances) {
        var 
          html = '',
          perfByDateAndVenue = {},
          entriesCount = 0
        ;
        $.each(performances, function(i, performance) {
          id = extractDate(performance.dateTimeStr) + '-' + performance.venue.id;
          if (!perfByDateAndVenue[id] || perfByDateAndVenue[id].minprice > performance.minprice) {
            perfByDateAndVenue[id] = performance;
          } 
        });
        for (var id in perfByDateAndVenue) {
          if (perfByDateAndVenue.hasOwnProperty(id)) {
            if (entriesCount++ >= options.maxEntries) {
              break;
            }
            var 
              performance = perfByDateAndVenue[id],
              availableTickets = performance.totalTickets - performance.soldTickets,
              parts = /(\d+)-(\d+)-(\d+)/.exec(performance.dateTimeStr),
              pct = toPercentage(availableTickets / performance.totalTickets),
              ticketsClass = pct === 0? '' :
                pct < 20? 'ksoldout' :
                pct < 40? 'kscarce' :
                'kplenty'
              ;
            html += 
              '<li class="kperformance" title="' + pct + '% ' + res.ticketsAvailable + '">' +
                '<input type="radio" class="kradio" name="kperformance" value="' + performance.id + '">' + 
                  formatDate(new Date(parts[1], parts[2], parts[3]), options.dateFormat) + ' <b class="kprice">(' + performance.minPrice + ' ' + performance.currency + ')</b>' + 
                  '<span class="ktickets ' + ticketsClass + '" >' + 
                    availableTickets + '/' + performance.totalTickets  +
                  '</span>' + 
                '<span class="kvenue"><span class="kvenuename">' + performance.venue.name + '</span> <span class="kvenueaddr">' + performance.venue.address + '</span></span>' +
              '</li>'
              ;

          }
        }
        html = html || '<li class="kempty kperformance">' + res.empty + '</li>';
        $element.append('<ul class="kperformances">' + html + '</ul>');

        renderBuyButton();
        $element.append('<a class="kseeother" href="' + options.showURL + '">&raquo; ' + res.seeOther + '</a>');
      },

      /** insert kperf.css if not already present */
      insertStylesheet = function() {
        var url = $('script[src*="/kperf"]').attr('src');
        if (url) {
          url = url.replace('.js', '.css');
          $('link[href="' + url + '"]').length || $('head').append('<link rel="stylesheet" href="' + url + '">');
        }
      };

    if (!this.length)
      return;

    // initialize options with default values
    options = $.extend({
      hostname: 'www.koliseo.com',
      maxEntries: 5,
      insertCss: true
    }, this.data(), opt);

    if (!options.showId)
      throw new Error("options.showId is required");
    options.showURL = 'http://' + options.hostname + '/shows/' + options.showId;

    // initialize CSS
    options.insertCss && insertStylesheet();

    // initialize res
    var locale = options.locale;
    if (!locale) {
      var parts = /([^\-]{2})-.+/.exec(navigator.language || navigator.userLanguage || '');
      parts && (locale = parts[1]);
    }
    res = options.res || allResources[locale] || allResources.en;
    options.dateFormat = options.dateFormat || res.dateFormat;

    // get performances and render
    $element.addClass('kcontainer').html('');
    if ($.support.cors) {
      $element.addClass('kloading');
      $.ajax({
        url: options.showURL + '/performances',
        dataType: 'json',
        type: 'GET',
        success: function(performances) {
          $element.removeClass('kloading');
          renderPerformances(performances);
        },
        error: function(jqXHR, errorThrown) {
          $element.removeClass('kloading');
          console.error(errorThrown);
          renderBuyButton();
        }
      });
    } else {
      renderBuyButton();
    }

    // when user clicks the "buy" button, go to the selected performance or to the show page
    $element.on('click', '.kbtn', function(e) {
      var $radio = $element.find('.kradio:checked');
      if ($radio.length) {
        window.location.href = options.showURL + "/performance?performance=" + $radio.val();
        return false;
      }
    });
  };

  // initialize any .kcontainer element
  $('.kcontainer').kperf();

})(jQuery, window);