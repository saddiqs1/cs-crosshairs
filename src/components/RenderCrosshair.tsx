type Props = {
	crosshair: Crosshair
	size: number
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
	} = crosshair

	const centerX = size / 2
	const centerY = size / 2

	const GAP = 5

	return (
		<svg width={size} height={size} xmlns='http://www.w3.org/2000/svg'>
			{/* Horizontal Lines */}
			<line
				x1={centerX - GAP}
				y1={centerY}
				x2={centerX - GAP - length}
				y2={centerY}
				strokeWidth='1'
				stroke='red'
			/>
			<line
				x1={centerX + GAP}
				y1={centerY}
				x2={centerX + GAP + length}
				y2={centerY}
				strokeWidth='1'
				stroke='lightblue'
			/>

			{/* Vertical Lines */}
			<line
				x1={centerX}
				y1={centerY - GAP}
				x2={centerX}
				y2={centerY - GAP - length}
				strokeWidth='1'
				stroke='green'
			/>
			<line
				x1={centerX}
				y1={centerY + GAP}
				x2={centerX}
				y2={centerX + GAP + length}
				strokeWidth='1'
				stroke='yellow'
			/>

			{/* Center Dot */}
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
