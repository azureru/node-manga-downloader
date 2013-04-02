var fs      = require('fs-extra'),
	exec = require('child_process').exec;

/**
 * Compress all files in the folder - and remove the folder
 */
module.exports.generateZip = function (rootPath, targetPath, filename, resultCallback) {
    // create path from specified array
    var root_path     = rootPath.join('/');
    var dir_path      = targetPath.join('/');

    var complete_path = rootPath + '/' + filename;

    // create zip archive and add all files in folder
	var child = exec('zip -rj \''+complete_path+'\' \''+dir_path+'\'', function(err, stdout, stderr) {
	    if (err) {
	    	resultCallback(err);
	    } else {
	    	// done zipping remove all the files in directory
			// remove all traces
			fs.removeSync(dir_path);
		    resultCallback(null);
		}
	});				
}
