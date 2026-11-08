import classes from './CrosshairCard.module.css'
import { Flex, Modal, Stack, Text } from '@mantine/core'
import { IconCrosshair } from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks'
import { AddCrosshairForm } from './AddCrosshairForm'

type Props = {}

export const AddCrosshairCard: React.FC<Props> = ({}) => {
	const [opened, { open, close }] = useDisclosure(false)

	return (
		<>
			<Stack gap={6} p={'sm'} className={classes.card} onClick={open}>
				<Flex w={100} h={17} justify={'center'} align={'center'}>
					<IconCrosshair size={28} />
				</Flex>
				<Text ta='center' c={'dimmed'} size={'sm'} w={100} fw={800}>
					Add Crosshair
				</Text>
			</Stack>

			<Modal
				opened={opened}
				onClose={close}
				title={<Text fw={800}>Add Crosshair</Text>}
			>
				<AddCrosshairForm onComplete={close} />
			</Modal>
		</>
	)
}
