const path = require("path");

const projectRoot = path.resolve(path.dirname(__dirname));
const srcRoot = path.resolve(projectRoot, "src");
const viewsRoot = path.resolve(srcRoot, "views");
const htmlcontentRoot = path.resolve(viewsRoot, "htmlcontent");
const outRoot = path.resolve(projectRoot, "out");
const htmloutroot = path.resolve(outRoot, "src/views/htmlcontent");
const localization = path.resolve(projectRoot, "localization");

const config = {
	paths: {
		project: {
			root: projectRoot,
			localization: localization,
		},
		extension: {
			root: srcRoot,
		},
		html: {
			root: htmlcontentRoot,
			out: htmloutroot,
		},
	},
};

module.exports = config;
