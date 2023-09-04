import { Center, Stack, Title, Button, TextInput, Flex } from '@mantine/core'
import { useClipboard } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { crosshairToConVars, decodeCrosshairShareCode } from 'csgo-sharecode'
import { useState } from 'react'

type Props = {}

export const HomePage: React.FC<Props> = ({}) => {
	const [crosshairCode, setCrosshairCode] = useState('')
	const clipboard = useClipboard({ timeout: 2000 })

	const onCopy = () => {
		try {
			const crosshairCommands = crosshairToConVars(
				decodeCrosshairShareCode(crosshairCode)
			).replaceAll('\n', ';')

			clipboard.copy(crosshairCommands)

			notifications.show({
				title: 'Crosshair Copied',
				message: 'Crosshair is copied to your clipboard',
				color: 'green',
			})
		} catch (error) {
			notifications.show({
				title: 'Error Copying Crosshair',
				message: 'Crosshair is copied to your clipboard',
				color: 'red',
			})
		}
	}

	return (
		<Center h={'100vh'}>
			<Stack spacing={'xl'}>
				<Title order={1} ta={'center'}>
					CS2 Crosshair Converter
				</Title>
				<Flex justify={'center'} align={'end'} gap={'xl'}>
					<TextInput
						value={crosshairCode}
						onChange={(event) =>
							setCrosshairCode(event.currentTarget.value)
						}
						label={'Enter Crosshair Code'}
						placeholder={'CSGO-some-random-code'}
						w={320}
					/>
					<Button onClick={onCopy}>Copy Crosshair Commands</Button>
				</Flex>
			</Stack>
		</Center>
	)
}
