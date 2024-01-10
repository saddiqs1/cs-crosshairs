const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

const source = process.argv[2]
const destination = process.argv[3]

const sourcePath = path.join(__dirname, '..', source)
const destinationPath = path.join(__dirname, '..', destination)

try {
	fs.copyFileSync(sourcePath, destinationPath)
	console.log(
		chalk.green(`✓ File copied to ${destinationPath} successfully.`)
	)
} catch (err) {
	console.error(chalk.red('Error copying the file:', err))
}
