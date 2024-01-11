import { Flex, Modal, Stack, Text } from '@mantine/core'
import { IconCrosshair } from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks'
import { AddCrosshairForm } from './AddCrosshairForm'

type Props = {}

export const AddCrosshairCard: React.FC<Props> = ({}) => {
	const [opened, { open, close }] = useDisclosure(false)

	return (
		<>
			<Stack
				spacing={6}
				p={'sm'}
				sx={(theme) => ({
					border: `1px ${theme.colors.dark[1]} solid`,
					borderRadius: theme.radius.md,
					transition: 'shadow 150ms ease, transform 100ms ease;',
					'&:hover': {
						cursor: 'pointer',
						boxShadow: theme.shadows.md,
						transform: `scale(1.05)`,
						background: theme.colors.dark[8],
					},
				})}
				onClick={open}
			>
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
