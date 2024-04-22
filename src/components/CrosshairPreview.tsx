import { Box, Stack, Text } from '@mantine/core'
import { RenderCrosshair } from './RenderCrosshair'
import { copyCommands, getCrosshair } from '@lib/crosshairUtils'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

type Props = {
	id: number
	crosshairCode: string
	name: string
}

export const CrosshairPreview: React.FC<Props> = ({
	id,
	crosshairCode,
	name,
}) => {
	const { attributes, listeners, setNodeRef, transform, isDragging } =
		useDraggable({
			id,
		})
	const style = {
		transform: CSS.Translate.toString(transform),
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
			// TODO - figure out clicking vs dragging
			onClick={() => copyCommands(crosshairCode)}
		>
			<Stack
				spacing={6}
				p={'sm'}
				bg='dark.5'
				sx={(theme) => ({
					borderRadius: theme.radius.md,
					transition: 'shadow 150ms ease, transform 100ms ease;',
					'&:hover': {
						cursor: 'pointer',
						boxShadow: theme.shadows.md,
						transform: isDragging ? undefined : `scale(1.05)`,
						background: theme.colors.dark[4],
					},
				})}
				title={`Copy ${name}`}
			>
				<RenderCrosshair
					crosshair={getCrosshair(crosshairCode)}
					size={100}
				/>
				{name.length > 0 ? (
					<Text
						ta='center'
						c={'dimmed'}
						size={'sm'}
						lh={1.5}
						sx={{
							width: 100,
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
						}}
					>
						{name}
					</Text>
				) : (
					<Box h={22} />
				)}
			</Stack>
		</div>
	)
}
