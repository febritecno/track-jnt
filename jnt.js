'use strict'

var cs = require('cloudscraper');
var c = require('cheerio');
var program = require('commander');
var ora = require('ora');
var csv = require('csvdata');
var chalk = require('chalk');


const spinner = ora('Memuat data ....').start();

const data = [];

async function jnt(nomor) {
	
		cs.post(await 'https://jet.co.id/track', { billcode: nomor },async function (error, response, html) {

		var $ = await c.load(html);
		
		if(error != true || response == 200 || $ != null){
		await delay(1000);				
		var resi = await nomor;
		var target = await $("#accordion-"+resi);
		var tgl_kirim = await target.find(".panel:first-child .panel-title").text().trim();
		var kota_asal = await target.find(".panel:first-child .panel-body .desc font").html();
		var tgl_terakhir = await target.find(".panel:last-child .panel-title").text().trim();
		var status = await target.find(".panel:last-child .one-time:last-child .desc").text();
						
		console.log();
		console.log();
		console.log('----------------------------------------------------------------------------------------------');
		console.log(chalk.blue(' [X] '+ Date(Date.now())));
		console.log('----------------------------------------------------------------------------------------------');
		console.log('[+] ' + 'NOMER RESI' + '	:+=======>>			' + chalk.green(resi));
		console.log();
		console.log( '[-] ' + chalk.bgRed('TANGGAL KIRIM') + '			|	' + chalk.bgRed(tgl_kirim));
		console.log( '[-] ' + 'KOTA ASAL' +  '				|	' + kota_asal);
		console.log( '[-] ' + chalk.bgRed('TANGGAL TERAKHIR') +  '			|	' + chalk.bgRed(tgl_terakhir));
		console.log();
		console.log();
		console.log( '[-] ' + 'STATUS' + '				|	' + chalk.bold.yellow(status));
		console.log('----------------------------------------------------------------------------------------------');
		
		var get = {
			resi : resi,
			tgl_kirim : tgl_kirim,
			kota_asal : kota_asal,
			tgl_terakhir : tgl_terakhir,
			status : status
		}
		
		data.push(await get);
		
		csv.write('output.csv', await data,
			{
			append: 'true',
			delimiter: ',',
			empty: false,
			encoding: 'utf8',
			header: 'resi,tgl_kirim,kota_asal,tgl_terakhir,status',
			log: false
			});
		
		}else {
		
		console.log(chalk.bgWhiteBright.red(error));
		console.log(Error);
		}
		});
}


program
  .command('cek <nomor>')
  .description('masukan resi JNT anda')
  .action(function(nomor){
	
	setTimeout(async () => {
	spinner.color = 'yellow';
	spinner.text = 'memuat data berdasarkan nomor resi ' + '"' + chalk.blue(nomor) +'"';
	await jnt(nomor);
	spinner.succeed('sukses, data termuat. ResultBy: ' + chalk.blue(nomor));
	spinner.stop();	
	}, 1000);
	
	setTimeout(() => {
		spinner.succeed('data telah terkirim ke output.csv');
	}, 10000);
	
	
  }).on('--help', function() {
    console.log('');
    console.log('Examples:');
    console.log('');
    console.log('  $ jnt cek [number resi]');
	console.log('  $ jnt list [name file text]');
  });
  
program.parse(process.argv);