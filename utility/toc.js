var fs      = require('fs-extra');

/**
 * Create a TOC (basically just save JSON string to file)
 */
module.exports.generateToc = function (json, targetPath, filename, resultCallback) {
    // create path from specified array
    var dir_path      = targetPath.join('/');
    var complete_path = dir_path + '/' + filename;

    fs.exists(complete_path, function(exists) {
        if (exists) {
            // must reconstruct the manga.json so we delete old one
            fs.unlinkSync(complete_path);
        }

        // let's generate TOC based on supplied json (properly formatted)
        var string = JSON.stringify(json, null, '\t');
        fs.outputFile(complete_path, string, function(err) {
            resultCallback(err);
        });
    });    
}
