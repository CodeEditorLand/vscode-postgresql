const gulp = require("gulp");
const install = require("gulp-install");

gulp.task("install", () =>
	gulp
		.src(["./package.json", "./src/views/htmlcontent/package.json"])
		.pipe(install()),
);
