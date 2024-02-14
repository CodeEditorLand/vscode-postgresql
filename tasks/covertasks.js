const gulp = require("gulp");
const del = require("del");
const jeditor = require("gulp-json-editor");
const istanbulReport = require("gulp-istanbul-report");
const cproc = require("child_process");

gulp.task("cover:clean", (done) => del("coverage", done));

gulp.task("cover:enableconfig", () => {
	return gulp
		.src("./coverconfig.json")
		.pipe(
			jeditor((json) => {
				json.enabled = true;
				return json; // must return JSON object.
			}),
		)
		.pipe(gulp.dest("./out", { overwrite: true }));
});

gulp.task(
	"cover:enable",
	gulp.series("cover:clean", "html:test", "cover:enableconfig"),
);

gulp.task("cover:disable", () => {
	return gulp
		.src("./coverconfig.json")
		.pipe(
			jeditor((json) => {
				json.enabled = false;
				return json; // must return JSON object.
			}),
		)
		.pipe(gulp.dest("./out", { overwrite: true }));
});

gulp.task("cover:combine", () => {
	return gulp
		.src([
			"./coverage/coverage-final.json",
			"./coverage/coverage-html.json",
		])
		.pipe(
			istanbulReport({
				reporterOpts: {
					dir: "./coverage",
				},
				reporters: [
					{ name: "lcovonly" }, // -> ./coverage/report.txt
					{ name: "cobertura" }, // -> ./jsonCov/cov.json
				],
			}),
		);
});

// for running on the jenkins build system
gulp.task(
	"cover:jenkins",
	gulp.series(
		"cover:clean",
		"cover:enableconfig",
		"html:test",
		"ext:test",
		"cover:combine",
	),
);
