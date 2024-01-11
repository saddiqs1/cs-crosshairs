import { EditCrosshairFormValues } from '@components/EditCrosshairsForm'
import { PostCrosshairResponse } from '@my-types/api-responses/Crosshair'
import useSWRMutation from 'swr/mutation'

async function postRequest(
	url: RequestInfo,
	{ arg }: { arg: EditCrosshairFormValues }
) {
	return fetch(url, {
		method: 'POST',
		body: JSON.stringify(arg),
		headers: {
			'Content-Type': 'application/json',
		},
	}).then((res) => res.json() as Promise<PostCrosshairResponse>)
}

export function useCrosshairPost() {
	const { trigger, isMutating } = useSWRMutation(
		`/api/crosshair`,
		postRequest
	)

	return { updateCrosshairs: trigger, isCrosshairsUpdating: isMutating }
}
