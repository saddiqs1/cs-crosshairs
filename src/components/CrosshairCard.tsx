import { ActionIcon, Box, Center, Stack, Text } from '@mantine/core'
import { RenderCrosshair } from './RenderCrosshair'
import { copyCommands, getCrosshair } from '@lib/crosshairUtils'
import { IconGripHorizontal } from '@tabler/icons-react'
import { DraggableProps } from '@my-types/draggable'

export type CrosshairCardProps = {
	crosshairCode: string
	name: string
	dragOverlay?: boolean
}

export const CrosshairCard: React.FC<CrosshairCardProps & DraggableProps> = ({
	crosshairCode,
	name,
	dragOverlay,
	attributes,
	listeners,
	setActivatorNodeRef,
}) => {
	const isDraggable = !!setActivatorNodeRef

	return (
		<Stack
			spacing={2}
			pb={isDraggable ? 2 : undefined}
			bg='dark.8'
			sx={(theme) => ({
				borderRadius: theme.radius.md,
				border: `1px solid ${theme.colors.dark[6]}`,
			})}
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
						transform: `scale(1.05)`,
						background: theme.colors.dark[4],
					},
				})}
				title={`Copy ${name}`}
				onClick={() => copyCommands(crosshairCode)}
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
			{isDraggable && (
				<Center>
					<ActionIcon
						ref={setActivatorNodeRef}
						{...attributes}
						{...listeners}
						sx={{ cursor: dragOverlay ? 'grabbing' : 'grab' }}
					>
						<IconGripHorizontal size='1rem' />
					</ActionIcon>
				</Center>
			)}
		</Stack>
	)
}
