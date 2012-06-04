/**
	Displays a widget with a list of performances for a concrete show
	Requires: jquery, underscore
*/
(function($) {

	var 

	/** the options provided by the user */
	options,

	/** the jQuery container where the HTML will be inserted */
	$element,

	/** Transform 0-1 into 0-100 */
	toPercentage = function(value) {
		return +((value * 100).toFixed(0));
	},

	/** extract the date from a ISO8601 dateTime */
	extractDate = function(dateTimeStr) {
		return /(.+)T/.exec(dateTimeStr)[1]
	},

	/** Render the button to buy */
	renderBuyButton = function() {
		$element.append('<div class="kbuttonbar"><a class="kbtn kprimary" href="' + options.showURL + '">' + options.res.buy + '</a></div>');
	},
	
	/** Render the provided list of performances and the button to buy */
	renderPerformances = function(performances) {
		var 
			html = '',
			perfByDateAndVenue = {},
			entriesCount = 0,
			id
		;
		$.each(performances, function(i, performance) {
			id = extractDate(performance.dateTimeStr) + '-' + performance.venue.id;
			if (!perfByDateAndVenue[id] || perfByDateAndVenue[id].minprice > performance.minprice) {
				perfByDateAndVenue[id] = performance;
			} 
		});
		for (id in perfByDateAndVenue) {
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
					'<li class="kperformance" title="' + pct + '% ' + options.res.ticketsAvailable + '">' +
						'<input type="radio" class="kradio" name="kperformance" value="' + performance.id + '">' + 
							options.dateToString(parts) + ' <b class="kprice">(' + performance.minPrice + ' ' + performance.currency + ')</b>' + 
							'<span class="ktickets ' + ticketsClass + '" >' + 
								availableTickets + '/' + performance.totalTickets  +
							'</span>' + 
						'<span class="kvenue"><span class="kvenuename">' + performance.venue.name + '</span> <span class="kvenueaddr">' + performance.venue.address + '</span></span>' +
					'</li>'
					;

			}
		}
		if (!performances.length)
			html = '<li class="kempty kperformance">' + options.res.empty + '</li>';
		$element.html('<ul class="kperformances">' + html + '</ul>');

		console.log(performances);
		renderBuyButton();
		$element.append('<a class="kseeother" href="' + options.showURL + '">&raquo; ' + options.res.seeOther + '</a>')
	}
	;

	/**
		options.showId {String} the show ID
		options.hostname {String} the host name, default www.koliseo.com
	*/
	$.fn.perfw = function(opt) {
		$element = this;
		if (!opt.showId)
			throw new Error("options.showId is required");
		options = $.extend({
			hostname: 'www.koliseo.com',
			dateToString: function(date) {
				return parts[1] + '-' + parts[2] + '-' + parts[3];
			},
			maxEntries: 5,
			res: $.extend({
				ticketsAvailable: 'tickets available',
				seeOther: 'see other dates',
				buy: 'Buy tickets',
				empty: 'No performances found'
			}, opt? opt.res : null)
		}, opt);
		options.showURL = 'http://' + options.hostname + '/shows/' + options.showId;

		$element.addClass('kcontainer');
		if ($.support.cors) {
			$.ajax({
				url: options.showURL + '/performances',
				dataType: 'json',
				type: 'GET',
				success: function(performances) {
					renderPerformances(performances);
				},
				error: function(jqXHR, errorThrown) {
					console.error(errorThrown);
					renderBuyButton();
				}
			});
		} else {
			renderBuyButton();
		}
		$element.on('click', '.kbtn', function(e) {
			var $radio = $element.find('.kradio:checked');
			if ($radio.length) {
				window.location.href = options.showURL + "/performance?performance=" + $radio.val()
				return false;
			}
		});
	}

})(jQuery);