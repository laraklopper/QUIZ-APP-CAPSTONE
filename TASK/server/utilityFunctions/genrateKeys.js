const crypto = require('crypto');
const fs = require('fs');
const path = require('path')


let jwtKey = crypto.randomBytes(64).toString('hex');

console.log(jwtKey);

const filePath = path.join(__dirname, '../.env');

const jwtSecretLine = `JWT_SECRET_KEY=${jwtKey}\n`;

fs.appendFile(filePath, jwtSecretLine, (err) => {
    if (err) {
        console.error('Error writing to .env file:', err);
    } else {
        console.log('JWT_SECRET added to .env file');
    }
});
