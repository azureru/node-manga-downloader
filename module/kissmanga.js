var	async    = require('async'),
	request  = require('request'),
	string   = require('../utility/string.js'),
	urlParse = require('url'),
	cheerioFetch  = require('../utility/cheerio_fetch.js');
	jsdomFetch    = require('../utility/jsdom_fetch.js');

function KissManga() {

	/**
	 * To parse main manga page and return json structure
	 * e.g. http://kissmanga.com/Manga/01-OKU-Hiroya
	 */
	this.parseMainMangaPage = function(url, resultCallback) {
		// create a structure first (so the output is sorted like this structure)
		var result = {
			'title':'',
			'image':'',
			'url'  : '',
			'attributes' : {},
			'volumes':[]
		};
		cheerioFetch.fetch(url+'/?confirm=yes', function(error, $){
			if (!error) {
				try {
					// basic prop
					result.title = $('#leftside div.barTitle').text().replace('information','').replace('Chapters','').fulltrim();
					result.image = $('div.rightBox div.barContent img').attr('src')
					result.url   = url;

					// attributes matching
					var attrs = $('.barContent div p');
					attrs.map(function(j, li){
						var content = $(li).text().fulltrim();
						var attrs = content.match(/([^<]*)\s*\:\s*([^<]*)/);
						if (attrs != null) {
							if (attrs.length > 2) {
								result.attributes[attrs[1].fulltrim()] = attrs[2];
							}
						}									
					});

					// chapter list matching
					var elements = $('table.listing td a');
					elements.map(function(i,el) {
						var itemUrl = $(el).attr('href');
						var parsed = urlParse.parse(url);
						result.volumes.push({
							'idx': elements.length - i,
							'url': parsed.protocol + '//' + parsed.host + itemUrl
						});						
					});		

					// sort the chapters ASC since kissmanga sort it DESC by default
					result.volumes.sort(function(a,b ){
						return a.idx - b.idx;
					});			

					resultCallback(null, result);
				} catch (e) {
					// exception in processing, error callback
					resultCallback(e);	
				} 
			} else {
				// http error, do error callback!
				resultCallback(error);
			}
		});	
	}

    /*
     * To parse volume view page and return json structure
     * e.g. http://kissmanga.com/Manga/01-OKU-Hiroya/Vol-003-Ch-041--Future--End-?id=127722
     */
	this.parseVolumePages = function (url, resultCallback) {
		var result = {
			'title':'',
			'volume':'',
			'pages':[]
		};
		cheerioFetch.fetch(url, function(error, $) {
			if (!error) {
				try {
					// basic prop
					result.title  = $('select.selectChapter option[selected]').text().fulltrim();
					result.volume = '';
					result.url    = url;

					// pages
					var select = $('script').text();

					// check for image inside javascripts 
					var matches = [];
					var i=0;
    				select.replace(/lstImages.push\(\"\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig, function(url) {
    					result.pages.push({
    						'idx': i,
    						'url': url.replace("lstImages.push(\"","")
    					});
    					i++;
    				});

					resultCallback(null, result);
				} catch (e) {
					resultCallback(e);
				}
			} else {
				resultCallback(error);
			}			
		});	
	}
}

module.exports = new KissManga();


