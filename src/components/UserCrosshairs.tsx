import { Center, Flex, Loader } from '@mantine/core'
import { useCrosshair } from '@lib/hooks/useCrosshair'
import { CrosshairPreview } from './CrosshairPreview'
import { AddCrosshairCard } from './AddCrosshairCard'

type Props = {}

export const UserCrosshairs: React.FC<Props> = () => {
	const { crosshairs, isCrosshairsLoading } = useCrosshair()

	return (
		<>
			{isCrosshairsLoading ? (
				<Center>
					<Loader size={'lg'} />
				</Center>
			) : (
				<Flex justify={'center'} align={'end'} gap={'xl'} wrap={'wrap'}>
					{crosshairs.map((c, i) => (
						<CrosshairPreview
							crosshairCode={c.crosshair}
							name={c.name}
							key={i}
						/>
					))}
					<AddCrosshairCard />
				</Flex>
			)}
		</>
	)
}
