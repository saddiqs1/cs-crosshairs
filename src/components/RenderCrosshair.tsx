import { Crosshair } from '@my-types/crosshair'

type Props = { crosshair: Crosshair; size: number }

// Dynamic styles show their resting shape.
export const RenderCrosshair: React.FC<Props> = ({ crosshair: c, size }) => {
	const scale = ((1080 / (c.screenHeight || 1080)) * size) / 100
	const length = c.length * scale
	const width = Math.max(1, c.thickness) * scale
	const gap = c.gap * scale
	const center = size / 2
	const color = `rgba(${c.red}, ${c.green}, ${c.blue}, ${c.alpha / 255})`
	const outline = `rgba(${c.outlineRed}, ${c.outlineGreen}, ${
		c.outlineBlue
	}, ${c.outlineMode ? c.outlineAlpha / 255 : 0})`
	const stroke = c.outlineMode ? scale : 0
	const outlineExtent = c.outlineMode === 2 ? stroke : stroke * 2
	const circle = c.style === 1 || c.style === 3
	const quad = c.style === 7 || c.style === 9
	const dotOnly = c.style === 6
	const square = c.style === 8
	const bars = [
		{
			x: center - gap - length,
			y: center - width / 2,
			width: length,
			height: width,
		},
		{
			x: center + gap,
			y: center - width / 2,
			width: length,
			height: width,
		},
		...(!c.tStyleEnabled
			? [
					{
						x: center - width / 2,
						y: center - gap - length,
						width,
						height: length,
					},
			  ]
			: []),
		{ x: center - width / 2, y: center + gap, width, height: length },
	]
	return (
		<svg
			viewBox={`0 0 ${size} ${size}`}
			width={size}
			height={size}
			xmlns='http://www.w3.org/2000/svg'
			shapeRendering='crispEdges'
			role='img'
			aria-label='Crosshair preview at rest'
		>
			{!dotOnly && (circle || square) && (
				<>
					{circle ? (
						<circle
							cx={center}
							cy={center}
							r={Math.max(0, gap + length / 2)}
							fill='none'
							stroke={outline}
							strokeWidth={width + stroke * 2}
						/>
					) : (
						<rect
							x={center - Math.max(0, gap)}
							y={center - Math.max(0, gap)}
							width={Math.max(0, gap * 2)}
							height={Math.max(0, gap * 2)}
							fill='none'
							stroke={outline}
							strokeWidth={width + stroke * 2}
						/>
					)}
					{circle ? (
						<circle
							cx={center}
							cy={center}
							r={Math.max(0, gap + length / 2)}
							fill='none'
							stroke={color}
							strokeWidth={width}
						/>
					) : (
						<rect
							x={center - Math.max(0, gap)}
							y={center - Math.max(0, gap)}
							width={Math.max(0, gap * 2)}
							height={Math.max(0, gap * 2)}
							fill='none'
							stroke={color}
							strokeWidth={width}
						/>
					)}
				</>
			)}
			{!dotOnly && !circle && !square && (
				<g
					transform={
						quad ? `rotate(45 ${center} ${center})` : undefined
					}
				>
					{bars.map((bar, i) => (
						<g key={i}>
							{stroke > 0 && (
								<rect
									x={bar.x - stroke}
									y={bar.y - stroke}
									width={bar.width + outlineExtent}
									height={bar.height + outlineExtent}
									fill={outline}
								/>
							)}
							<rect {...bar} fill={color} />
						</g>
					))}
				</g>
			)}
			{(c.centerDotEnabled || dotOnly) && (
				<>
					{stroke > 0 && (
						<rect
							x={center - width / 2 - stroke}
							y={center - width / 2 - stroke}
							width={width + stroke * 2}
							height={width + stroke * 2}
							fill={outline}
						/>
					)}
					<rect
						x={center - width / 2}
						y={center - width / 2}
						width={width}
						height={width}
						fill={color}
					/>
				</>
			)}
		</svg>
	)
}
