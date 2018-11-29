<?php
set_time_limit(0);
error_reporting(0);
function curl($url, $post = null, $usecookie = null, $sock = null, $timeout = null) {
	$header[] = "accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8";
	$header[] = "accept-encoding: gzip, deflate, br";
	$header[] = "accept-language: en-US,en;q=0.9";
	$header[] = "cache-control: no-cache";
	$header[] = "content-length: ".strlen($post);
	$header[] = "content-type: application/x-www-form-urlencoded";
	$header[] = "cookie: __cfduid=d166d8972ac210bfbf55aa3dda17d828e1534688136; _ga=GA1.3.1420617775.1534688144; _gid=GA1.3.584918530.1534688144; XSRF-TOKEN=eyJpdiI6InRwMmE3clJ2MWQxdlwvXC9ZeHN0bUpoZz09IiwidmFsdWUiOiJBNktRcW5BOUtFbGxOMlBnRmYwcFdCcTFXaGRqVzArXC9leHpIWXFLY2NWUCtnSGtqQ2orc1ZBbW05TnN6T2dPQlJjakpFdWpjc0dUaExYQmFibk9ickE9PSIsIm1hYyI6ImEwOWY3NDQ5MGJjNzBkNDlhODRmOTM5MDQ0NDg2Y2EyNDEzZGEwNDk5MTBiYzhjYjdlNDJkMWY3YjUzNDE5NmEifQ%3D%3D; laravel_session=eyJpdiI6InJ3ZzFRODZlUStCSFUxOUd1eFEzNHc9PSIsInZhbHVlIjoiNlRtYTJTNjM2dUo4ZUROaWgzU3hsTXh4Z3FMOHRaeTh2SEJhbm9xRHo0YUNjVVdtSE9nSEltK1ArQ3E4aWdqTTQrMVA0VkpwTVV6d21IcGJKWlBVanc9PSIsIm1hYyI6IjQ5Y2IxMTkyMzY0ZDQwNjEzY2I3YzE1ZmQ4MDI4NTE0YmYzZjRmNjkxYmZjMGFmZTdiODRiNWFiZjEyOThkNDMifQ%3D%3D; _gat=1";
	$header[] = "origin: https://www.jet.co.id";
	$header[] = "pragma: no-cache";
	$header[] = "referer: https://www.jet.co.id/track";
	$header[] = "upgrade-insecure-requests: 1";
    $ch = curl_init();
    if($post != null) {
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt ($ch, CURLOPT_POSTFIELDS, $post);
    }
    if($timeout != null){
        curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, $timeout);
    }
    if($sock != null){
            curl_setopt($ch, CURLOPT_PROXY, $sock);
            curl_setopt($ch, CURLOPT_PROXYTYPE, CURLPROXY_SOCKS5);
    }
	//curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
    curl_setopt($ch, CURLOPT_URL, $url); 
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
    curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36"); 
    if ($usecookie != null) { 
        curl_setopt($ch, CURLOPT_COOKIEJAR, $usecookie); 
        curl_setopt($ch, CURLOPT_COOKIEFILE, $usecookie);    
    }
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
    $result=curl_exec ($ch); 
    curl_close ($ch); 
    return $result; 
}

function getStr($string,$start,$end) {
    $str = explode($start,$string);
    $str = explode($end,$str[1]);
    return $str[0];
}

function getTextBetweenTags($string, $tagname) {
    $pattern = "/<$tagname ?.*>(.*)<\/$tagname>/";
    preg_match($pattern, $string, $matches);
    return $matches;
}

