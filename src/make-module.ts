import * as program from "yargs"
import {Transform} from "stream"
import * as fs from "fs"

interface ModuleInfo {
	templateDir: string
	moduleDir: string
	humanReadableName: string
	name: string
}

export default function (yargs: any) {
	const
		drupalSeven = sevenSpecified(yargs),
		version = drupalSeven ? 7 : 8

	validate(yargs, drupalSeven)
	bootstrapModule(yargs, version)
}

function sevenSpecified(yargs: any) {
	const literalSevenUsed = yargs._.find((x: number) => x === -7)

	return literalSevenUsed || yargs.seven
}

function validate(yargs: any, drupalSeven: boolean) {
	const
		defaultFolderWithoutDrupal7 = yargs.defaultFolder && !drupalSeven,
		invalidMachineName = !(typeof yargs.machineName === 'string' && validMachineName(yargs.machineName)),
		invalidHumanName = !(typeof yargs.name === 'string' && yargs.name.match(/^[a-z]+/i))

	if (defaultFolderWithoutDrupal7) {
		program.showHelp()
		error('Option --default-folder (or -d) used without specifying Drupal 7. This option can only be used for a Drupal 7 module. See help above.')
	}

	if (yargs.machineName && invalidMachineName) {
		error('Invalid machine name; must begin with a letter and contain only lowercase letters, numbers, and underscores.')
	}

	if (invalidHumanName) {
		error('Module name (human readable name, not machine name) must start with a letter.')
	}
}

function validMachineName(str: string) {
	const match = str.match(/\b[a-z]+[a-z0-9_]*\b/)

	return match !== null && str === match[0]
}

function bootstrapModule(yargs: any, drupalVersion: 7 | 8 = 8) {
	const
		name = yargs.machineName || machineName(yargs.name),
		baseDir = getBaseDir(yargs, drupalVersion),
		moduleDir = baseDir + '/' + name,
		templateDir = `${__dirname}/${drupalVersion}_template/`,
		notBaseDirExists = !yargs.currentDirectory && !fs.existsSync(baseDir),
		moduleDirExists = fs.existsSync(moduleDir),
		files = fs.readdirSync(templateDir),
		moduleInfo = {templateDir, moduleDir, name, humanReadableName: yargs.name}

	if (notBaseDirExists) {
		error(`Directory not found: \'${baseDir}\'\n\nDid you specify the correct Drupal version? Are you in the docroot directory?`)
	}

	if (moduleDirExists) error(`A module with the machine name '${name}' already exists within ${baseDir}.`)

	fs.mkdirSync(moduleDir)
	writeModuleFiles(moduleInfo, files)
	console.log("\x1b[32m%s\x1b[0m", 'Successfully created module with machine name ' + name)
}

function machineName(humanName: string) {
	return humanName
		.toLocaleLowerCase()
		.replace(/\s/g, '_')
		.replace(/[^a-zA-Z0-9_]/g, '')
}

function getBaseDir(yargs: any, version: 7 | 8 = 8) {
	const cwd = process.cwd()

	if (yargs.currentDirectory) return cwd

	const
		drupalModulePiece = `/modules/custom`,
		drupal7Piece = `/sites/${yargs.defaultFolder ? 'default' : 'all'}`,
		fullDrupalPiece = (version === 7 ? drupal7Piece : '') + drupalModulePiece

	return cwd + fullDrupalPiece
}

function writeModuleFiles(moduleInfo: ModuleInfo, templateFiles: string[]) {
	if (templateFiles.length === 0) return true

	const
		templateFileName = templateFiles[0],
		template = fs.createReadStream(`${moduleInfo.templateDir}/${templateFileName}`),
		actualFileName = templateFileName.replace(/module_name/g, moduleInfo.name),
		outputFile = fs.createWriteStream(`${moduleInfo.moduleDir}/${actualFileName}`),
		nameReplacer = getNameTransformer(moduleInfo.humanReadableName, moduleInfo.name)

	template
		.pipe(nameReplacer)
		.pipe(outputFile)

	writeModuleFiles(moduleInfo, templateFiles.slice(1))
}

function getNameTransformer(humanName: string, machineName: string) {
	return new Transform({
		transform: function (chunk, _, callback) {
			const newChunk = chunk
				.toString()
				.replace(/{{machine_name}}/g, machineName)
				.replace(/{{human_readable_name}}/g, humanName)

			this.push(newChunk)
			callback()
		}
	})
}

function error(message: string) {
	console.log("\x1b[31m%s\x1b[0m", "\nError: " + message)

	return process.exit(1)
}
