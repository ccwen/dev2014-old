/*
	shared gulpfile for applications
*/
var newcomponent=require('./node_scripts/newcomponent');
var nw=require('./node_scripts/gulp-nw');
var paths = {
  buildscripts: [
  'components/**/*.{jsx,js}',
  '!build/*.js']
};
var tempjs=[];
var fs=require('fs')
var gulp=require('gulp');
var spawn=require('child_process').spawn;
var react = require('gulp-react');
var concat = require('gulp-concat');
var tap=require('gulp-tap');
var filelog=require('gulp-filelog');
var component=require('gulp-component');

gulp.task('newcomponent',function(){
	var argv = require('minimist')(process.argv.slice(2));
  var name = argv['name'];
  newcomponent(name);
});


gulp.task('jsx2js',function() {
		return gulp.src(paths.buildscripts)
  		.pipe(tap(function(file, t) {
        if (file.path.substring(file.path.length-4) == '.jsx') {
            var jsfile=file.path.substring(0,file.path.length-1);
            console.log(jsfile)
        		tempjs.push(jsfile);
            return t.through(react, []);
        }
    		}))
			.pipe(gulp.dest("components"));
});

gulp.task('componentbuild',['jsx2js'],function() {	
  return gulp.src('./component.json')
  .pipe(component({standalone: true}))
  .pipe(gulp.dest('./build'));
});

gulp.task('rebuild',['componentbuild'],function(){
	tempjs.map(function(f){fs.unlink(f)});
  tempjs.length=0;
	return true;
})
gulp.task('watch', function () {
  gulp.watch(paths.buildscripts, ['rebuild']);
});

var appprocessexit=function() {
  process.exit(1);
}

gulp.task('run',function(){
  var instance=spawn(nw.bin,['--remote-debugging-port=9222','.'])
  instance.on('exit',function(){
    appprocessexit();
  })
});


gulp.task('server',function(){
  var instance=spawn("node",['../node_scripts/server'])

  instance.on('exit',function(){
    appprocessexit();
  });
  var appfolder=process.cwd().match(/[\/\\]([^\/\\]*?)$/)[1];
  console.log("your application can be access from ");
  console.log(("http://127.0.0.1:2556/"+appfolder));
});

gulp.task('default',['rebuild','run','watch'])

module.exports=gulp;