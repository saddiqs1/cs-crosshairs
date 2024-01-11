import { AddCrosshairFormValues } from '@components/AddCrosshairForm'
import { PostAddCrosshairResponse } from '@my-types/api-responses/AddCrosshair'
import useSWRMutation from 'swr/mutation'

async function postRequest(
	url: RequestInfo,
	{ arg }: { arg: AddCrosshairFormValues }
) {
	return fetch(url, {
		method: 'POST',
		body: JSON.stringify(arg),
		headers: {
			'Content-Type': 'application/json',
		},
	}).then((res) => res.json() as Promise<PostAddCrosshairResponse>)
}

export function useAddCrosshairPost() {
	const { trigger, isMutating } = useSWRMutation(
		`/api/add-crosshair`,
		postRequest
	)

	return { addCrosshair: trigger, isAddingCrosshair: isMutating }
}
