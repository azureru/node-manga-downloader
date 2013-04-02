var	async    = require('async'),
	request  = require('request'),
	string   = require('../utility/string.js'),
	urlParse = require('url'),
	jsdom    = require('jsdom');

jsdom.defaultDocumentFeatures = {
	  FetchExternalResources: ["script"],
	  ProcessExternalResources: ["script"],
	  MutationEvents           : '2.0',
	  QuerySelector            : false		  
};

/**
 * Scrapping Init Using JSDOM
 */
function JsdomFetch() {
	this.cookieJar = request.jar();

	this.fetch = function (url, callback) {
		var self = this;

		var param = {
			uri : url,
			jar : self.cookieJar,
			headers: {
				'referer'   : url,
				'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:12.0) Gecko/20100101 Firefox/12.0'
			}				
		};		

		request(param, function(error, response, body){
			if (!error && response.statusCode == 200) {
				try {
					jsdom.env({
					  html: body,
					  scripts: ['http://code.jquery.com/jquery.js'],
					  done: function (errors, window) {
					  	var $ = window.$;
					  	callback(null, window, $)					    
					  }
					});										
				} catch (e) {
					callback(e);
				}
			}
		});
	}
}

module.exports = new JsdomFetch();