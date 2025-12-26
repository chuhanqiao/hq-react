import {
	createContainer,
	updateContainer
} from 'react-reconciler/src/fiberReconciler'
import { Container } from './hostConfig'
import { ReactElementType } from 'shared/ReactTypes'

export function createRoot(container: Container) {
	console.log(container, '----container')
	const root = createContainer(container)
	return {
		render(element: ReactElementType) {
			console.log(element, '---element')
			return updateContainer(element, root)
		}
	}
}
