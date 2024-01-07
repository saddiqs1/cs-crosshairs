type Props = {
	crosshair: Crosshair
	size: number
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

	return {
		length: length * 2.85,
		gap: (gap + 5) * (thickness * 0.7),
		outlineEnabled,
		outline,
		color: getColor(color, red, green, blue, alphaEnabled, alpha),
		thickness: thickness * 2.85,
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

export const RenderCrosshair: React.FC<Props> = ({ crosshair, size }) => {
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

	return (
		<svg
			viewBox={`0 0 ${size} ${size}`}
			width={size}
			height={size}
			xmlns='http://www.w3.org/2000/svg'
		>
			{/* Guide Lines */}
			{/* <rect x={center - 0.5} height={size} width='1' fill='gray' />
			<rect y={center - 0.5} width={size} height='1' fill='gray' /> */}

			{/* Horizontal Lines */}
			<rect //left
				x={center - gap - length}
				y={center - thickness / 2}
				width={length}
				height={thickness}
				strokeWidth={outline}
				stroke={outlineEnabled ? 'black' : undefined}
				fill={color}
			/>
			<rect //right
				x={center + gap}
				y={center - thickness / 2}
				width={length}
				height={thickness}
				strokeWidth={outline}
				stroke={outlineEnabled ? 'black' : undefined}
				fill={color}
			/>

			{/* Vertical Lines */}
			{!tStyleEnabled && (
				<rect //top
					x={center - thickness / 2}
					y={center - gap - length}
					width={thickness}
					height={length}
					strokeWidth={outline}
					stroke={outlineEnabled ? 'black' : undefined}
					fill={color}
				/>
			)}
			<rect //bottom
				x={center - thickness / 2}
				y={center + gap}
				width={thickness}
				height={length}
				strokeWidth={outline}
				stroke={outlineEnabled ? 'black' : undefined}
				fill={color}
			/>

			{/* Center Dot */}
			{centerDotEnabled && (
				<rect
					x={center - thickness / 2}
					y={center - thickness / 2}
					width={thickness}
					height={thickness}
					fill={color}
				/>
			)}
		</svg>
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
