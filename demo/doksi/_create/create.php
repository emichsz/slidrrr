<?php
set_time_limit(10000);

foreach (glob('../source/*.html') as $fileName) {
	unlink($fileName);
}

exec('java -jar ext-doc.jar -p ext.xml -o ../ -t template/ext/template.xml -verbose');

include_once 'geshi/geshi.php';
foreach (glob('../output/*.html') as $filename) {
	$content = file_get_contents($filename);
	preg_match_all('|<source>(.*)</source>|isU', $content, $matches);
	if (count($matches[1])) {
		foreach ($matches[1] as $source) {
			$geshi = new GeSHi(trim($source), 'javascript');
			$content = str_replace('<source>'.$source.'</source>', $geshi->parse_code(), $content);
		}
		file_put_contents($filename, $content);
	}
}



$html = '<!DOCTYPE html><html><head><title>{$title}</title><meta http-equiv="Content-type" content="text/html; charset=utf-8" /></head><body>{$source}</body></html>';

foreach (glob('../source/*.html') as $fileName) {
	$originalContent = trim(file_get_contents($fileName));
	// valami kosz van a vegen:
	$originalContent = str_replace(chr(239).chr(191).chr(191), '', $originalContent);
	$content = preg_replace('!<div id="([a-zA-Z\.\-]+)"></div>!', '/' . '******\\1******' . '/', $originalContent);
	$geshi = new GeSHi($content, 'javascript');
	$source = preg_replace('!/' . '\*\*\*\*\*\*([a-zA-Z\.\-]+)\*\*\*\*\*\*' . '/!', '<a name="\\1"></a>', $geshi->parse_code());
	$source = str_replace("\t", "    ", $source);
	file_put_contents($fileName, strtr($html, array(
		'{$title}' => str_replace('.html', '.js', basename($fileName)),
		'{$source}' => $source
	)));
}