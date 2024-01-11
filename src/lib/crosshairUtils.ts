import { copy } from '@lib/copy'
import { notifications } from '@mantine/notifications'
import { Crosshair } from '@my-types/crosshair'
const csgoSharecode = require('csgo-sharecode')

export const copyCommands = (crosshairCode: string) => {
	try {
		const crosshairCommands = csgoSharecode
			.crosshairToConVars(
				csgoSharecode.decodeCrosshairShareCode(crosshairCode)
			)
			.replaceAll('\n', ';')

		copy(crosshairCommands)

		notifications.show({
			title: 'Crosshair Copied',
			message: 'Crosshair is copied to your clipboard',
			color: 'green',
		})
	} catch (error: any) {
		notifications.show({
			title: 'Error Copying Crosshair',
			message: 'Crosshair input is in an incorrect format',
			color: 'red',
		})
	}
}

export const getCrosshair = (crosshairCode: string): Crosshair => {
	return csgoSharecode.decodeCrosshairShareCode(crosshairCode)
}

const getColor = (
	colorCode: number,
	r: number,
	g: number,
	b: number,
	alphaEnabled: boolean,
	alpha: number
) => {
	let colour = ''
	const alphaDecimal = alphaEnabled ? alpha / 255 : 1

	if (colorCode === 1) {
		colour = `rgb(46, 250, 46, ${alphaDecimal})`
	} else if (colorCode === 2) {
		colour = `rgb(250, 250, 46, ${alphaDecimal})`
	} else if (colorCode === 3) {
		colour = `rgb(46, 46, 250, ${alphaDecimal})`
	} else if (colorCode === 4) {
		colour = `rgb(46, 250, 250, ${alphaDecimal})`
	} else if (colorCode === 5) {
		colour = `rgba(${r}, ${g}, ${b}, ${alphaDecimal})`
	} else {
		colour = `rgb(46, 250, 46, ${alphaDecimal})`
	}

	const outlineColour = `rgb(0, 0, 0, ${alphaDecimal})`

	return { colour, outlineColour }
}

const getLength = (length: number) => {
	if (length > 2) {
		return length * 2 + 1
	}

	return length * 2
}

const getThickness = (thickness: number) => {
	return thickness <= 0 ? 0.5 : thickness
}

const getOutlineThickness = (outlineThickness: number) => {
	return outlineThickness === 0
		? 0
		: Math.floor(outlineThickness) === 0
		? 0.6
		: Math.floor(outlineThickness)
}

export const getCrosshairValues = (crosshair: Crosshair, scale: number) => {
	const {
		length,
		red,
		green,
		blue,
		gap,
		alphaEnabled,
		alpha,
		outlineEnabled,
		outline,
		color,
		thickness,
		centerDotEnabled,
		splitDistance,
		followRecoil,
		fixedCrosshairGap,
		innerSplitAlpha,
		outerSplitAlpha,
		splitSizeRatio,
		tStyleEnabled,
		deployedWeaponGapEnabled,
		style,
	} = crosshair

	const crosshairLength = getLength(length) * scale
	const crosshairWidth = getThickness(thickness) * 2 * scale
	const crosshairGap = (Math.floor(gap) + 4) * scale
	const outlineThickness = getOutlineThickness(outline) * scale
	const { colour, outlineColour } = getColor(
		color,
		red,
		green,
		blue,
		alphaEnabled,
		alpha
	)

	return {
		crosshairLength,
		crosshairWidth,
		outlineEnabled,
		crosshairGap,
		color: colour,
		outlineColour,
		outlineThickness,
		centerDotEnabled,
		tStyleEnabled,
	}
}
