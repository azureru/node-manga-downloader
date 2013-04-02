#!/usr/bin/env node

/**
 * Node Leecher
 *
 * This short utility will help in downloading manga
 *
 * @author Erwin Saputra <erwin.saputra@at.co.id>
 */

var fs  	    = require('fs'), 
	sys         = require('sys'),
	async       = require('async'),
	program     = require('commander'),

	config      = require('./config'),	
	mangahelper = require('./module/mangahere.js'),
	kissmanga   = require('./module/kissmanga.js'),
	downloader  = require('./utility/downloader.js');
	string      = require('./utility/string.js');
	toc         = require('./utility/toc.js');
	zip         = require('./utility/zip.js')

program
  .version('0.0.1')
  .parse(process.argv);	

var url = program.args[0];	

kissmanga.parseMainMangaPage(url, function (err, res) {
	if (err) {
		console.log(err);
		throw err;
	} else {
		var volumes = res.volumes;
		var title   = res.title.toString();
		console.log('Initialize... '+title);

		// we are on manga-level - create TOC for the manga
		toc.generateToc(res,[title],'manga.json', function (err) {

			// loop for all volume within the manga
			async.forEachLimit(res.volumes, 5, function (item, callback) {
				var volumeName = 'ch'+item.idx.toString().padLeft(4,'0');
				var volumeUrl  = item.url;
				kissmanga.parseVolumePages(volumeUrl, function (err, res) {
					if (err) {
						console.log(err);
						throw err;
					}				
					console.log('['+title+'] '+volumeName);
					// we are on volume level - create TOC for the volume
					toc.generateToc(res,[title,volumeName],volumeName + '.json',function (err) {
						// we are on page level - download all the images
						var pages = res.pages;
						async.forEachLimit(pages, 10, function (page, pageCallback) {					
							var param = {
								url: page.url,
								method : 'GET',
								timeout: 300000,
							}
							downloader.downloadImage(param,[title,volumeName],page.idx.toString().padLeft(4,'0')+'.jpg',function(err,res, exists){								
								if (err) {
									console.log(err);
									throw err;
								}		
								if (exists)	{
									console.log('Existing... ' + res);
								} else {
									console.log('Downloading... ' + res);
								} 								 	
								pageCallback(err);	
							});										
						}, function (err) {
							if (err) {
								console.log(err);
								throw err;
							}				
							// done all page download - let's zip it!
							zip.generateZip([title],[title,volumeName],volumeName+'.zip', function (err) {
								if (err) {
									console.log(err);
								}
								callback(err);	
							});							
						});				
					});
				});		
			}, 
			function (err) {
				console.log('Done!');
			});
		});
	}		
});

/*
mangahelper.parseMainMangaPage('http://www.mangahere.com/manga/buyuden/',function (err, res) {
	if (err) {
		console.log(err);
	} else {
		console.dir(res);
		mangahelper.parseVolumePages(res.volumes[0].url, function (err, res) {
			console.dir(res);
			mangahelper.downloadImage(res.pages[0].url, function(err, res) {
				downloader.downloadImage(res,['deep','nest'],'1.jpg',function(err,res){
					console.dir(res);	
				});
			})
		});
	}
});
*/