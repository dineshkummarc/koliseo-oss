koliseo-widgets
===============

A collection of widgets that use the Koliseo API.

KPerf
=====

KPerf displays the scheduled performances for the specified show. To use, just add the following at the end of your web page (before the ending <code>&lt;/body></code> tag):

```html
<!-- KPerf requires jQuery. If your web page already has jQuery present, you may omit this first line. -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script src="http://www.koliseo.com/w/kperf/1.0/kperf.min.js"></script>
```

KPerf will display the widget inside any container with <code>class=kcontainer</code>. For example:

```html
<aside class="kcontainer" data-show-id="Dfe"></aside>
```

Parameters
==========

KPerf can receive any parameters as <code>data-*</code> attributes in the container DOM element. The supported attributes are:

* **showId** (string) the show ID, extracted from the show URL <code>/shows/{showId}/{showName}</code>. This attribute is required.
* **locale** (string) the two-letter acronym of the locale to use. The default is the browser locale or <code>en</code> if none.
* **dateFormat** (string) the date format to use. The default is locale-specific.
* **maxEntries** (number) the maximum number of entries to display. The default is 5.
* **insertCss** (boolean) By default kperf will insert automatically kperf.css if it is not already present. Set this to false if you plan to provide your own styles somewhere else.

Only showId is required. An example using all parameters:

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

KPerf is a jQuery plugin that can also be initialized using standard JavaScript syntax:

```javascript
$('#my-container').kperf({
	showId: 'xDE5',
	locale: 'es',
	dateFormat: $('#my-container').width() < 200? 'dd/mm' : 'Ddd Mm* d*'
});
```

Locales
=======

The widget locale is automatically set to the browser locale, unless otherwise specified using the <code>locale</code> option. The widget supports the same set of locales as the Koliseo website, and will default to <code>en</code> if a locale is not supported.

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

These widgets are released under the (http://en.wikipedia.org/wiki/MIT_License)(MIT) license. You may modify these widgets and include them in your own commercial, non-open-source projects as long as the copyright header is left intact.
