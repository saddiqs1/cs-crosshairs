import { Button } from '@mantine/core'
import { IconBrandSteam } from '@tabler/icons-react'

type Props = {}

export const LoginButton: React.FC<Props> = ({}) => {
	return (
		<Button
			leftIcon={<IconBrandSteam />}
			component='a'
			href='/api/auth/login'
			color='teal'
		>
			Login
		</Button>
	)
}
