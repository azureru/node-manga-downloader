var fs      = require('fs'),
    request = require('request'),
    async   = require('async'),
    mkdirp  = require('mkdirp');


/**
 * Download specified image in url and store it in targetPath
 */
module.exports.downloadImage = function (url, targetPath, filename, resultCallback) {
    var createFile = false;

    // create path from specified array
    var dir_path = targetPath.join('/');
    var complete_path = dir_path + '/' + filename;

    async.series([

        function(callback){
            // attempt to create the directory
            mkdirp(dir_path, 0755, function(err) {
              if (err) {
                if (err.code=='EEXIST') {
                    // directory already exists so moving on
                    callback(null,dir_path);                  
                } else {
                    // whoa! error
                    callback(err);
                }
              } else {
                // no error, directory created.. moving on
                callback(null,dir_path);  
              }
            }); 
        },

        function(callback, result){
            // download the file
            fs.exists(complete_path, function(exists) {
              if (!exists) {
                  // if file not exists, download one
                  var imageFile = fs.createWriteStream(complete_path, {mode: 0755});
                  request(url).pipe(imageFile);
                  imageFile.on('close', function(){
                      callback(null, complete_path);
                  });
              } else {
                // already exists, skip success
                callback(null, complete_path);
              }
            });
        },
    ],
    // final
    function(err, results){
        resultCallback(err, results);
    });
}

