import fetcher from '@lib/fetcher'
import { GetCrosshairResponse } from '@my-types/api-responses/Crosshair'
import { DBTypes } from '@my-types/database'
import useSWRImmutable from 'swr/immutable'

export function useCrosshair() {
	const { data, isLoading, mutate } = useSWRImmutable<GetCrosshairResponse>(
		`/api/crosshair`,
		fetcher
	)

	let crosshairs: DBTypes['crosshairs'][] = []
	if (data && data.success) {
		crosshairs = data.message
	}

	return {
		crosshairs,
		isCrosshairsLoading: isLoading,
		mutateCrosshairs: mutate,
	}
}
