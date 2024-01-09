import { Box } from '@mantine/core'
import { getCrosshairValues } from '@lib/crosshairUtils'

type Props = {
	crosshair: Crosshair
	size: number
	onClick: () => void
}

export const RenderCrosshair: React.FC<Props> = ({
	crosshair,
	size,
	onClick,
}) => {
	const {
		crosshairLength,
		crosshairWidth,
		outlineEnabled,
		crosshairGap,
		color,
		outlineThickness,
		centerDotEnabled,
		tStyleEnabled,
	} = getCrosshairValues(crosshair, size)

	const center = size / 2

	return (
		<Box
			onClick={onClick}
			sx={{
				border: '1px dashed red',
				cursor: 'pointer',
				background: 'rgba(250, 250, 250, 0.2)',
			}}
			w={size + 1}
			h={size + 1}
		>
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
							fill={'#000000'}
						/>
					)}
					<rect
						x={
							center -
							(crosshairLength +
								crosshairWidth / 2 +
								crosshairGap)
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
							fill={'#000000'}
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
							fill={'#000000'}
						/>
					)}
					<rect
						x={center - crosshairWidth / 2}
						y={
							center -
							(crosshairLength +
								crosshairWidth / 2 +
								crosshairGap)
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
							fill={'#000000'}
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
							fill={'#000000'}
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
