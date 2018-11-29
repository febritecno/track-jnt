'use strict'

// https://www.npmjs.com/package/wait-queue-es5

var cs = require('cloudscraper');
var csv = require('csv-writer').createObjectCsvWriter;
var c = require('cheerio');
var fs = require('fs');

var file = fs.readFileSync('list.txt', "utf8").toString().split("\n");
			
file.map

var q = require('wait-queue-es5');

console.log('    ');
console.log('---------------------------------------------------');
console.log('------------MAIN PROSES SCRAPE STARTING------------');
console.log('    ');
console.log('    ');

// const prop_csv = new csv({
// 	path: 'output.csv',
// 	header: [{
// 			id: 'resi',
// 			title: 'NO RESI'
// 		},
// 		{
// 			id: 'kirim',
// 			title: 'TANGGAL KIRIM'
// 		},
// 		{
// 			id: 'asal',
// 			title: 'KOTA ASAL'
// 		},
// 		{
// 			id: 'akhir',
// 			title: 'TANGGAL TERAKHIR'
// 		},
// 		{
// 			id: 'status',
// 			title: 'STATUS'
// 		}
// 	]
// });

var wq =new q();
	// do loop while catch a error
function loop() {
	wq.shift(function (err, item) {
		for(i in file){
			var file = fs.readFileSync('list.txt', "utf8").toString().split("\n");
			cs.post('https://jet.co.id/track', { billcode: file }, function (error, response, html) {
				if (!error && response.statusCode == 200) {
					var $ = c.load(html);
					console.log();
					console.log('[+] '+ Date(Date.now()));
					console.log('-------------------------------------');
					console.log($('.one-time').text() );
					console.log('-------------------------------------');
				}else if(err){
					console.log('  ');
					console.log('Tidak dapat mengambil data, mungkin koneksi anda bermasalah');
					console.log('  ');
					console.log(new Error() + err);
					console.log('  ');
				}
			});
		}
		
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
}, 1000);
 
// terminate after 10s
setTimeout(function () {
    wq.terminate();
}, 10 * 1000);
