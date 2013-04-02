var	async    = require('async'),
	request  = require('request'),
	string   = require('../utility/string.js'),
	urlParse = require('url'),
	cheerio  = require('cheerio');

/**
 * Scrapping Init Using Cheerio
 */
function CheerioFetch() {
	this.cookieJar = request.jar();

	this.fetch = function fetch(url, callback) {
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
					$ = cheerio.load(body);
					callback(null, $)
				} catch (e) {
					callback(e);
				}
			}
		});
	}
}

module.exports = new CheerioFetch();