const path = require('path');
const fs = require('fs');
const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, {withFileTypes: true}, (error, files) => {
	if (error) {
		throw error;
	}

	files.forEach((file) => {
		if (file.isFile()) {
			const filePath = path.join(folderPath, file.name);
			let parse = path.parse(file.name);

			fs.stat(filePath, (error, stats) => {
				if (error) {
					throw error;
				}
				console.log(`${parse.name} - ${parse.ext.slice(1)} - ${stats.size} b`);
			});
		}
	});
});