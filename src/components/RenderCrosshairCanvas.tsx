import { getColor } from '@lib/crosshairUtils'
import { Box } from '@mantine/core'
import { Stage, Layer, Rect, Group } from 'react-konva'

type Props = {
	crosshair: Crosshair
	size: number
	onClick: () => void
}

// https://github.com/hauptrolle/csgo-crosshair-generator/blob/master/src/components/CrosshairPreview/CrosshairPreview.js
// TODO - Can the below code work with svg...

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
		? 0.5
		: Math.floor(outlineThickness)
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

const RenderCrosshairCanvas: React.FC<Props> = ({
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

	// NOTE: The order of the groups in the code below are in a specific order for a reason, to mimic the order of priority for the lines of a crosshair in CS2.
	// i.e. from bottom to top, left line, right line, top line, bottom line and then dot.
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
			<Stage width={size} height={size}>
				<Layer>
					<Group>
						{/* Left */}
						<Group>
							<Rect
								x={
									center -
									(crosshairLength +
										crosshairWidth / 2 +
										crosshairGap) -
									outlineThickness
								}
								y={
									center -
									crosshairWidth / 2 -
									outlineThickness
								}
								width={crosshairLength + outlineThickness * 2}
								height={crosshairWidth + outlineThickness * 2}
								fill={'#000000'}
								visible={outlineEnabled}
							/>

							<Rect
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
						</Group>

						{/* Right */}
						<Group>
							<Rect
								x={
									center +
									(crosshairWidth / 2 + crosshairGap) -
									outlineThickness
								}
								y={
									center -
									crosshairWidth / 2 -
									outlineThickness
								}
								width={crosshairLength + outlineThickness * 2}
								height={crosshairWidth + outlineThickness * 2}
								fill={'#000000'}
								visible={outlineEnabled}
							/>
							<Rect
								x={center + (crosshairWidth / 2 + crosshairGap)}
								y={center - crosshairWidth / 2}
								width={crosshairLength}
								height={crosshairWidth}
								fill={color}
							/>
						</Group>

						{/* Top */}
						<Group visible={!tStyleEnabled}>
							<Rect
								x={
									center -
									crosshairWidth / 2 -
									outlineThickness
								}
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
								visible={outlineEnabled}
							/>
							<Rect
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
						</Group>

						{/* Bottom */}
						<Group>
							<Rect
								x={
									center -
									crosshairWidth / 2 -
									outlineThickness
								}
								y={
									center +
									(crosshairWidth / 2 + crosshairGap) -
									outlineThickness
								}
								width={crosshairWidth + outlineThickness * 2}
								height={crosshairLength + outlineThickness * 2}
								fill={'#000000'}
								visible={outlineEnabled}
							/>

							<Rect
								x={center - crosshairWidth / 2}
								y={center + (crosshairWidth / 2 + crosshairGap)}
								width={crosshairWidth}
								height={crosshairLength}
								fill={color}
							/>
						</Group>

						{/* Dot */}
						<Group visible={centerDotEnabled}>
							<Rect
								x={
									center -
									crosshairWidth / 2 -
									outlineThickness
								}
								y={
									center -
									crosshairWidth / 2 -
									outlineThickness
								}
								width={crosshairWidth + outlineThickness * 2}
								height={crosshairWidth + outlineThickness * 2}
								fill={'#000000'}
								visible={outlineEnabled}
							/>

							<Rect
								x={center - crosshairWidth / 2}
								y={center - crosshairWidth / 2}
								width={crosshairWidth}
								height={crosshairWidth}
								fill={color}
							/>
						</Group>
					</Group>
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

export default RenderCrosshairCanvas
