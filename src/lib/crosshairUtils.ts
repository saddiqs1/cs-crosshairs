import { Crosshair } from 'csgo-sharecode'

const getColor = (
	colorCode: number,
	r: number,
	g: number,
	b: number,
	alphaEnabled: boolean,
	alpha: number
) => {
	if (colorCode === 1) {
		return `rgb(46, 250, 46, ${alphaEnabled ? alpha / 255 : 1})`
	} else if (colorCode === 2) {
		return `rgb(250, 250, 46, ${alphaEnabled ? alpha / 255 : 1})`
	} else if (colorCode === 3) {
		return `rgb(46, 46, 250, ${alphaEnabled ? alpha / 255 : 1})`
	} else if (colorCode === 4) {
		return `rgb(46, 250, 250, ${alphaEnabled ? alpha / 255 : 1})`
	} else if (colorCode === 5) {
		return `rgba(${r}, ${g}, ${b}, ${alphaEnabled ? alpha / 255 : 1})`
	}

	return `rgb(46, 250, 46, ${alphaEnabled ? alpha / 255 : 1})`
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

export const getCrosshairValues = (crosshair: Crosshair, size: number) => {
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

	const crosshairLength = getLength(length)
	const crosshairWidth = getThickness(thickness) * 2
	const crosshairGap = Math.floor(gap) + 4
	const outlineThickness = getOutlineThickness(outline)

	return {
		crosshairLength,
		crosshairWidth,
		outlineEnabled,
		crosshairGap,
		color: getColor(color, red, green, blue, alphaEnabled, alpha),
		outlineThickness,
		centerDotEnabled,
		tStyleEnabled,
	}
}
