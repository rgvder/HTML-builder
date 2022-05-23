const path = require('path');
const fs = require('fs');
const filesPath = path.join(__dirname, 'files');
const filesCopyPath = path.join(__dirname, 'files-copy');

async function copyDir(input, output) {
	await fs.promises.rm(output, {recursive: true, force: true});
	const files = await fs.promises.readdir(input, {withFileTypes: true});
	await fs.promises.mkdir(output, {recursive: true});

	for (const file of files) {
		const filePath = path.join(input, file.name);
		const fileCopyPath = path.join(output, file.name);

		if (file.isDirectory()) {
			await copyDir(filePath, fileCopyPath);
		} else {
			await fs.promises.copyFile(filePath, fileCopyPath);
		}
	}
}

copyDir(filesPath, filesCopyPath);


