import { Flex, Stack, Text } from '@mantine/core'
import { IconCrosshair } from '@tabler/icons-react'

type Props = {}

export const AddCrosshairCard: React.FC<Props> = ({}) => {
	return (
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
			onClick={() => alert('hi')}
		>
			<Text ta='center' c={'dimmed'} size={'sm'} w={100} fw={800}>
				Add Crosshair
			</Text>
			<Flex w={100} h={100} justify={'center'} align={'center'}>
				<IconCrosshair size={48} />
			</Flex>
		</Stack>
	)
}
