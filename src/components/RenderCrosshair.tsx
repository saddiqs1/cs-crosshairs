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

		GAP RULES:
		~ -1.9 <= x <= -1 = -2 
		~ -0.9 <= x < 0 = -1
		~ 0 <= x < 1 = 0 
		~ 1.1 <= x < 2 = 1 
		~ 2.1 <= x < 3 = 2
		... 

    */
	const multiplier = size * 0.025

	return {
		length: length * multiplier,
		red,
		green,
		blue,
		gap: 0 + 5, // gap
		alphaEnabled,
		alpha,
		outlineEnabled,
		outline,
		color,
		thickness: thickness * multiplier,
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
			<rect
				x={center - gap - length}
				y={center - thickness / 2}
				width={length}
				height={thickness}
				stroke={undefined}
				fill={'red'} //left
			/>
			<rect
				x={center + gap}
				y={center - thickness / 2}
				width={length}
				height={thickness}
				stroke={undefined}
				fill={'lightblue'} //right
			/>

			{/* Vertical Lines */}
			{!tStyleEnabled && (
				<rect
					x={center - thickness / 2}
					y={center - gap - length}
					width={thickness}
					height={length}
					stroke={undefined}
					fill={'green'} //top
				/>
			)}
			<rect
				x={center - thickness / 2}
				y={center + gap}
				width={thickness}
				height={length}
				stroke={undefined}
				fill={'yellow'} //bottom
			/>

			{/* Center Dot */}
			{centerDotEnabled && (
				<rect
					x={center - thickness / 2}
					y={center - thickness / 2}
					width={thickness}
					height={thickness}
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
