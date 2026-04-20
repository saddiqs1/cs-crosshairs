import { CrosshairGroup } from '@my-types/api-responses/Crosshair'
import { PostCrosshairGroupsResponse } from '@my-types/api-responses/CrosshairGroups'
import useSWRMutation from 'swr/mutation'

export type CrosshairGroupPostBody = { crosshairGroups: CrosshairGroup[] }

async function postRequest(
	url: RequestInfo,
	{ arg }: { arg: CrosshairGroupPostBody }
) {
	return fetch(url, {
		method: 'POST',
		body: JSON.stringify(arg),
		headers: {
			'Content-Type': 'application/json',
		},
	}).then((res) => res.json() as Promise<PostCrosshairGroupsResponse>)
}

export function useCrosshairGroupPost() {
	const { trigger, isMutating } = useSWRMutation(
		`/api/crosshair-groups`,
		postRequest
	)

	return {
		updateCrosshairGroups: trigger,
		isCrosshairGroupsUpdating: isMutating,
	}
}
