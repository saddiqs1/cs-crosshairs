import { UnstyledButton, Text } from '@mantine/core'
import Link from 'next/link'
import classes from './HeaderLink.module.css'

type Props = {
	href: string
	label: string
	isActive?: boolean
}

export const HeaderLink: React.FC<Props> = ({ href, label, isActive }) => {
	const button = (
		<UnstyledButton
			className={classes.link}
			data-active={isActive || undefined}
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
