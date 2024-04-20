import fetcher from '@lib/fetcher'
import {
	CrosshairGroup,
	GetCrosshairResponse,
} from '@my-types/api-responses/Crosshair'
import useSWRImmutable from 'swr/immutable'

export function useCrosshair() {
	const { data, isLoading, mutate } = useSWRImmutable<GetCrosshairResponse>(
		`/api/crosshair`,
		fetcher
	)

	let crosshairs: CrosshairGroup[] = []
	if (data && data.success) {
		crosshairs = data.message
	}

	return {
		crosshairs,
		isCrosshairsLoading: isLoading,
		mutateCrosshairs: mutate,
	}
}
