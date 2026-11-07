import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import test from 'node:test'
import ts from 'typescript'

const require = createRequire(import.meta.url)
const source = readFileSync(
	new URL('../src/lib/crosshairSchemas.ts', import.meta.url),
	'utf8'
)
let js = ts.transpileModule(source, {
	compilerOptions: { module: ts.ModuleKind.ESNext },
}).outputText
for (const dependency of ['csgo-sharecode', 'zod']) {
	js = js.replaceAll(
		`'${dependency}'`,
		JSON.stringify(pathToFileURL(require.resolve(dependency)).href)
	)
}
const { addCrosshairSchema, editCrosshairsSchema } = await import(
	`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`
)

const oldCode = 'CSGO-obHU6-NLWyP-EtkUh-pywKV-TXQ3A'
const newCode = 'CSmruJvT2oNMbuQTnT7AxpUbmoAippt23rntOEkDXkT7wL'
const add = (code) => ({ name: 'Test', crosshairCode: code })
const edit = (code) => ({
	crosshairs: [{ id: 1, name: 'Test', crosshair: code, user_id: 1 }],
	crosshairsToDelete: [],
})

test('add and edit accept legacy and current game codes and trim whitespace', () => {
	for (const code of [oldCode, newCode]) {
		assert.equal(addCrosshairSchema.parse(add(` ${code}\n`)).crosshairCode, code)
		assert.equal(
			editCrosshairsSchema.parse(edit(` ${code}\n`)).crosshairs[0].crosshair,
			code
		)
	}
})

test('add and edit reject malformed codes, including embedded valid codes', () => {
	for (const code of ['', 'junk', `junk${oldCode}`, `${newCode}junk`, newCode.slice(0, -1)]) {
		assert.equal(addCrosshairSchema.safeParse(add(code)).success, false)
		assert.equal(editCrosshairsSchema.safeParse(edit(code)).success, false)
	}
})
