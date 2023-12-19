const gulp = require("gulp");
const fs = require("fs");
const gutil = require("gulp-util");
const cproc = require("child_process");
const os = require("os");
const del = require("del");
const path = require("path");

function installSqlToolsService(platform) {
	const install = require("../out/src/languageservice/serviceInstallerUtil");
	return install.installService(platform);
}

gulp.task("ext:install-service", () => {
	return installSqlToolsService();
});

function doPackageSync(packageName) {
	const vsceArgs = [];
	vsceArgs.push("vsce");
	vsceArgs.push("package"); // package command

	if (packageName !== undefined) {
		vsceArgs.push("-o");
		vsceArgs.push(packageName);
	}
	const command = vsceArgs.join(" ");
	console.log(command);
	return cproc.execSync(command);
}

function cleanServiceInstallFolder() {
	const install = require("../out/src/languageservice/serviceInstallerUtil");
	const serviceInstallFolder = install.getServiceInstallDirectoryRoot();
	console.log(`Deleting Service Install folder: ${serviceInstallFolder}`);
	return del(`${serviceInstallFolder}/*`);
}

function doOfflinePackage(runtimeId, platform, packageName) {
	return installSqlToolsService(platform).then(() => {
		return doPackageSync(`${packageName}-${runtimeId}.vsix`);
	});
}

//Install vsce to be able to run this task: npm install -g vsce
gulp.task("package:online", () => {
	return cleanServiceInstallFolder().then(() => {
		doPackageSync();
		return installSqlToolsService();
	});
});

//Install vsce to be able to run this task: npm install -g vsce
gulp.task("package:offline", () => {
	const platform = require("../out/src/models/platform");
	const Runtime = platform.Runtime;
	const json = JSON.parse(fs.readFileSync("package.json"));
	const name = json.name;
	const version = json.version;
	const packageName = `${name}-${version}`;

	const packages = [];
	packages.push({ rid: "win7-x64", runtime: Runtime.Windows_7_64 });
	packages.push({ rid: "osx.10.11-x64", runtime: Runtime.OSX_10_11_64 });
	packages.push({ rid: "centos.7-x64", runtime: Runtime.CentOS_7 });
	packages.push({ rid: "debian.8-x64", runtime: Runtime.Debian_8 });
	packages.push({ rid: "fedora.23-x64", runtime: Runtime.Fedora_23 });
	packages.push({ rid: "opensuse.13.2-x64", runtime: Runtime.OpenSUSE_13_2 });
	packages.push({ rid: "rhel.7.2-x64", runtime: Runtime.RHEL_7 });
	packages.push({ rid: "ubuntu.14.04-x64", runtime: Runtime.Ubuntu_14 });
	packages.push({ rid: "ubuntu.16.04-x64", runtime: Runtime.Ubuntu_16 });

	let promise = Promise.resolve();
	cleanServiceInstallFolder().then(() => {
		packages.forEach((data) => {
			promise = promise.then(() => {
				return doOfflinePackage(
					data.rid,
					data.runtime,
					packageName,
				).then(() => {
					return cleanServiceInstallFolder();
				});
			});
		});
	});

	return promise;
});
