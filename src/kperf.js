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
		return (value * 100).toFixed(2);
	},

	/** extract the date from a ISO8601 dateTime */
	extractDate = function(dateTimeStr) {
		return /(.+)T/.exec(dateTimeStr)[1]
	},
	
	/** HTML for available tickets */
	formatAvailable = function(json) {
		var 
			availableTickets = json.totalTickets - json.soldTickets,
			pct = toPercentage(availableTickets / json.totalTickets);
		json = $.extend({
			availableTickets: availableTickets,
			percentage: pct,
			ticketsClass: +pct === 0? '' :
				pct < 20? 'ksoldout' :
				pct < 40? 'kscarce' :
				'kplenty'
		}, json);
		return '<span class="ktickets ' + json.ticketsClass + '">' + json.availableTickets + '/' + json.totalTickets + ' (' + json.percentage + '%)</span>';
	},

	/** Render the button to buy */
	renderBuyButton = function() {
		$element.append('<a class="kbtn kprimary" href="http://' + options.hostname + '/shows/' + options.showId + '/performances">Buy tickets</a>');
	},
	
	/** Render the provided list of performances and the button to buy */
	renderPerformances = function(performances) {
		var 
			html = '',
			perfByDateAndVenue = {}
		;
		for (var i = 0; i < performances.length; i++) {
			var 
				performance = performances[i],
				id = performance.venue.id + '-' + extractDate(performance.dateTimeStr)
			;
			if (!perfByDateAndVenue[id] || perfByDateAndVenue[id].minprice > performance.minprice) {
				perfByDateAndVenue[id] = performance;
			} 
		}
		for (var i in perfByDateAndVenue) {
			if (perfByDateAndVenue.hasOwnProperty(i)) {
				html += 
					'<li class="kperformance">' +
						'<input type="radio" class="kradio" name="performance" value="' + performance.id + '">' + 
						performance.venue.name + ' ' + performance.minprice + performance.currency + ' ' + i +
						formatAvailable(performance) + 
						'<span class="kaddr">' + performance.venue.address + '</span>' +
					'</li>'
					;

			}
		}
		$element.html('<ul class="kperformances">' + html + '</ul>');

		console.log(performances);
		renderBuyButton();
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
			hostname: 'www.koliseo.com'
		}, opt);

		$element.addClass('kcontainer');
		if ($.support.cors) {
			$.ajax({
				url: 'http://' + options.hostname + '/shows/' + options.showId + '/performances',
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
	}

})(jQuery);