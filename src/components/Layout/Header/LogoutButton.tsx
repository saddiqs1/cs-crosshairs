import { Button } from '@mantine/core'
import { IconLogout } from '@tabler/icons-react'

type Props = {}

export const UserAvatar: React.FC<Props> = ({}) => {
	return (
		<Button
			leftIcon={<IconLogout />}
			component='a'
			href='/api/auth/logout'
			color='teal'
			variant='outline'
		>
			Logout
		</Button>
	)
}
