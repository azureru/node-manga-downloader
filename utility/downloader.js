var fs      = require('fs-extra'),
    request = require('request');
/**
 * Download specified image in url and store it in targetPath (won't replace existing one though)
 */
module.exports.downloadImage = function (param, targetPath, filename, resultCallback) {
    // create path from specified array
    var dir_path      = targetPath.join('/');
    var complete_path = dir_path + '/' + filename;

    fs.exists(complete_path, function(exists) {
        if (exists) {
            // already exists - let it be
            is_exists = true;
            resultCallback(null, complete_path, true);
        } else {          
          // not - exists download the image
          fs.mkdirs(dir_path, function(err){
              if (err) {
                  console.error(err); 
                  // error on directory creation - move on with that error
                  resultCallback(err, complete_path);
              } else {
                  var imageFile = fs.createWriteStream(complete_path, {mode: 0755});
                  var req = request(param).pipe(imageFile);

                  imageFile.on('error', function(err){
                      if (err) {
                        console.error(err);
                      }
                      resultCallback(err, complete_path, false);
                  });

                  imageFile.on('close', function(err){
                      if (err) {
                        console.error(err);
                      }                    
                     resultCallback(err, complete_path, false);
                  });
              }
          });         
        }        
    });        
}

