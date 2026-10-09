require('dotenv').config();
const url = new URL(process.env.BASE_URL || 'http://localhost:3000');
module.exports = {
  baseUrl: url.origin, port: Number(url.port || 3000),
  apiBaseUrl: process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com',
  headless: process.env.HEADLESS !== 'false',
};
