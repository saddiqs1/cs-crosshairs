import { AddCrosshairCard } from '@components/AddCrosshairCard'
import { CrosshairPage } from '@components/CrosshairPage'
import { CrosshairPreview } from '@components/CrosshairPreview'
import { EditCrosshairsCard } from '@components/EditCrosshairsCard'
import { UserContext } from '@contexts/UserContext'
import { useCrosshair } from '@lib/hooks/useCrosshair'
import {
	Text,
	Stack,
	Flex,
	Loader,
	Center,
	Group,
	MediaQuery,
} from '@mantine/core'
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
// https://dnd.hellopangea.com/?path=/story/examples-multiple-horizontal-lists--stress-test
export default function Manager() {
	const { user, isLoading } = useContext(UserContext)
	const { crosshairs, isCrosshairsLoading } = useCrosshair()

	return (
		<Stack spacing={'xl'}>
			{isLoading && (
				<Center>
					<Loader size={'lg'} />
				</Center>
			)}

			{!isLoading && !user && (
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
				<>
					<Group position='center' spacing={'xl'}>
						<MediaQuery
							smallerThan={'sm'}
							styles={{ display: 'none' }}
						>
							<Stack spacing={'xs'} w={'30%'}>
								<Text ta={'center'} c={'dimmed'}>
									Welcome, {user.username}!
								</Text>
								<Text ta={'center'} c={'dimmed'}>
									Add crosshairs, and then click on a card
									below to copy the console commands for it.
								</Text>
							</Stack>
						</MediaQuery>
						<AddCrosshairCard />
						{/* <EditCrosshairsCard
							crosshairs={crosshairs[0].crosshairs}
							disabled={isCrosshairsLoading}
						/> */}
					</Group>
					{isCrosshairsLoading ? (
						<Center>
							<Loader size={'lg'} />
						</Center>
					) : (
						<CrosshairPage crosshairGroups={crosshairs} />
					)}
				</>
			)}
		</Stack>
	)
}
