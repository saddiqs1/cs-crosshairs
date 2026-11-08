// Taken from https://ui.mantine.dev/component/header-simple/

import {
	Group,
	Title,
	AppShell,
	Container,
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

export const Header: React.FC = () => {
	const router = useRouter()
	const { user, isLoading } = useContext(UserContext)
	const [opened, { toggle }] = useDisclosure(false)

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
		<AppShell.Header>
			<Container
				h={56}
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Group gap={'xs'}>
					<IconViewfinder size={28} />
					<Title order={3} visibleFrom='xs'>
						CS2 Crosshair App
					</Title>
				</Group>

				<Group gap={'xl'} visibleFrom='md'>
					{buttons}
				</Group>
				<Popover opened={opened} onChange={toggle}>
					<Popover.Target>
						<Burger
							opened={opened}
							hiddenFrom='md'
							aria-label='Toggle navigation'
							onClick={toggle}
							size='md'
						/>
					</Popover.Target>

					<Popover.Dropdown hiddenFrom='md'>
						<Stack align='center'>{buttons}</Stack>
					</Popover.Dropdown>
				</Popover>
			</Container>
		</AppShell.Header>
	)
}
