// settings
var nw=require('./node_scripts/gulp-nw');
var extras=require('./node_scripts/gulp-extras');
var repos=require('./node_scripts/repos');

//third party
var gulp = require('gulp'); 
var https = require('https');
var fs = require('fs');
var fstream=require('fstream');
var unzip=require('unzip');
var clean = require('gulp-clean');
var spawn = require('child_process').spawn;
var exec= require('child_process').exec;

var outback = function (s) {
    while (s.length < 70) s += ' ';
    var l = s.length; 
    for (var i = 0; i < l; i++) s += String.fromCharCode(8);
    process.stdout.write(s);
}

gulp.task('install-extras',function() {
	extras.map(function(E){
		var writeStream = fstream.Writer(E.path);
		var datalength=0;
		var request = https.get(E.url, function(response) {
			response.on('data',function(chunk){
				datalength+=chunk.length;
			})
			.pipe(writeStream);
		});		
	});
});

gulp.task('install-node-webkit', function() {
	var parent=nw.path.split('/');
	parent.pop();
	var parentfolder=parent.join('/');

	if (!fs.existsSync(parentfolder)) fs.mkdirSync(parentfolder);
	if (!fs.existsSync(nw.path)) fs.mkdirSync(nw.path);
	var writeStream = fstream.Writer(nw.path);
	var datalength=0;
	var request = https.get(nw.url, function(response) {
		response.on('data',function(chunk){
			datalength+=chunk.length;
			outback('downloading '+datalength);
		});
		response.pipe(unzip.Parse())
		.pipe(writeStream);
	});
});

gulp.task('clonerepos',function() {
	for (var i in repos) {
		console.log('clone ',repos[i].url)
		gulp.src(repos[i].target,{read:false}).pipe(clean());
		spawn('git', ["clone",repos[i].url,repos[i].target]);
	}
});

gulp.task('install-socket.io-cli',function() {
	return gulp.src('node_modules/socket.io/node_modules/socket.io-client/dist/*')
  .pipe(gulp.dest('components/socketio-socketio/'));
  
})
gulp.task('component-install',function(){
	exec('component install');
})
gulp.task('install', ['clonerepos','install-node-webkit','install-socket.io-cli','component-install','install-extras']);

gulp.task('sampleapp', function(){
	var sample=spawn('git', ["clone","https://github.com/ksanaforge/sampleapp"]);
	sample.on("exit",function(){
		console.log("sample downloaded, type to run the sample");
		console.log(">cd sampleapp");
    console.log(">gulp");
	});
});

gulp.task('setup',['install'],function(){
    console.log("to create demo app, type");
    console.log(">gulp sampleapp");
});

var newapp=require('./node_scripts/newapp');
var newcomponent=require('./node_scripts/newcomponent');
gulp.task('newapp',function(){
	var argv = require('minimist')(process.argv.slice(2));
  var name = argv['name'];
  newapp(name);
  process.chdir(name);
  newcomponent(name+'/main');
  newcomponent(name+'/comp1'); //need at least 2 component for gulp to work properly
  process.chdir('..');
  console.log('success, cd to '+name+' and type')
  console.log('gulp')
});

