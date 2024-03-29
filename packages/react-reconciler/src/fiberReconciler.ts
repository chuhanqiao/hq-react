import { Container } from 'hostConfig'
import { FiberNode, FiberRootNode } from './fiber'
import { HostRoot } from './worTags'
import {
	UpdateQueue,
	createUpdate,
	createUpdateQueue,
	enqueueUpdate
} from './updateQueue'
import { ReactElementType } from 'shared/ReactTypes'
import {scheduleUploadOnFiber} from './workLoop'
/**
 * ReactDOM.createRoot().render(<App/>)，
 * createRoot()内部执行createContainer()，
 * render()内部执行updateContainer()
**/
// 创建fiberRootNode
export function createContainer(container: Container) {
	const hostRootFiber = new FiberNode(HostRoot, {}, null)
	const root = new FiberRootNode(container, hostRootFiber)
	hostRootFiber.updateQueue = createUpdateQueue()
	return root
}
export function updateContainer(
	element: ReactElementType | null,
	root: FiberRootNode
) {
	const hostRootFiber = root.current
	const update = createUpdate<ReactElementType | null>(element)
	enqueueUpdate(
		hostRootFiber.updateQueue as UpdateQueue<ReactElementType | null>,
		update
	)
  scheduleUploadOnFiber(hostRootFiber)
	return element
}
