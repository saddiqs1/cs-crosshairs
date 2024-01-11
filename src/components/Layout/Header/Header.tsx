// Taken from https://ui.mantine.dev/component/header-simple/

import {
	Group,
	Title,
	Header as MantineHeader,
	Container,
	MediaQuery,
	Burger,
	Popover,
	Stack,
} from '@mantine/core'
import { IconViewfinder } from '@tabler/icons-react'
import { HeaderLink } from './HeaderLink'
import { useRouter } from 'next/router'
import { LoginButton } from './LoginButton'
import { useContext } from 'react'
import { UserContext } from '@contexts/UserContext'
import { UserAvatar } from './LogoutButton'
import { useDisclosure } from '@mantine/hooks'

const LINKS = [
	{ link: '/', label: 'Converter' },
	{ link: '/manager', label: 'Manager' },
]

type Props = {}

export const Header: React.FC<Props> = ({}) => {
	const router = useRouter()
	const { user, isLoading } = useContext(UserContext)
	const [opened, { close, toggle }] = useDisclosure(false)

	const buttons = (
		<>
			{LINKS.map((link, i) => (
				<HeaderLink
					key={i}
					href={link.link}
					label={link.label}
					isActive={router.pathname === link.link}
				/>
			))}
			{user && !isLoading ? <UserAvatar /> : <LoginButton />}
		</>
	)

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
					<MediaQuery smallerThan={'xs'} styles={{ display: 'none' }}>
						<Title order={3}>CS2 Crosshair App</Title>
					</MediaQuery>
				</Group>

				<MediaQuery smallerThan={'md'} styles={{ display: 'none' }}>
					<Group spacing={'xl'}>{buttons}</Group>
				</MediaQuery>
				<MediaQuery largerThan={'md'} styles={{ display: 'none' }}>
					<Popover opened={opened} onChange={toggle}>
						<Popover.Target>
							<Burger
								opened={opened}
								onClick={toggle}
								size='md'
							/>
						</Popover.Target>

						<Popover.Dropdown>
							<Stack align='center'>{buttons}</Stack>
						</Popover.Dropdown>
					</Popover>
				</MediaQuery>
			</Container>
		</MantineHeader>
	)
}
