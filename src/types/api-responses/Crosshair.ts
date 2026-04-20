import { UniqueIdentifier } from '@dnd-kit/core'
import { DBTypes } from '@my-types/database'

export type CrosshairGroup = {
	group: DBTypes['crosshair_groups'] | null
	crosshairs: DBTypes['crosshairs'][]
}

export type CrosshairItems = Record<UniqueIdentifier, DBTypes['crosshairs'][]>

export type GetCrosshairResponse =
	| {
			message: {
				crosshairItems: CrosshairItems
				crosshairs: DBTypes['crosshairs'][]
				groups: DBTypes['crosshair_groups'][]
			}
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
