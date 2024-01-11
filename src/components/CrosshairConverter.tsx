import { useCrosshair } from '@lib/hooks/useCrosshair'
import { Button, TextInput, Flex } from '@mantine/core'
import { useState } from 'react'

type Props = {}

export const CrosshairConverter: React.FC<Props> = ({}) => {
	const [crosshairCode, setCrosshairCode] = useState('')
	const { copyCommands } = useCrosshair()

	const onCopy = () => {
		copyCommands(crosshairCode)
	}

	return (
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
	)
}
