import { CrosshairPreview } from '@components/CrosshairPreview'
import { UserContext } from '@contexts/UserContext'
import { Text, Stack, Flex, Loader, Center } from '@mantine/core'
import { useContext } from 'react'

const SHOOBIE_CROSSHAIR_CODES = [
	{ crosshairCode: 'CSGO-obHU6-NLWyP-EtkUh-pywKV-TXQ3A', name: 'Yellow Dot' },
	{
		crosshairCode: 'CSGO-78PT7-mHExG-UGt7C-HAhdB-GxuWK',
		name: 'Cai DM clip',
	},
	{ crosshairCode: 'CSGO-RoxEW-xZqYv-nzUQZ-UVtvi-cV6uC', name: 'HEAP' },
	{ crosshairCode: 'CSGO-9r8iB-9WwzR-tndTZ-oQo6P-nysyM', name: 'Blue Small' },
	{ crosshairCode: 'CSGO-5fKKR-Eab4o-viAxH-Xvx38-T3SKF', name: 'Norwi' },
	{ crosshairCode: 'CSGO-EiXND-5jUGt-Ru2cm-LwVKc-u6GSQ', name: 'Ryan' },
	{
		crosshairCode: 'CSGO-QeeOU-PKiYd-VH3Rz-5EtTr-8t8rN',
		name: 'Vertigo Pugger',
	},
]

/*
	TODO:
	complete journey of user who is logged in
*/

export default function Manager() {
	const { user, isLoading } = useContext(UserContext)

	return (
		<Stack spacing={'xl'}>
			{isLoading && (
				<Center>
					<Loader size={'lg'} />
				</Center>
			)}

			{!isLoading && user && (
				<>
					<Stack spacing={'xs'}>
						<Text ta={'center'} c={'dimmed'}>
							Login to be able to manage crosshairs. In the
							meantime, here are a choice of crosshairs from
							shoobie!
						</Text>
						<Text ta={'center'} c={'dimmed'}>
							Click on a card below to copy the console commands
							for it.
						</Text>
					</Stack>
					<Flex
						justify={'center'}
						align={'end'}
						gap={'xl'}
						wrap={'wrap'}
					>
						{SHOOBIE_CROSSHAIR_CODES.map((c, i) => (
							<CrosshairPreview
								crosshairCode={c.crosshairCode}
								name={c.name}
								key={i}
							/>
						))}
					</Flex>
				</>
			)}

			{!isLoading && user && (
				<Stack spacing={'xs'}>
					<Text ta={'center'} c={'dimmed'}>
						Welcome, {user.username}!
					</Text>
					<Text ta={'center'} c={'dimmed'}>
						Click on a card below to copy the console commands for
						it.
					</Text>
				</Stack>
			)}
		</Stack>
	)
}
