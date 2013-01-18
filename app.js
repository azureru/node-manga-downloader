#!/usr/bin/env node

/**
 * Node Leecher
 *
 * This short utility will help in downloading manga
 *
 * @author Erwin Saputra <erwin.saputra@at.co.id>
 */

var fs      = require('fs'), 
	sys     = require('sys'),
	config  = require('./config'),
	program = require('commander'),
	mangahelper = require('./module/mangahere.js'),
	downloader  = require('./utility/downloader.js');


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

