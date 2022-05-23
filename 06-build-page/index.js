const path = require('path');
const fs = require('fs');

const projectDistPath = path.join(__dirname, 'project-dist');
const componentsPath = path.join(__dirname, 'components');
const templatePath = path.join(__dirname, 'template.html');

const assetsPath = path.join(__dirname, 'assets');
const assetsDistPath = path.join(__dirname, 'project-dist', 'assets');

const stylesDirPath = path.join(__dirname, 'styles');
const stylePath = path.join(__dirname, 'project-dist', 'style.css');

const indexPath = path.join(__dirname, 'project-dist', 'index.html');

fs.rm(projectDistPath, {recursive: true, force: true}, (error) => {
	if (error) {
		throw error;
	}

	fs.mkdir(projectDistPath, {recursive: true}, (error) => {
		if (error) {
			throw error;
		}

		fs.readdir(stylesDirPath, {withFileTypes: true}, (error, cssFiles) => {
			if (error) {
				throw error;
			}

			const writeStream = fs.createWriteStream(stylePath);
			cssFiles.forEach((cssFile) => {
					if (cssFile.isFile()) {
						let parse = path.parse(cssFile.name);

						if (parse.ext === '.css') {
							const cssFilePath = path.join(stylesDirPath, cssFile.name);
							const readStream = fs.createReadStream(cssFilePath);

							readStream.pipe(writeStream);
						}
					}
				}
			);
		});

		fs.readFile(templatePath, 'utf8', (error, template) => {
			if (error) {
				throw error;
			}

			const promises = [];

			fs.readdir(componentsPath, (error, components) => {
				if (error) {
					throw error;
				}
				components.forEach((component) => {
					const componentPath = path.join(__dirname, 'components', component);

					promises.push(
						fs.promises.readFile(componentPath, 'utf8')
							.then((data) => ({name: component.split('.')[0], data}))
					);
				});

				let index = template;

				Promise.all(promises).then((contentArr) => {
					contentArr.forEach(({name, data}) => {
						index = index.replace(`{{${name}}}`, data);
					});
					const indexHtml = fs.createWriteStream(indexPath);
					indexHtml.write(index);
					indexHtml.end();
				});
			});
		});

		async function copyAssets(input, output) {
			await fs.promises.rm(output, {recursive: true, force: true});
			const files = await fs.promises.readdir(input, {withFileTypes: true});
			await fs.promises.mkdir(output, {recursive: true});

			for (const file of files) {
				const filePath = path.join(input, file.name);
				const fileCopyPath = path.join(output, file.name);

				if (file.isDirectory()) {
					await copyAssets(filePath, fileCopyPath);
				} else {
					await fs.promises.copyFile(filePath, fileCopyPath);
				}
			}
		}

		copyAssets(assetsPath, assetsDistPath);
	});
});
