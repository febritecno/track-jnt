//https://codewithhugo.com/how-to-make-beautiful-simple-cli-apps-with-node/
//https://www.npmjs.com/package/csv-writer https://www.npmjs.com/package/x-ray https://www.npmjs.com/package/node-request-queue https://www.npmjs.com/package/cloudscraper
//https://www.npmjs.com/package/listr https://www.npmjs.com/package/execa cli management

'use strict'


const execa = require('execa');
const listr = require('listr');

console.log('    ');
console.log('    ');
console.log("PROSES INSTALL SCRAPER");
console.log("-----------------");
console.log('    ');

new listr([
  {
    title: 'Mengapus File Temporer',
    task: () => {
		if (Error == true){
		throw new Error('Aplikasi erorr');
		task.skip();
		}else{
			execa('rm', ['package-lock.json'])
		}
	}
  },
  {
    title: 'Check Dan Menginstall Paket Pendukung Aplikasi',
    task: (ctx,task) => execa('npm', ['install'])
	.catch(() => {
				ctx.npm = false;

				task.skip('Tolong install dulu node nya ya... ini link nya https://nodejs.org/en/download');
			})
  },
  {
    title: 'Uji Coba Menjalankan Aplikasi',
    task: (task) => {
		if (Error == true){
		throw new Error('Aplikasi erorr');
		task.skip();
		}else{
		execa('node', ['scraper.js']).stdout.pipe(process.stdout);
		}
	}
  }
]).run();