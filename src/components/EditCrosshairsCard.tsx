import classes from './CrosshairCard.module.css'
import { Flex, Modal, Stack, Text } from '@mantine/core'
import { IconEdit } from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks'
import { EditCrosshairsForm } from './EditCrosshairsForm'
import { DBTypes } from '@my-types/database'

type Props = {
	crosshairs: DBTypes['crosshairs'][]
}

export const EditCrosshairsCard: React.FC<Props> = ({ crosshairs }) => {
	const [opened, { open, close }] = useDisclosure(false)

	return (
		<>
			<Stack gap={6} p={'sm'} className={classes.card} onClick={open}>
				<Flex w={100} h={17} justify={'center'} align={'center'}>
					<IconEdit size={28} />
				</Flex>
				<Text ta='center' c={'dimmed'} size={'sm'} w={100} fw={800}>
					Edit/Delete
				</Text>
			</Stack>

			<Modal
				opened={opened}
				onClose={close}
				title={<Text fw={800}>Edit/Delete</Text>}
				size={'auto'}
			>
				<EditCrosshairsForm
					onComplete={close}
					crosshairs={crosshairs}
				/>
			</Modal>
		</>
	)
}
