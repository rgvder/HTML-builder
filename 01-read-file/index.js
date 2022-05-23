const path = require('path');
const fs = require('fs');
const readStream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf8');

let text = '';

readStream.on('data', (chunk) => {
	text += chunk;
});

readStream.on('end', () => {
	console.log(text);
});

