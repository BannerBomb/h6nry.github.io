var domain = window.location.protocol + '//' + window.location.hostname;
var http = window.location.protocol + '//';
if (domain === http + "bannerbomb.github.io" || domain === http + "bannerbomb.000webhostapp.com") {
  success();
} else {
  failed();
}
function success() {
var domain = window.location.protocol + '//' + window.location.hostname + '/repo/';
document.getElementById("cydiaurl").href="cydia://url/https://cydia.saurik.com/api/share#?source=" + domain;
//Some fast iOS check.
is_ios = (navigator.userAgent.match(/iPad/i) != null) || (navigator.userAgent.match(/iPhone/i) != null) || (navigator.userAgent.match(/iPod/i) != null);
if (!is_ios) document.getElementById('ocy').innerHTML = ' Most probably, you will not be able to open Cydia.';

//The functionality for the package list.
function Apt_package() {
	this.Package;
	this.Version;
	this.Section;
	this.Installed_Size;
	this.Description;
	this.Name;
	this.Author;
	this.Filename;
	this.Depiction;
} //Constructor for Apt_package object.

function parsePackage(string) { //TODO: Make sure no key is undefined
	var a_package = new Apt_package();
	var lines = string.split('\n');

	var c;
	for (c = 0; c < lines.length; ++c) {
		var line = lines[c];
		if (line.search(':') == -1) continue;

		var components = line.split(':'); //Quick and dirty.
		var key = components.shift();
		var value = components.join(':').trim();

		switch (key) {
			case 'Package':
				a_package.Package = value;
				break;
			case 'Version':
				a_package.Version = value;
				break;
			case 'Section':
				a_package.Section = value;
				break;
			case 'Installed-Size':
				a_package.Installed_Size = value;
				break;
			case 'Description':
				a_package.Description = value;
				break;
			case 'Name':
				a_package.Name = value;
				break;
			case 'Author':
				a_package.Author = value;
				break;
			case 'Filename':
				a_package.Filename = value;
				break;
			case 'Depiction':
				a_package.Depiction = value;
				break;
			default:
				break; //Unknown key.
		}
	}

	if (a_package.Package == undefined) return undefined;

	return a_package;
}

function parsePackages(parse) {
	var depictions = {};
	while (parse.indexOf('\r') >= 0) parse = parse.replace('\r', ''); //Remove all carriage returns, which should not be there, anyways.

	var packages = parse.split('\n\n');

	for (var c = 0; c < packages.length; ++c) {
		var a_package = parsePackage(packages[c]);

		if (a_package == undefined) continue;

		var pid = a_package.Package;

		if (depictions[pid] && (parseFloat(a_package.Version) >= parseFloat(depictions[pid].Version))) { //Only keep the latest version.
			depictions[pid] = a_package;
		} else if (depictions[pid] == undefined) { //Package not added yet, add.
			depictions[pid] = a_package;
		}
	}

    return depictions;
}

var xhr;
if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
} else if (window.ActiveXObject) {
    xhr = new ActiveXObject('Microsoft.XMLHTTP');
}

xhr.onreadystatechange = function() {
	if (!(xhr.readyState == 4)) return;

	var depictionArray = parsePackages(xhr.responseText);
	if (!depictionArray) return;

	for (key in depictionArray) {
		var pack = depictionArray[key];

		//The following code is very messy. You have been warned.
		document.getElementById('samples').innerHTML = document.getElementById('samples').innerHTML +
			'<a href="javascript:var e = document.getElementById(\'u_' + pack.Package + '\'); e.style.display = e.style.display= (e.style.display == \'block\' ? \'none\' : \'block\');">' +
			pack.Name + ' (' + pack.Version + ')</a><br>' +
			'<div id="u_' + pack.Package + '" style="display:none;">' +
			'&nbsp;&nbsp;' + pack.Description + '<br>' +
			(is_ios ? '&nbsp;&nbsp;<a href="' +  'cydia://url/https://cydia.saurik.com/api/share#?source=' + domain + '&package=' + pack.Package + '" target="_blank">Show in Cydia.</a><br>' : '') +
			'&nbsp;&nbsp;<a href="' + pack.Depiction + '" target="_blank">Show more info.</a><br>' +
			'&nbsp;&nbsp;<a href="' + pack.Filename + '" target="_blank">Download the .deb package.</a><br><br>' +
			'</div>';
	}
};

xhr.open("GET","Packages");
xhr.send();
}
function failed() {
	document.getElementById('samples').innerHTML = "You are not authenticated to use this file here!"
}