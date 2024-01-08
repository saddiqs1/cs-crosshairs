import { Box } from '@mantine/core'
import Canvas from './shared/Canvas'

type Props = {
	crosshair: Crosshair
	size: number
	onClick: () => void
}

// https://github.com/Skarbo/CSGOCrosshair/tree/master

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

const getThickness = (thickness: number) => {
	return thickness <= 0 ? 0.5 : thickness
}

const getGap = (gap: number) => {
	/*
		GAP RULES:
		~ -1.9 <= x < -1 = -2 
		~ -0.9 <= x < 0 = -1
		~ 0 <= x < 1 = 0 
		~ 1.1 <= x < 2 = 1 
		~ 2.1 <= x < 3 = 2
		... 
	*/

	return Math.floor(gap)
}

const getCrosshairValues = (crosshair: Crosshair, size: number) => {
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

	const actualThickness = getThickness(thickness)
	const actualGap = getGap(gap)

	return {
		length: length * 2.85,
		gap: (actualGap + 5) * (actualThickness * 0.7),
		outlineEnabled,
		outline,
		color: getColor(color, red, green, blue, alphaEnabled, alpha),
		thickness: actualThickness * 2.85,
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
	}
}

export const RenderCrosshairCanvas: React.FC<Props> = ({
	crosshair,
	size,
	onClick,
}) => {
	const {
		length,
		gap,
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
	} = getCrosshairValues(crosshair, size)

	const center = size / 2

	const draw = (ctx: CanvasRenderingContext2D) => {
		ctx.fillStyle = '#000000'
		ctx.beginPath()
		ctx.arc(50, 100, 20, 0, 2 * Math.PI)
		ctx.fill()
	}

	return (
		<Box
			onClick={onClick}
			sx={{
				border: '1px dashed red',
				cursor: 'pointer',
				background: 'rgba(20, 20, 20, 0.5)',
			}}
			w={size + 1}
			h={size + 1}
		>
			<Canvas draw={draw} />
		</Box>
	)
}

export interface Crosshair {
	length: number
	red: number
	green: number
	blue: number
	gap: number
	alphaEnabled: boolean
	alpha: number
	outlineEnabled: boolean
	outline: number
	color: number
	thickness: number
	centerDotEnabled: boolean
	splitDistance: number
	followRecoil: boolean
	fixedCrosshairGap: number
	innerSplitAlpha: number
	outerSplitAlpha: number
	splitSizeRatio: number
	tStyleEnabled: boolean
	deployedWeaponGapEnabled: boolean
	/**
	 * CS:GO
	 * 0 => Default
	 * 1 => Default static
	 * 2 => Classic
	 * 3 => Classic dynamic
	 * 4 => Classic static
	 */
	/**
	 * CS2
	 * 0 to 3 => Classic
	 * 4 => Classic static
	 * 5 => Legacy
	 */
	style: number
}

/*
	gap: -5
	outcome = 0

	gap: 0
	outcome = 5

	gap: 5
	outcome = 10

	GAP RULES:
	~ -1.9 <= x <= -1 = -2 
	~ -0.9 <= x < 0 = -1
	~ 0 <= x < 1 = 0 
	~ 1.1 <= x < 2 = 1 
	~ 2.1 <= x < 3 = 2
	... 
*/
