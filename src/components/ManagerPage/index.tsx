import { Center, Loader } from '@mantine/core'
import { useCrosshair } from '@lib/hooks/useCrosshair'
import { ManagerPageCrosshairs } from './ManagerPageCrosshairs'

type Props = {
	username: string
}

/*
	TODO:
	https://docs.dndkit.com/
	https://master--5fc05e08a4a65d0021ae0bf2.chromatic.com/?path=/story/presets-sortable-multiple-containers--vertical-grid

	when dragging crosshair...:
		1 - can drop onto 'add crosshair button' to create new group for it
		2 - can drop into a list that is already there to add to that group
		3 - can reorder within its current list
*/

export const ManagerPage: React.FC<Props> = ({ username }) => {
	const { crosshairs, isCrosshairsLoading } = useCrosshair()

	return (
		<>
			{isCrosshairsLoading ? (
				<Center>
					<Loader size={'lg'} />
				</Center>
			) : (
				<ManagerPageCrosshairs
					username={username}
					crosshairGroups={crosshairs}
				/>
			)}
		</>
	)
}
