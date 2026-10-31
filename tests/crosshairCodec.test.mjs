import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import test from 'node:test'
import ts from 'typescript'
import { decodeCrosshairShareCode, encodeCrosshair } from 'csgo-sharecode'

const require = createRequire(import.meta.url)
const source = readFileSync(
	new URL('../src/lib/crosshairCodec.ts', import.meta.url),
	'utf8'
)
const js = ts
	.transpileModule(source, {
		compilerOptions: {
			module: ts.ModuleKind.ESNext,
			target: ts.ScriptTarget.ES2020,
		},
	})
	.outputText.replaceAll(
		"'csgo-sharecode'",
		JSON.stringify(pathToFileURL(require.resolve('csgo-sharecode')).href)
	)
const { getCrosshair, getCurrentCrosshairCode, getCrosshairCommands } =
	await import(
		`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`
	)
const oldCode = 'CSGO-obHU6-NLWyP-EtkUh-pywKV-TXQ3A'
const currentCode = 'CSvbPubOq37zTGqtsPTP5QTrp5CB4xFXiKRLfzJsm49ZRe'
const legacy = {
	...decodeCrosshairShareCode(oldCode),
	style: 4,
	length: 2,
	thickness: 0.5,
	gap: -2,
	color: 0,
	alphaEnabled: false,
}

test('current codes preserve every field and ignore legacy resolution', () => {
	assert.deepEqual(
		getCrosshair(currentCode, 960),
		decodeCrosshairShareCode(currentCode)
	)
	assert.equal(getCurrentCrosshairCode(currentCode), currentCode)
})
test('legacy static geometry converts at the original height', () => {
	const code = encodeCrosshair(legacy)
	const at1080 = getCrosshair(code)
	assert.deepEqual([at1080.length, at1080.thickness, at1080.gap], [4, 1, 3])
	const at960 = getCrosshair(code, 960)
	assert.deepEqual(
		[at960.length, at960.thickness, at960.gap, at960.screenHeight],
		[4, 1, 3, 960]
	)
	assert.deepEqual(
		[at1080.red, at1080.green, at1080.blue, at1080.alpha],
		[255, 0, 0, 255]
	)
	assert.equal(getCrosshair(encodeCrosshair({ ...legacy, gap: -8 })).gap, -3)
	assert.equal(
		getCrosshair(encodeCrosshair({ ...legacy, length: 3 }), 1440).length,
		9
	)
})
test('September pixel formats preserve sizes, styles and outlines', () => {
	const base = getCrosshair(currentCode)
	for (const format of ['legacy-v3', 'legacy-v4']) {
		const code = encodeCrosshair({
			...base,
			format,
			style: 8,
			outlineMode: 2,
			outlineEnabled: true,
			screenHeight: 960,
		})
		const actual = decodeCrosshairShareCode(
			getCurrentCrosshairCode(code, 1440)
		)
		assert.equal(actual.format, 'cs2-v1')
		assert.equal(actual.screenHeight, 960)
		assert.equal(actual.length, base.length)
		assert.equal(actual.outlineMode, format === 'legacy-v4' ? 2 : 1)
	}
})
test('all bundled crosshairs export current codes and commands', () => {
	const manager = readFileSync(
		new URL('../src/pages/manager.tsx', import.meta.url),
		'utf8'
	)
	const codes = manager.match(/CSGO-[A-Za-z0-9-]+/g)
	assert.equal(codes.length, 7)
	for (const code of codes) {
		const converted = getCurrentCrosshairCode(` ${code} `)
		assert.match(converted, /^CS[A-Za-z0-9]{44}$/)
		assert.deepEqual(
			decodeCrosshairShareCode(converted),
			getCrosshair(code)
		)
		const commands = getCrosshairCommands(code)
		assert.match(commands, /cl_crosshair_length/)
		assert.match(commands, /cl_crosshair_screen_height "1080"/)
		assert.doesNotMatch(
			commands,
			/cl_crosshairsize|cl_crosshairusealpha|cl_crosshairgap |\n/
		)
	}
})
test('malformed codes and invalid original heights are rejected', () => {
	for (const code of [
		'',
		'junk',
		`junk${oldCode}`,
		`${oldCode}junk`,
		currentCode.slice(0, -1),
		currentCode.replace('vbPub', 'abPub'),
	])
		assert.throws(() => getCrosshair(code))
	for (const height of [0, NaN, 239, 65536, 960.5])
		assert.throws(() => getCrosshair(oldCode, height))
})
