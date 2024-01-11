import { UnstyledButton, Text } from '@mantine/core'
import Link from 'next/link'

type Props = {
	href: string
	label: string
	isActive?: boolean
}

export const HeaderLink: React.FC<Props> = ({ href, label, isActive }) => {
	const button = (
		<UnstyledButton
			sx={(theme) => ({
				color: isActive ? '#fff' : theme.colors.dark[0],
				background: isActive ? theme.colors.blue[6] : undefined,
				fontSize: theme.fontSizes.sm,
				borderRadius: theme.radius.sm,
				'&:hover': !isActive && {
					cursor: 'pointer',
					background: theme.colors.dark[6],
				},
			})}
			px={12}
			py={8}
			h={'100%'}
		>
			<Text size={'inherit'} c={'inherit'}>
				{label}
			</Text>
		</UnstyledButton>
	)

	if (href.startsWith('/'))
		return (
			<Link href={href} style={{ height: '100%' }}>
				{button}
			</Link>
		)

	return (
		<a href={href} target={'_blank'} style={{ height: '100%' }}>
			{button}
		</a>
	)
}
