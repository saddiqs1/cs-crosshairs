import { Center, Stack, Title, Group, Button } from '@mantine/core'
import { notifications } from '@mantine/notifications'

type Props = {}

export const HomePage: React.FC<Props> = ({}) => {
	const notification = () => {
		notifications.show({
			title: 'Default notification',
			message: 'Hey there, your code is awesome! 🤥',
		})
	}

	return (
		<Center h={'100vh'}>
			<Stack spacing={'xl'}>
				<Title order={1} ta={'center'}>
					App Template
				</Title>
				<Group position={'apart'} spacing={'xl'}>
					<Button component='a' href='/api/hello'>
						api/hello
					</Button>
					<Button
						component='a'
						href='https://mantine.dev/pages/getting-started/'
						target='_blank'
					>
						mantine docs
					</Button>
					<Button onClick={notification}>notifications</Button>
				</Group>
			</Stack>
		</Center>
	)
}
