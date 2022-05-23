const path = require('path');
const fs = require('fs');

const text = fs.createWriteStream('02-write-file/text.txt');
const {stdin: input, stdout: output} = require('process');

const readline = require('readline').createInterface({input, output});

function writeFile(query = '') {
	readline.question(query, (answer) => {
		if (answer === 'exit') {
			readline.close();

			return;
		}

		text.write(`${answer}\n`);

		return writeFile();
	});
}

readline.on('close', () => {
	text.end();
	console.log('До новых встреч)))');
});

writeFile(`Добрый день! Введите текст\n`);



