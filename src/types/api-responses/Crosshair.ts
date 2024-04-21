import { DBTypes } from '@my-types/database'

export type CrosshairGroup = {
	group: DBTypes['crosshair_groups'] | null
	crosshairs: DBTypes['crosshairs'][]
}

export type GetCrosshairResponse =
	| {
			message: CrosshairGroup[]
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
