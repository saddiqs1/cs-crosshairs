import { CrosshairCard } from '@components/CrosshairCard'
import { Flex } from '@mantine/core'
import { DBTypes } from '@my-types/database'

type Props = {
	crosshairs: DBTypes['crosshairs'][]
}

export const CrosshairList: React.FC<Props> = ({ crosshairs }) => {
	return (
		<Flex justify={'left'} align={'end'} gap={'xl'} wrap={'wrap'}>
			{crosshairs.map((c, i) => (
				<CrosshairCard
					id={c.id}
					crosshairCode={c.crosshair}
					name={c.name}
					key={i}
				/>
			))}
		</Flex>
	)
}
