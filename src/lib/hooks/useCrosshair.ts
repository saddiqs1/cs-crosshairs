import fetcher from '@lib/fetcher'
import { CrosshairItems, GetCrosshairResponse } from '@my-types/api-responses/Crosshair'
import { DBTypes } from '@my-types/database'
import useSWRImmutable from 'swr/immutable'

export function useCrosshair() {
	const { data, isLoading, mutate } = useSWRImmutable<GetCrosshairResponse>(`/api/crosshair`, fetcher)

	let crosshairItems: CrosshairItems | null = null
	let crosshairs: DBTypes['crosshairs'][] = []
	let groups: DBTypes['crosshair_groups'][] = []

	if (data && data.success) {
		crosshairItems = data.message.crosshairItems
		crosshairs = data.message.crosshairs
		groups = data.message.groups
	}

	return {
		crosshairItems,
		crosshairs,
		groups,
		isCrosshairsLoading: isLoading,
		mutateCrosshairs: mutate,
	}
}
