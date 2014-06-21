module.exports = function (grunt) {
    var fs = require("fs");
	
    grunt.registerMultiTask('compile', 'compile the source data', function() {
        grunt.log.write('\n Compiling data ...\n');
        
        var templateData = "define(function() { return {\n";
        var templatePath = "data/templates/";
        var templateTargetPath = "src/data/generated/";
        var templateFiles = fs.readdirSync(templatePath, 'utf8');
        for(var i = 0; i < templateFiles.length; i++) {
        	var file = templateFiles[i].replace(".html", "");
        	
        	var content = fs.readFileSync(templatePath + templateFiles[i]).toString();
        	content = content.replace(/(?:\r\n|\r|\n|\t)/g, "");
        	templateData = templateData + "\t" + file + ": '" + content + "',\n\n";
        }
        
        templateData = templateData + "\n}; });";
        fs.writeFileSync(templateTargetPath + "templates.js", templateData, 'utf8');
        
        console.log(templateData);
    });
};