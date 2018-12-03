'use strict'

var cs = require('cloudscraper');
var c = require('cheerio');
var fs = require('fs');
var q = require('wait-queue-es5');
var csv = require('write-csv');

console.log('    ');
console.log('---------------------------------------------------');
console.log('------------MAIN PROSES SCRAPE STARTING------------');
console.log('---------------------------------------------------');
console.log('    ');
console.log('    ');


var file = fs.readFileSync('list.txt', "utf8").toString().split("\n");

var wq =new q();
	// do loop while catch a error
async function loop() {;
	wq.shift(function (err, item) {
			var index = Math.floor(Math.random() * file.length);
			cs.post('https://jet.co.id/track', { billcode: file[index] }, async function (error, response, html) {
					if (!error && response.statusCode == 200) {
						 var $ = await c.load(html);
						
						 var resi = await file[index];
						 var target = await $("#accordion-"+resi);
						 var tgl_kirim = await target.find(".panel:first-child .panel-title").text().trim();
						 var kota_asal = await target.find(".panel:first-child .panel-body .desc font").html();
						 var tgl_terakhir = await target.find(".panel:last-child .panel-title").text().trim();
						 var status = await target.find(".panel:last-child .one-time:last-child .desc").text();
						
						console.log();
						console.log();
						console.log('----------------------------------------------------------------------------------------------');
						console.log(index+' [X] '+ Date(Date.now()));
						console.log('----------------------------------------------------------------------------------------------');
						console.log('[+] ' + 'NOMER RESI' + '	:+=======>>			' + resi);
						console.log();
						console.log( '[-] ' + 'TANGGAL KIRIM' + '			|	' + tgl_kirim);
						console.log( '[-] ' + 'KOTA ASAL' +  '				|	' + kota_asal);
						console.log( '[-] ' + 'TANGGAL TERAKHIR' +  '			|	' + tgl_terakhir);
						console.log( '[-] ' + 'STATUS' + '				|	' + status);
						console.log('----------------------------------------------------------------------------------------------');
						
						csv('output.csv',[{
										RESI: resi,
										TANGGAL_KIRIM: tgl_kirim,
										KOTA_ASAL: kota_asal,
										TANGGAL_TERAKHIR: tgl_terakhir,
										STATUS: status
						}]);
							
					}else if(err){
						console.log('  ');
						console.log('Tidak dapat mengambil data, mungkin koneksi anda bermasalah');
						console.log('  ');
						console.log(new Error() + err);
						console.log('  ');
						setTimeout(loop, 0);
					}
			});
			
		setTimeout(loop, 0);
    });
}
setTimeout(loop, 0);

var taskID = 0;
var interval;
// add a task every 1s
interval = setInterval(function () {
    wq.push({
        taskid: taskID++
    });
}, 50 * 1000);
 
 
// terminate after 10s
//setTimeout(function () {
  // wq.terminate();
//}, 1* 1000);
