import {
	decodeCrosshairShareCode,
	encodeCrosshair,
	crosshairToConVars,
	type CrosshairV1,
} from 'csgo-sharecode'
const clamp = (n: number, min: number, max: number) =>
	Math.max(min, Math.min(max, n))
const roundEven = (n: number) => {
	const lower = Math.floor(n)
	return n - lower === 0.5 ? lower + (lower % 2) : Math.round(n)
}
// Legacy bars scale by height / 480; the gap is unscaled.
// Method: https://github.com/JDD310/CS2-Crosshair-Converter
export const getCrosshair = (
	code: string,
	screenHeight = 1080
): CrosshairV1 => {
	const source = decodeCrosshairShareCode(code.trim())
	if (source.format === 'cs2-v1') return source
	const defaults = {
		outlineRed: 0,
		outlineGreen: 0,
		outlineBlue: 0,
		outlineAlpha: 255,
		scopeDotScale: 1,
		scopeDotUseCrosshairColor: false,
	}
	if (source.format !== 'legacy-v1') {
		return {
			...source,
			...defaults,
			format: 'cs2-v1',
			outlineMode:
				source.format === 'legacy-v4'
					? source.outlineMode
					: Number(source.outlineEnabled),
		}
	}
	if (
		!Number.isInteger(screenHeight) ||
		screenHeight < 240 ||
		screenHeight > 65535
	)
		throw new Error('Enter a screen height between 240 and 65535 pixels.')
	const presets = [
		[255, 0, 0],
		[0, 255, 0],
		[255, 255, 0],
		[0, 0, 255],
		[0, 255, 255],
	]
	const [red, green, blue] = presets[source.color] ?? [
		source.red,
		source.green,
		source.blue,
	]
	const thickness = clamp(
		roundEven((source.thickness * screenHeight) / 480),
		1,
		255
	)
	return {
		...defaults,
		format: 'cs2-v1',
		screenHeight,
		style: [0, 4, 2, 0, 4, 5][source.style] ?? 4,
		red,
		green,
		blue,
		alpha: source.alphaEnabled ? source.alpha : 255,
		length: clamp(roundEven((source.length * screenHeight) / 480), 0, 255),
		thickness,
		gap: clamp(
			Math.trunc(4 + source.gap) + Math.ceil(thickness / 2),
			-128,
			127
		),
		outlineMode: source.outlineEnabled ? (source.outline < 1 ? 2 : 1) : 0,
		centerDotEnabled: source.centerDotEnabled,
		tStyleEnabled: source.tStyleEnabled,
		followRecoil: source.followRecoil,
		dynamicSpreadLimit: 255,
		splitDistance: clamp(source.splitDistance, 0, 127),
		innerSplitAlpha: clamp(source.innerSplitAlpha, 0, 1),
		outerSplitAlpha: clamp(source.outerSplitAlpha, 0.3, 1),
		splitSizeRatio: clamp(source.splitSizeRatio, 0, 1),
	}
}
export const getCurrentCrosshairCode = (code: string, height = 1080) =>
	encodeCrosshair(getCrosshair(code, height))
export const getCrosshairCommands = (code: string, height = 1080) =>
	crosshairToConVars(getCrosshair(code, height)).trim().replace(/\r?\n/g, ';')
