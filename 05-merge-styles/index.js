const path = require('path');
const fs = require('fs');
const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

fs.readdir(stylesPath, {withFileTypes: true}, (error, files) => {
	if (error) {
		throw error;
	}

	const stylePromises = [];

	files.forEach((file) => {
			if (file.isFile()) {
				let parse = path.parse(file.name);

				if (parse.ext === '.css') {
					const filePath = path.join(stylesPath, file.name);

					stylePromises.push(fs.promises.readFile(filePath, 'utf8'));
				}
			}
		}
	);
	let style;

	Promise.all(stylePromises).then((styleArr) => {
		style = styleArr.join('\n\n');

		const styleWriteStream = fs.createWriteStream(bundlePath);

		styleWriteStream.write(style);
		styleWriteStream.end();
	});
});