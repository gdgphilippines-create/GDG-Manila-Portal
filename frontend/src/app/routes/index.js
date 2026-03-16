import { adminRoutes } from './adminRoutes'
import { publicRoutes } from './publicRoutes'
export { renderRoutes } from './renderRoutes'

export const appRoutes = [...publicRoutes, ...adminRoutes]
