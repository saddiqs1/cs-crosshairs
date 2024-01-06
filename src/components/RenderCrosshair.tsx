type Props = {
	crosshair: Crosshair
	size: number
}

// https://github.com/Skarbo/CSGOCrosshair/tree/master

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

	/*
        gap: -5
        outcome = 0

        gap: 0
        outcome = 5

        gap: 5
        outcome = 10

    */
	const multiplier = size * 0.055

	return {
		length: 5 * (size * 0.045), // length
		red,
		green,
		blue,
		gap: 0 + 5, // gap
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
	}
}

export const RenderCrosshair: React.FC<Props> = ({ crosshair, size }) => {
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
	} = getCrosshairValues(crosshair, size)

	const centerX = size / 2
	const centerY = size / 2

	return (
		<svg width={size} height={size} xmlns='http://www.w3.org/2000/svg'>
			{/* Horizontal Lines */}
			<line
				x1={centerX - gap}
				y1={centerY}
				x2={centerX - gap - length}
				y2={centerY}
				strokeWidth='1'
				stroke='red' //left
			/>
			<line
				x1={centerX + gap}
				y1={centerY}
				x2={centerX + gap + length}
				y2={centerY}
				strokeWidth='1'
				stroke='lightblue' //right
			/>

			{/* Vertical Lines */}
			<line
				x1={centerX}
				y1={centerY - gap}
				x2={centerX}
				y2={centerY - gap - length}
				strokeWidth='1'
				stroke='green' //top
			/>
			<line
				x1={centerX}
				y1={centerY + gap}
				x2={centerX}
				y2={centerX + gap + length}
				strokeWidth='1'
				stroke='yellow' //bottom
			/>

			{/* Center Dot */}
			{/* TODO - do this after everything else */}
			{centerDotEnabled && (
				<rect
					x={centerX - 5}
					y={centerY - 5}
					width='10'
					height='10'
					fill='blue'
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