function checkResi($code, $no, $total) {
	if(!is_dir("cookies")) @mkdir("cookies");
	$cookie = "cookies/".md5($code).".txt";
	$url = "https://www.jet.co.id/track";
	$get = curl($url,"",$cookie);
	$token = getStr($get,'<input name="_token" type="hidden" value="','">');
	if(!empty($token)) {
		$data = "_token={$token}&billcode={$code}";
		$check = curl($url,$data,$cookie);
	    if(preg_match("/No result found for/i", $check)) {
	        $status  = "INVALID";
	        $result  = "[X] ".$no."/".$total." Checking at ".date("r")."\n";
	        $result .= "[X] Tracking Number \t: ".$code."\n";
	        $result .= "[X] Status \t\t: ".$status."\n";
	        $result .= "----------------------------------------------------\n";
	        $toSave = [array($code, $status)];
		} elseif(preg_match("/has been received, receiver name/i", $check)) {
			$status = "RECEIVED"; 
	        $firstDate = str_replace(array("\n","\r"), "", getStr($check,'<span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span>','</h4>'));
	        $lines = explode("\n", $check);
          $first = getTextBetweenTags($check, "font");
          $city = getStr($first[0], "<font color='#1F8DDC'>", "</font>");
	        foreach ($lines as $key => $value) {
	            if(preg_match("/Monday/i", $value) || preg_match("/Tuesday/i", $value) || preg_match("/Wednesday/i", $value) || preg_match("/Thursday/i", $value) || preg_match("/Friday/i", $value) || preg_match("/Saturday/i", $value) || preg_match("/Sunday/i", $value)) {
	                $lastDate = str_replace("\n", "", $value);
	            }
	        }
	        $result  = "[+] ".$no."/".$total." Checking at ".date("r")."\n";
	        $result .= "[+] Tracking Number \t: ".$code."\n";
	        $result .= "[+] Origin \t\t: ".$city."\n";
	        $result .= "[+] Submited Date \t: ".$firstDate."\n";
	        $result .= "[+] Last Date \t\t: ".$lastDate."\n";
	        $result .= "[+] Status \t\t: ".$status."\n";
	        $result .= "----------------------------------------------------\n";
	        $toSave = [array($code, $city, $firstDate, $lastDate, $status)];
		} else {
			$status = "UNRECEIVED";
	        //$firstDate = str_replace(array("\n","\r"), "", getStr($check,'<span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span>','</h4>'));
	        //$lines = explode("\n", $check);
	      $getDate = preg_match_all('/([0-9]{0,2})\/([0-9]{0,2})\/([0-9]{0,4}) - (.*)$/m', $check, $dates);
        $first = getTextBetweenTags($check, "font");
        $city = getStr($first[0], "<font color='#1F8DDC'>", "</font>");
        /*
	        foreach ($lines as $value) {
	            if(preg_match("/Monday/i", $value) || preg_match("/Tuesday/i", $value) || preg_match("/Wednesday/i", $value) || preg_match("/Thursday/i", $value) || preg_match("/Friday/i", $value) || preg_match("/Saturday/i", $value) || preg_match("/Sunday/i", $value)) {
	                $lastDate = str_replace("\n", "", $value);
	            }
	        }
         */
	        $result  = "[-] ".$no."/".$total." Checking at ".date("r")."\n";
	        $result .= "[-] Tracking Number \t: ".$code."\n";
	        $result .= "[-] Origin \t\t: ".$city."\n";
	        $result .= "[-] Submited Date \t: ".$dates[0][0]."\n";
	        $result .= "[-] Last Date \t\t: ".$dates[0][count($dates[0]) - 1]."\n";
	        $result .= "[-] Status \t\t: ".$status."\n";
	        $result .= "----------------------------------------------------\n";
	        $toSave = [array($code, $city, $dates[0][0], $dates[0][count($dates) - 1], $status)];
		}
	} else {
	    $status  = "FAILED GETING TOKEN";
	    $result  = "[#] ".$no."/".$total." Checking at ".date("r")."\n";
	    $result .= "[#] Tracking Number \t: ".$code."\n";
	    $result .= "[#] Status \t\t: ".$status."\n";
	    $result .= "----------------------------------------------------\n";
	    $toSave = [array($code, $status)];
	}
	if(!is_dir("logs")) @mkdir("logs");
	$file = fopen("logs/".$status.".csv", "a");
  foreach ($toSave as $fields) {
      fputcsv($file, $fields);
  }
	echo $result;
	@unlink($cookie);
}

$Logo = "

     ██╗   ██╗████████╗    ████████╗██████╗  █████╗  ██████╗██╗  ██╗███████╗██████╗ 
     ██║   ██║╚══██╔══╝    ╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗
     ██║████████╗██║          ██║   ██████╔╝███████║██║     █████╔╝ █████╗  ██████╔╝
██   ██║██╔═██╔═╝██║          ██║   ██╔══██╗██╔══██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗
╚█████╔╝██████║  ██║          ██║   ██║  ██║██║  ██║╚██████╗██║  ██╗███████╗██║  ██║
 ╚════╝ ╚═════╝  ╚═╝          ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
                                                                                    
";

if(!empty($argv[1])) {
	$get = file_get_contents($argv[1]);
	$lines = explode("\n", $get);
	$total = count($lines);
	$no = 1;
	foreach ($lines as $value) {
		if(!empty($value)) {
			checkResi($value, $no, $total);
			$no++;
		}
	}
} else {
	echo $Logo."\n";
	echo "[!] Usage : php {$argv[0]} list.txt\n\n";
}