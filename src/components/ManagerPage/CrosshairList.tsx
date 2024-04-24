import { CrosshairCard } from '@components/CrosshairCard'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { Flex } from '@mantine/core'
import { DBTypes } from '@my-types/database'

type Props = {
	id: number | string
	crosshairs: DBTypes['crosshairs'][]
}

export const CrosshairList: React.FC<Props> = ({ id, crosshairs }) => {
	const { isOver, setNodeRef } = useDroppable({ id })
	const style = {
		backgroundColor: isOver ? 'green' : undefined,
	}

	return (
		<SortableContext items={crosshairs.map((c) => c.id)}>
			<div ref={setNodeRef} style={style}>
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
			</div>
		</SortableContext>
	)
}
