var	async    = require('async'),
	request  = require('request'),
	string   = require('../utility/string.js'),
	urlParse = require('url'),
	cheerioFetch  = require('../utility/cheerio_fetch.js');
	jsdomFetch    = require('../utility/jsdom_fetch.js');

function MangaHere() {

	/**
	 * To parse main manga page and return json structure
	 * e.g. http://www.mangahere.com/manga/naruto/
	 */
	this.parseMainMangaPage = function(url, resultCallback) {
		var result = {
			'title':'',
			'image':'',
			'url'  :'',
			'attributes' : {},
			'volumes':[]
		};
		cheerioFetch.fetch(url, function(error, $){
			if (!error) {
				try {
					// basic prop
					result.title = $('h1.title').text();
					result.image = $('.manga_detail_top img').attr('src')
					result.url   = url;

					// attributes matching
					var attrs = $('.manga_detail_top ul.detail_topText li');
					attrs.map(function(j, li){
						var content = $(li).text();
						var attrs = content.match(/([^<]*)\s*\:\s*([^<]*)/);
						if (attrs != null) {
							if (attrs.length > 2) {
								result.attributes[attrs[1]] = attrs[2];
							}
						}									
					});

					// chapter list matching
					var elements = $('.detail_list ul li a');
					elements.map(function(i,el) {
						var url = $(el).attr('href');
						result.volumes.push({
							'idx': elements.length - i,
							'url': url
						});						
					});		

					// sort the chapters ASC since mangahere sort it DESC by default
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
     * 
     */
	this.parseVolumePages = function (url, resultCallback) {
		var result = {
			'title':'',
			'volume':'',
			'pages':[]
		};
		request({uri:url}, function(error, response, body){
			if (!error && response.statusCode == 200) {
				try {
					$ = cheerio.load(body);

					// basic prop
					result.title = $('.title h2').text()
					result.volume = '';

					// pages
					var select = $('.go_page .right select').first();
					var pages  = select.children('option');
					pages.map(function(j, li){
						li = $(li);
						var content = li.text();
						var value   = li.attr('value');
						result.pages.push({
							'idx': content,
							'url' : value
						});
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

 	/**
 	 * Download page Image
 	 */
	this.downloadImage = function (url, resultCallback) {
		request({uri:url}, function(error, response, body){
			if (!error && response.statusCode == 200) {
				try {
					$ = cheerio.load(body);
					var img = $('.read_img img');
					resultCallback(null, img.attr('src'));	
				} catch (e) {
					resultCallback(error);		
				}
			} else {
				resultCallback(error);	
			}
		});		
	}

	this.downloadManga = function(url, volumeStart, volumeEnd) {

	}
}

module.exports = new MangaHere();


