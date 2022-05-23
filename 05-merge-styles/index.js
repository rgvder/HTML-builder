const path = require('path');
const fs = require('fs');
const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

fs.readdir(stylesPath,
	{withFileTypes: true},
	(error, files) => {
		if (error) {
			throw error;
		}

		const writeStream = fs.createWriteStream(bundlePath);

		files.forEach((file) => {
				if (file.isFile()) {
					let parse = path.parse(file.name);

					if (parse.ext === '.css') {
						const filePath = path.join(stylesPath, file.name);
						const readStream = fs.createReadStream(filePath);

						readStream.pipe(writeStream);
					}
				}
			}
		);
	});