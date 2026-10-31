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

// The game resets authored height to the active display height on size changes.
// Simulate that side effect as well as applying every exported setting.
test('current commands preserve all fields after game size callbacks', () => {
	const fields = {
		cl_crosshair_drawoutline: 'outlineMode',
		cl_crosshair_dynamic_maxdist_splitratio: 'splitSizeRatio',
		cl_crosshair_dynamic_splitalpha_innermod: 'innerSplitAlpha',
		cl_crosshair_dynamic_splitalpha_outermod: 'outerSplitAlpha',
		cl_crosshair_dynamic_splitdist: 'splitDistance',
		cl_crosshair_dynamic_spread_limit: 'dynamicSpreadLimit',
		cl_crosshair_gap: 'gap',
		cl_crosshair_length: 'length',
		cl_crosshair_recoil: 'followRecoil',
		cl_crosshair_screen_height: 'screenHeight',
		cl_crosshair_t: 'tStyleEnabled',
		cl_crosshair_thickness: 'thickness',
		cl_crosshaircolor_a: 'alpha',
		cl_crosshaircolor_b: 'blue',
		cl_crosshaircolor_g: 'green',
		cl_crosshaircolor_r: 'red',
		cl_crosshairdot: 'centerDotEnabled',
		cl_crosshairoutline_a: 'outlineAlpha',
		cl_crosshairoutline_b: 'outlineBlue',
		cl_crosshairoutline_g: 'outlineGreen',
		cl_crosshairoutline_r: 'outlineRed',
		cl_crosshairstyle: 'style',
		cl_ironsight_dot_scale: 'scopeDotScale',
		cl_ironsight_usecrosshaircolor: 'scopeDotUseCrosshairColor',
	}
	const base = decodeCrosshairShareCode(currentCode)
	const customCode = encodeCrosshair({
		...base,
		screenHeight: 960,
		style: 9,
		gap: -3,
		length: 11,
		thickness: 3,
		outlineMode: 2,
		red: 12,
		green: 34,
		blue: 56,
		alpha: 178,
		outlineRed: 78,
		outlineGreen: 90,
		outlineBlue: 123,
		outlineAlpha: 145,
		followRecoil: true,
		centerDotEnabled: false,
		tStyleEnabled: true,
		dynamicSpreadLimit: 87,
		splitDistance: 13,
		innerSplitAlpha: 0.27,
		outerSplitAlpha: 0.63,
		splitSizeRatio: 0.41,
		scopeDotScale: 1.37,
		scopeDotUseCrosshairColor: true,
	})
	for (const code of [currentCode, customCode]) {
		const expected = decodeCrosshairShareCode(code)
		for (const displayHeight of [768, 960, 1080, 1440]) {
			const commands = getCrosshairCommands(code, displayHeight).split(
				';'
			)
			const state = { format: 'cs2-v1' }
			const seen = new Set()
			for (const command of commands) {
				const match = command.match(/^(\w+) "(-?\d+(?:\.\d+)?)"$/)
				assert.ok(match, `Invalid command: ${command}`)
				const [, name, raw] = match
				assert.ok(fields[name], `Unknown command: ${name}`)
				assert.ok(!seen.has(name), `Duplicate command: ${name}`)
				seen.add(name)
				const field = fields[name]
				state[field] =
					typeof expected[field] === 'boolean'
						? Boolean(Number(raw))
						: Number(raw)
				if (
					[
						'cl_crosshair_gap',
						'cl_crosshair_length',
						'cl_crosshair_thickness',
					].includes(name)
				)
					state.screenHeight = displayHeight
			}
			assert.equal(seen.size, Object.keys(fields).length)
			assert.deepEqual(state, expected)
			assert.equal(
				commands.at(-1),
				`cl_crosshair_screen_height "${expected.screenHeight}"`
			)
		}
	}
})

test('donk real CS2 code matches published static cross settings', () => {
	const code = 'CSmruJvT2oNMbuQTnT7AxpUbmoAippt23rntOEkDXkT7wL'
	// https://prosettings.net/players/donk/#cs2_crosshair, checked 2026-10-31.
	const expected = {
		format: 'cs2-v1',
		style: 4,
		followRecoil: false,
		centerDotEnabled: false,
		tStyleEnabled: false,
		outlineMode: 0,
		red: 37,
		green: 255,
		blue: 0,
		alpha: 255,
		outlineRed: 0,
		outlineGreen: 0,
		outlineBlue: 0,
		outlineAlpha: 255,
		gap: 1,
		length: 2,
		thickness: 2,
		dynamicSpreadLimit: 227,
		splitDistance: 3,
		innerSplitAlpha: 0,
		outerSplitAlpha: 1,
		splitSizeRatio: 1,
		screenHeight: 960,
		scopeDotScale: 1,
		scopeDotUseCrosshairColor: false,
	}
	assert.deepEqual(getCrosshair(code), expected)
	assert.equal(getCurrentCrosshairCode(code), code)
	const commands = getCrosshairCommands(code, 1440)
	assert.match(commands, /cl_crosshairstyle "4"/)
	assert.match(commands, /cl_crosshair_gap "1"/)
	assert.match(commands, /cl_crosshair_drawoutline "0"/)
	assert.match(commands, /cl_crosshair_length "2"/)
	assert.match(commands, /cl_crosshair_thickness "2"/)
	assert.match(commands, /cl_crosshair_screen_height "960"$/)
})

test('donk preview renders four pixel bars without a circle or outline', async () => {
	const { createElement } = await import('react')
	const { renderToStaticMarkup } = await import('react-dom/server')
	const rendererSource = readFileSync(
		new URL('../src/components/RenderCrosshair.tsx', import.meta.url),
		'utf8'
	)
	const rendererJs = ts
		.transpileModule(rendererSource, {
			compilerOptions: {
				module: ts.ModuleKind.ESNext,
				target: ts.ScriptTarget.ES2020,
				jsx: ts.JsxEmit.ReactJSX,
			},
		})
		.outputText.replaceAll(
			'"react/jsx-runtime"',
			JSON.stringify(
				pathToFileURL(require.resolve('react/jsx-runtime')).href
			)
		)
	const { RenderCrosshair } = await import(
		`data:text/javascript;base64,${Buffer.from(rendererJs).toString(
			'base64'
		)}`
	)
	const markup = renderToStaticMarkup(
		createElement(RenderCrosshair, {
			crosshair: getCrosshair(
				'CSmruJvT2oNMbuQTnT7AxpUbmoAippt23rntOEkDXkT7wL'
			),
			size: 100,
		})
	)
	assert.doesNotMatch(markup, /<circle/)
	assert.equal((markup.match(/<rect/g) ?? []).length, 4)
	assert.match(markup, /shape-rendering="crispEdges"/)
	assert.equal(
		(markup.match(/fill="rgba\(37, 255, 0, 1\)"/g) ?? []).length,
		4
	)
})
