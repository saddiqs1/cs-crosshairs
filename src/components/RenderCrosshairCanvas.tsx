import { getColor } from '@lib/crosshairUtils'
import { Box } from '@mantine/core'
import { Stage, Layer, Rect } from 'react-konva'

type Props = {
	crosshair: Crosshair
	size: number
	onClick: () => void
}

// https://github.com/hauptrolle/csgo-crosshair-generator/blob/master/src/components/CrosshairPreview/CrosshairPreview.js
// TODO - copy calculations from above. See if it works. If it does work, see if it can work with svg...

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
		gap: (actualGap + 5) * (actualThickness * 1),
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

const RenderCrosshairCanvas: React.FC<Props> = ({
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
			<Stage width={size} height={size}>
				<Layer>
					{/* <Rect
						x={center - 0.5}
						width={1}
						height={size}
						fill={'gray'}
					/>
					<Rect
						y={center - 0.5}
						height={1}
						width={size}
						fill={'gray'}
					/> */}

					<Rect
						x={center}
						y={center}
						width={thickness}
						height={length * -1}
						strokeWidth={outline}
						stroke={outlineEnabled ? 'black' : undefined}
						fill={color}
						offset={{
							x: thickness / 2,
							y: thickness / 2 + gap,
						}}
						rotation={90}
					/>
					<Rect
						x={center}
						y={center}
						width={thickness}
						height={length * -1}
						strokeWidth={outline}
						stroke={outlineEnabled ? 'black' : undefined}
						fill={color}
						offset={{
							x: thickness / 2,
							y: thickness / 2 + gap,
						}}
						rotation={-90}
					/>

					<Rect
						x={center}
						y={center}
						width={thickness}
						height={length * -1}
						strokeWidth={outline}
						stroke={outlineEnabled ? 'black' : undefined}
						fill={color}
						offset={{
							x: thickness / 2,
							y: thickness / 2 + gap,
						}}
						visible={!tStyleEnabled}
					/>
					<Rect
						x={center}
						y={center}
						width={thickness}
						height={length * -1}
						strokeWidth={outline}
						stroke={outlineEnabled ? 'black' : undefined}
						fill={color}
						offset={{
							x: thickness / 2,
							y: thickness / 2 + gap,
						}}
						rotation={180}
					/>

					<Rect
						x={center - thickness / 2}
						y={center - thickness / 2}
						width={thickness}
						height={thickness}
						fill={color}
						visible={centerDotEnabled}
					/>
				</Layer>
			</Stage>
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

export default RenderCrosshairCanvas