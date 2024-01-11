import { getCrosshairValues } from '@lib/crosshairUtils'

type Props = {
	crosshair: Crosshair
	size: number
}

export const RenderCrosshair: React.FC<Props> = ({ crosshair, size }) => {
	const {
		crosshairLength,
		crosshairWidth,
		outlineEnabled,
		crosshairGap,
		color,
		outlineColour,
		outlineThickness,
		centerDotEnabled,
		tStyleEnabled,
	} = getCrosshairValues(crosshair, size / 100)

	const center = size / 2

	// NOTE: The order of the groups in the code below are in a specific order for a reason, to mimic the order of priority for the lines of a crosshair in CS2.
	// i.e. from bottom to top, left line, right line, top line, bottom line and then dot.
	return (
		<svg
			viewBox={`0 0 ${size} ${size}`}
			width={size}
			height={size}
			xmlns='http://www.w3.org/2000/svg'
		>
			{/* Left */}
			<g>
				{outlineEnabled && (
					<rect
						x={
							center -
							(crosshairLength +
								crosshairWidth / 2 +
								crosshairGap) -
							outlineThickness
						}
						y={center - crosshairWidth / 2 - outlineThickness}
						width={crosshairLength + outlineThickness * 2}
						height={crosshairWidth + outlineThickness * 2}
						fill={outlineColour}
					/>
				)}
				<rect
					x={
						center -
						(crosshairLength + crosshairWidth / 2 + crosshairGap)
					}
					y={center - crosshairWidth / 2}
					width={crosshairLength}
					height={crosshairWidth}
					fill={color}
				/>
			</g>

			{/* Right */}
			<g>
				{outlineEnabled && (
					<rect
						x={
							center +
							(crosshairWidth / 2 + crosshairGap) -
							outlineThickness
						}
						y={center - crosshairWidth / 2 - outlineThickness}
						width={crosshairLength + outlineThickness * 2}
						height={crosshairWidth + outlineThickness * 2}
						fill={outlineColour}
					/>
				)}
				<rect
					x={center + (crosshairWidth / 2 + crosshairGap)}
					y={center - crosshairWidth / 2}
					width={crosshairLength}
					height={crosshairWidth}
					fill={color}
				/>
			</g>

			{/* Top */}
			<g visibility={tStyleEnabled ? 'hidden' : 'show'}>
				{outlineEnabled && (
					<rect
						x={center - crosshairWidth / 2 - outlineThickness}
						y={
							center -
							(crosshairLength +
								crosshairWidth / 2 +
								crosshairGap) -
							outlineThickness
						}
						width={crosshairWidth + outlineThickness * 2}
						height={crosshairLength + outlineThickness * 2}
						fill={outlineColour}
					/>
				)}
				<rect
					x={center - crosshairWidth / 2}
					y={
						center -
						(crosshairLength + crosshairWidth / 2 + crosshairGap)
					}
					width={crosshairWidth}
					height={crosshairLength}
					fill={color}
				/>
			</g>

			{/* Bottom */}
			<g>
				{outlineEnabled && (
					<rect
						x={center - crosshairWidth / 2 - outlineThickness}
						y={
							center +
							(crosshairWidth / 2 + crosshairGap) -
							outlineThickness
						}
						width={crosshairWidth + outlineThickness * 2}
						height={crosshairLength + outlineThickness * 2}
						fill={outlineColour}
					/>
				)}
				<rect
					x={center - crosshairWidth / 2}
					y={center + (crosshairWidth / 2 + crosshairGap)}
					width={crosshairWidth}
					height={crosshairLength}
					fill={color}
				/>
			</g>

			{/* Dot */}
			<g visibility={centerDotEnabled ? 'show' : 'hidden'}>
				{outlineEnabled && (
					<rect
						x={center - crosshairWidth / 2 - outlineThickness}
						y={center - crosshairWidth / 2 - outlineThickness}
						width={crosshairWidth + outlineThickness * 2}
						height={crosshairWidth + outlineThickness * 2}
						fill={outlineColour}
					/>
				)}
				<rect
					x={center - crosshairWidth / 2}
					y={center - crosshairWidth / 2}
					width={crosshairWidth}
					height={crosshairWidth}
					fill={color}
				/>
			</g>
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
