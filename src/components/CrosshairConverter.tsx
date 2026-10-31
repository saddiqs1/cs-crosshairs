import { copyCommands, copyCrosshairCode } from '@lib/crosshairUtils'
import { Button, TextInput, Flex, Stack, NumberInput } from '@mantine/core'
import { useState } from 'react'

export const CrosshairConverter = () => {
	const [crosshairCode, setCrosshairCode] = useState('')
	const [height, setHeight] = useState<number | ''>(1080)
	return (
		<Stack align='center'>
			<Flex justify='center' align='end' gap='md' wrap='wrap'>
				<TextInput
					value={crosshairCode}
					onChange={(event) =>
						setCrosshairCode(event.currentTarget.value)
					}
					label='Enter Crosshair code'
					placeholder='CS...'
					w={360}
				/>
				<NumberInput
					value={height}
					onChange={setHeight}
					label='Original screen height'
					description='For pre-update codes, e.g. 960 for 1280 x 960.'
					min={240}
					max={65535}
					precision={0}
				/>
			</Flex>
			<Flex gap='md' justify='center' wrap='wrap'>
				<Button
					onClick={() => copyCommands(crosshairCode, Number(height))}
				>
					Copy Crosshair Commands
				</Button>
				<Button
					variant='light'
					onClick={() =>
						copyCrosshairCode(crosshairCode, Number(height))
					}
				>
					Copy Crosshair Code
				</Button>
			</Flex>
		</Stack>
	)
}
