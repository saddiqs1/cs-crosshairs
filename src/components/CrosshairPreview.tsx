import { useState } from 'react'
import { Box, Stack, Text, Button, NumberInput } from '@mantine/core'
import { RenderCrosshair } from './RenderCrosshair'
import {
	copyCommands,
	copyCrosshairCode,
	getCrosshair,
} from '@lib/crosshairUtils'

type Props = {
	crosshairCode: string
	name: string
}

export const CrosshairPreview: React.FC<Props> = ({ crosshairCode, name }) => {
	const [height, setHeight] = useState<number | ''>(1080)
	let crosshair
	try {
		crosshair = getCrosshair(crosshairCode, Number(height))
	} catch {
		/* Show the saved code even if it cannot be decoded. */
	}
	return (
		<Stack
			spacing={6}
			p={'sm'}
			bg='dark.5'
			sx={(theme) => ({
				borderRadius: theme.radius.md,
				transition: 'shadow 150ms ease, transform 100ms ease;',
				'&:hover': {
					boxShadow: theme.shadows.md,
					transform: `scale(1.05)`,
					background: theme.colors.dark[4],
				},
			})}
			title={`Copy ${name}`}
		>
			{crosshair ? (
				<RenderCrosshair crosshair={crosshair} size={100} />
			) : (
				<Text size='sm'>Invalid crosshair code</Text>
			)}
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
			<NumberInput
				label='Screen height'
				title='Original screen height for pre-update codes'
				value={height}
				onChange={setHeight}
				min={240}
				max={65535}
				precision={0}
				w={120}
			/>
			<Button
				size='xs'
				onClick={() => copyCommands(crosshairCode, Number(height))}
			>
				Copy commands
			</Button>
			<Button
				size='xs'
				variant='light'
				onClick={() => copyCrosshairCode(crosshairCode, Number(height))}
			>
				Copy CS2 code
			</Button>
		</Stack>
	)
}
