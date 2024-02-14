const builder = require("xmlbuilder");
const dom = require("xmldom").DOMParser;
const gulp = require("gulp");
const config = require("./config");
const through = require("through2");
const path = require("path");
const packageAllKeys = require("./../package.nls.json");

const iso639_3_to_2 = {
	chs: "zh-cn",
	cht: "zh-tw",
	csy: "cs-cz",
	deu: "de",
	enu: "en",
	esn: "es",
	fra: "fr",
	hun: "hu",
	ita: "it",
	jpn: "ja",
	kor: "ko",
	nld: "nl",
	plk: "pl",
	ptb: "pt-br",
	ptg: "pt",
	rus: "ru",
	sve: "sv-se",
	trk: "tr",
};

// converts a json object into xml
function convertDictionaryToXml(dict) {
	//TODO: for reverse file sync (if ever needed)
}

// converts a json object into a plain text json
function convertDictionaryToJson(dict) {
	return `${JSON.stringify(dict, null, "\t")}\n`;
}

// converts an xml file into a json object
function convertXmlToDictionary(xmlInput, escapeChar = true) {
	const xmlDom = new dom().parseFromString(xmlInput);
	const transUnits = xmlDom.getElementsByTagName("trans-unit");
	const dict = {};
	for (let i = 0; i < transUnits.length; ++i) {
		const unit = transUnits[i];

		// Extract ID attribute
		const id = unit.getAttribute("id");

		// Extract source element if possible
		const sourceElement = unit.getElementsByTagName("source");
		let source = "";
		if (sourceElement.length >= 1) {
			source = escapeChars(sourceElement[0].textContent, escapeChar);
		}

		// Extract target element if possible
		const targetElement = unit.getElementsByTagName("target");
		let target = "";
		if (targetElement.length >= 1) {
			target = escapeChars(targetElement[0].textContent, escapeChar);
		}

		// Return json with {id:{target,source}} format
		dict[id] = { source: source, target: target };
	}

	return dict;
}

// Escapes all characters which need to be escaped (')
function escapeChars(input, escapeChar = true) {
	if (escapeChar) {
		return input.replace(/'/g, "\\'");
	} else {
		return input;
	}
}

// converts plain text json into a json object
function convertJsonToDictionary(jsonInput) {
	return JSON.parse(jsonInput);
}

// export json files from *.xlf
// mirrors the file paths and names
gulp.task("ext:localization:xliff-to-json", () =>
	gulp
		.src([
			`${config.paths.project.localization}/xliff/**/*.xlf`,
			`!${config.paths.project.localization}/xliff/enu/**/*.xlf`,
			`!${config.paths.project.localization}/xliff/**/*localizedPackage.json.*.xlf`,
		])
		.pipe(
			through.obj((file, enc, callback) => {
				// convert xliff into json document
				const dict = convertXmlToDictionary(String(file.contents));
				Object.keys(dict).map((key, index) => {
					dict[key] = dict[key]["target"];
				});
				file.contents = new Buffer(convertDictionaryToJson(dict));

				// modify file extensions to follow proper convention
				file.basename = `${file.basename.substr(
					0,
					file.basename.indexOf("."),
				)}.i18n.json`;

				// callback to notify we have completed the current file
				callback(null, file);
			}),
		)
		.pipe(gulp.dest(`${config.paths.project.localization}/i18n/`)),
);

// Generates a localized constants file from the en xliff file
gulp.task("ext:localization:xliff-to-ts", () =>
	gulp
		.src([
			`${config.paths.project.localization}/xliff/enu/constants/localizedConstants.enu.xlf`,
		])
		.pipe(
			through.obj((file, enc, callback) => {
				// convert xliff into json document
				const dict = convertXmlToDictionary(String(file.contents));
				const contents = [
					"/* tslint:disable */",
					"// THIS IS A COMPUTER GENERATED FILE. CHANGES IN THIS FILE WILL BE OVERWRITTEN.",
					"// TO ADD LOCALIZED CONSTANTS, ADD YOUR CONSTANT TO THE ENU XLIFF FILE UNDER ~/localization/xliff/enu/constants/localizedConstants.enu.xlf AND REBUILD THE PROJECT",
					"import * as nls from 'vscode-nls';",
				];
				for (const key in dict) {
					if (dict.hasOwnProperty(key)) {
						const instantiation = `export let ${key} = \'${dict[key]["source"]}\';`;
						contents.push(instantiation);
					}
				}

				// add headers to export localization function
				contents.push(
					"export let loadLocalizedConstants = (locale: string) => {",
				);
				contents.push(
					"\tlet localize = nls.config({ locale: locale })();",
				);
				// Re-export each constant
				for (const key in dict) {
					if (dict.hasOwnProperty(key)) {
						const instantiation = `\t${key} = localize(\'${key}\', \'${dict[key]["source"]}\');`;
						contents.push(instantiation);
					}
				}
				// end the function
				contents.push("};");

				// Join with new lines in between
				const fullFileContents = `${contents.join("\r\n")}\r\n`;
				file.contents = new Buffer(fullFileContents);

				// Name our file
				file.basename = "localizedConstants.ts";

				// callback to notify we have completed the current file
				callback(null, file);
			}),
		)
		.pipe(gulp.dest(`${config.paths.project.root}/src/constants/`)),
);

// Generates a localized package.nls.*.json
gulp.task("ext:localization:xliff-to-package.nls", () =>
	gulp
		.src(
			[
				`${config.paths.project.localization}/xliff/**/localizedPackage.json.*.xlf`,
				`!${config.paths.project.localization}/xliff/en/localizedPackage.json.*.xlf`,
			],
			{ base: "" },
		)
		.pipe(
			through.obj((file, enc, callback) => {
				// convert xliff into json document
				const dict = convertXmlToDictionary(
					String(file.contents),
					false,
				);

				const contents = ["{"];

				// Get all the keys from package.nls.json which is the English version and get the localized value from xlf
				// Use the English value if not translated, right now there's no fall back to English if the text is not localized.
				// So all the keys have to exist in all package.nls.*.json
				Object.keys(packageAllKeys).forEach((key) => {
					let value = packageAllKeys[key];
					if (contents.length >= 2) {
						contents[contents.length - 1] += ",";
					}
					if (dict.hasOwnProperty(key)) {
						value = dict[key]["target"];
					}
					if (value === "") {
						value = packageAllKeys[key];
					}
					const instantiation = `"${key}":"${value}"`;
					contents.push(instantiation);
				});

				// end the function
				contents.push("}");

				// Join with new lines in between
				const fullFileContents = `${contents.join("\r\n")}\r\n`;
				file.contents = new Buffer(fullFileContents);

				const indexToStart = "localizedPackage.json.".length + 1;
				const languageIndex = file.basename.indexOf(".", indexToStart);
				const language = file.basename.substr(
					indexToStart - 1,
					languageIndex - indexToStart + 1,
				);

				// Name our file
				if (language === "enu") {
					file.basename = "package.nls.json";
				} else {
					file.basename = `package.nls.${iso639_3_to_2[language]}.json`;
				}

				// Make the new file create on root
				file.dirname = file.dirname.replace(language, "");

				// callback to notify we have completed the current file
				callback(null, file);
			}),
		)
		.pipe(gulp.dest(config.paths.project.root)),
);
