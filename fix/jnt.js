'use strict'

var cs = require('cloudscraper');
var c = require('cheerio');
var program = require('commander');
var ora = require('ora');
var csv = require('csvdata');
var chalk = require('chalk');
const execa = require('execa');
var fs = require('fs');

const spinner = ora('Memuat data ....').start();

const data = [];

async function jnt(nomor) {
		cs.post(await 'https://jet.co.id/track', { billcode: nomor },async function (error, response, html) {

		var $ = await c.load(html);
		
		if(error !== true || response === 200 || $ !== null || isNaN($) === true || null === null || null  == undefined || null == null || typeof null == true){
						
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
		
		if(null === null || null  == undefined || null == null || typeof null == true){
			console.log('Data tidak tersimpan ke csv karna data kosong');
			spinner.stop();
		}else{
			
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
			}
				spinner.succeed('data telah terkirim ke output.csv');
				spinner.stop();
			
		}else {
		
		console.log(chalk.bgWhiteBright.red(error));
		console.log(Error);
		console.log('conection lost');
		spinner.stop();
		}
		});
}


program
  .command('cek <nomor>')
  .description('masukan resi JNT anda')
  .action(function(nomor){
	try{
	setTimeout(async () => {
	spinner.color = 'yellow';
	spinner.text = 'memuat data berdasarkan nomor resi ' + '"' + chalk.blue(nomor) +'"';
	await jnt(nomor);
	}, 10000);
	
	}catch(err){
		console.log('conection lost');
		console.log(err);
		spinner.stop();
	}
  }).on('--help', function() {
    console.log('');
    console.log('Examples:');
    console.log('');
    console.log('  $ jnt cek [number resi]');
  });

  
  
program
  .command('list <url>')
  .action(function(url){
	var file = fs.readFileSync(url, "utf8").toString().split("\n");
	file.map((i)=>{
		try {
			(async () => {
				const {stdout} = await execa.shell('node jnt.js cek ' + i);
				console.log(stdout);
			})();
		}catch (error) {
			console.log(error);
			console.log('conection lost');
			spinner.stop();
		}
	})
	setTimeout(() => {
		spinner.succeed('Cek resi dan save ke csv berhasil');
		spinner.stop();
	}, 10000);
  });
  
  
  program.parse(process.argv);