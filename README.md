koliseo-widgets
===============

A collection of widgets that use the Koliseo API.

KPerf
=====

KPerf displays a list of scheduled performances for a show. 

<img src="https://github.com/icoloma/koliseo-oss/raw/master/screenshot.png" alt="Screenshot of KPerf in action">

To use, add the following at the end of your web page (before the ending <code>&lt;/body></code> tag):

```html
<!-- KPerf requires jQuery. If your web page already has jQuery present, you may omit this first line. -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script src="http://www.koliseo.com/w/kperf/1.0/kperf.min.js"></script>
```

Now put this where you want the widget to appear:

```html
<div class="kcontainer" data-show-id="Dfe"></div>
```

Parameters
==========

KPerf can receive parameters as <code>data-*</code> attributes of the container DOM element:

* **showId** (string) the show ID, extracted from the Koliseo URL <code>/shows/{showId}/{showName}</code>. This attribute is required.
* **locale** (string) the two-letter acronym of the locale to use. The default is the browser locale or <code>en</code> if none.
* **dateFormat** (string) the date format. The default is locale-specific.
* **maxEntries** (number) the maximum number of entries to display. The default is 5.
* **insertCss** (boolean) By default <code>kperf.css</code> will be inserted to <code>&lt;head></code> if it is not already present. Set this to false if you plan to provide your own styles somewhere else.

Only <code>showId</code> is required. An example using all parameters:

```html
<div class="kcontainer" 
	data-show-id="Dfe" 
	data-locale="es" 
	data-date-format="Ddd Mm* d*" 
	data-max-entries="10" 
	data-insert-css="false">
</div>
```

Using KPerf as a jQuery plugin
==============================

KPerf is also a jQuery plugin that can also be initialized using standard JavaScript syntax:

```javascript
$('#my-container').kperf({
	showId: 'xDE5',
	locale: 'es',
	dateFormat: $('#my-container').width() < 200? 'dd/mm' : 'Ddd Mm* d*'
});
```

Locales
=======

The widget is automatically set to use the browser locale, unless otherwise specified using the <code>locale</code> option. The widget supports the same set of locales as the Koliseo website, and will default to <code>en</code> if a locale is not supported.

You can add new locales by setting a global Koliseo.resources variable before including <code>kperf.js</code>:

```javascript
window.Koliseo = window.Koliseo || {};
Koliseo.resources = {
	it: {
	  ticketsAvailable: 'biglietti disponibili',
      seeOther: 'vedi altre date',
      buy: 'Compra',
      empty: 'Nessuno spettacolo trovato',
      dateFormat: 'Ddd Mm* d*',
      weekDays: 'Domenica Lunedì Martedì Mercoledì Giovedì Venerdì Sabato',
      months: 'Gennaio Febbraio Marzo Aprile Maggio Giugno Luglio Agosto Settembre Ottobre Novembre Dicembre'
	}
};
```

License
=======

These widgets are released under the (http://en.wikipedia.org/wiki/MIT_License)(MIT) license. You may modify these widgets and include them in your own commercial, closed-source projects as long as the copyright header is left intact.
