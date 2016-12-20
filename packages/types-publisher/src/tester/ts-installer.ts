import * as fsp from "fs-promise";
import * as path from "path";

import { TypeScriptVersion } from "../lib/common";
import { writeJson } from "../util/io";
import { execAndThrowErrors } from "../util/util";

const installsDir = "typescript-installs";

export async function installAllTypeScriptVersions(): Promise<void> {
	console.log("Installing TypeScript versions...");

	await fsp.mkdirp(installsDir);
	for (const version of TypeScriptVersion.All) {
		const dir = installDir(version);
		await fsp.mkdirp(dir);
		writeJson(path.join(dir, "package.json"), packageJson(version));
		await execAndThrowErrors("npm install", dir);
	}
}

export function pathToTsc(version: TypeScriptVersion): string {
	return path.join(__dirname, "..", "..", installDir(version), "node_modules", "typescript", "lib", "tsc.js");
}

function installDir(version: TypeScriptVersion) {
	return path.join(installsDir, version);
}

function packageJson(version: TypeScriptVersion): {} {
	return {
		name: "ts-install",
		version: "0.0.0",
		dependencies: {
			typescript: `${version}.x`
		}
	};
}