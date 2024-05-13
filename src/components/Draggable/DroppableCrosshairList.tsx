import { useDroppable } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { Flex } from '@mantine/core'
import { DBTypes } from '@my-types/database'
import { SortableCrosshairCardItem } from './SortableCrosshairCardItem'

type Props = {
	id: string
	crosshairs: DBTypes['crosshairs'][]
}

export const DroppableCrosshairList: React.FC<Props> = ({ id, crosshairs }) => {
	const { setNodeRef } = useDroppable({ id })

	return (
		<SortableContext id={id} items={[]} strategy={rectSortingStrategy}>
			<div ref={setNodeRef}>
				<Flex justify={'left'} align={'end'} gap={'xl'} wrap={'wrap'}>
					{crosshairs.map((c, i) => (
						<SortableCrosshairCardItem
							key={i}
							id={c.id}
							crosshairCode={c.crosshair}
							name={c.name}
						/>
					))}
				</Flex>
			</div>
		</SortableContext>
	)
}
