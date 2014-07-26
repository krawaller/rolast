//
// This module is used in the update.sh bash script. It adapts the web app source code to cordova by...
//
//   * Making sure cordova.js is loaded


fs = require('fs');

fs.readFile("www/index.html", 'utf8', function(err,index){
	if (err)
		console.log("Couldn't open: ",err);
	else {
		index = index.replace(/<body>[^<]/,"<body><script type='text/javascript' src='cordova.js'></script>");
		index = index.replace(/\.\.\/lib/g,'lib');
		index = index.replace('../rolast','rolast');
		fs.writeFile("www/index.html", index, 'utf8', function(){
			if (err)
				console.log(err);
			else
				console.log("Fixed index file");
		});
	}
});