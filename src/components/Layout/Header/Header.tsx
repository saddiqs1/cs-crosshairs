// Taken from https://ui.mantine.dev/component/header-simple/

import { Group, Title, Header as MantineHeader, Container } from '@mantine/core'
import { IconViewfinder } from '@tabler/icons-react'
import { HeaderLink } from './HeaderLink'
import { useRouter } from 'next/router'
import { LoginButton } from './LoginButton'
import { useContext } from 'react'
import { UserContext } from '@contexts/UserContext'
import { UserAvatar } from './LogoutButton'

const LINKS = [
	{ link: '/', label: 'Converter' },
	{ link: '/manager', label: 'Manager' },
]

type Props = {}

export const Header: React.FC<Props> = ({}) => {
	const router = useRouter()
	const { user, isLoading } = useContext(UserContext)

	return (
		<MantineHeader height={56} withBorder>
			<Container
				h={56}
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Group spacing={'xs'}>
					<IconViewfinder size={28} />
					<Title order={3}>CS2 Crosshair App</Title>
				</Group>
				<Group spacing={'xl'}>
					{LINKS.map((link, i) => (
						<HeaderLink
							key={i}
							href={link.link}
							label={link.label}
							isActive={router.pathname === link.link}
						/>
					))}
					{user && !isLoading ? <UserAvatar /> : <LoginButton />}
				</Group>
			</Container>
		</MantineHeader>
	)
}
