import { Flex, Loader, Modal, Stack, Text, UnstyledButton } from '@mantine/core'
import { IconEdit } from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks'
import { EditCrosshairsForm } from './EditCrosshairsForm'
import { DBTypes } from '@my-types/database'

type Props = {
	crosshairs: DBTypes['crosshairs'][]
	disabled?: boolean
}

export const EditCrosshairsCard: React.FC<Props> = ({
	crosshairs,
	disabled,
}) => {
	const [opened, { open, close }] = useDisclosure(false)

	return (
		<>
			<UnstyledButton
				disabled={disabled}
				onClick={open}
				sx={(theme) => ({
					border: `1px ${
						disabled ? theme.colors.dark[4] : theme.colors.dark[1]
					} solid`,
					borderRadius: theme.radius.md,
					transition: 'shadow 150ms ease, transform 100ms ease;',
					background: disabled ? theme.colors.dark[5] : undefined,
					'&:hover': disabled
						? undefined
						: {
								boxShadow: theme.shadows.md,
								transform: `scale(1.05)`,
								background: theme.colors.dark[8],
						  },
				})}
			>
				<Stack spacing={6} p={'sm'}>
					<Flex w={100} h={17} justify={'center'} align={'center'}>
						{disabled ? (
							<Loader size={'sm'} />
						) : (
							<IconEdit size={28} />
						)}
					</Flex>
					<Text ta='center' c={'dimmed'} size={'sm'} w={100} fw={800}>
						Edit/Delete
					</Text>
				</Stack>
			</UnstyledButton>

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
