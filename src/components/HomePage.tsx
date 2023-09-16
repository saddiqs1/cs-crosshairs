import { copy } from '@lib/copy'
import { Center, Stack, Title, Button, TextInput, Flex } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useState } from 'react'
const csgoSharecode = require('csgo-sharecode')

type Props = {}

export const HomePage: React.FC<Props> = ({}) => {
	const [crosshairCode, setCrosshairCode] = useState('')

	const onCopy = () => {
		try {
			const crosshairCommands = csgoSharecode
				.crosshairToConVars(
					csgoSharecode.decodeCrosshairShareCode(crosshairCode)
				)
				.replaceAll('\n', ';')

			copy(crosshairCommands)

			notifications.show({
				title: 'Crosshair Copied',
				message: 'Crosshair is copied to your clipboard',
				color: 'green',
			})
		} catch (error: any) {
			notifications.show({
				title: 'Error Copying Crosshair',
				message: 'Crosshair input is in an incorrect format',
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
