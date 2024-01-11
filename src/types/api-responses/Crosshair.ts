import { DBTypes } from '@my-types/database'

export type GetCrosshairResponse =
	| {
			message: DBTypes['crosshairs'][]
			success: true
	  }
	| {
			message: string
			success: false
	  }

export type PostCrosshairResponse = {
	message: string
	success: boolean
}
