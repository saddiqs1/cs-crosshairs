import { User } from '@my-types/user'
import { createContext } from 'react'

export interface IUserContext {
	user?: User
	isLoading: boolean
}

export const UserContext = createContext<IUserContext>(undefined as any)
