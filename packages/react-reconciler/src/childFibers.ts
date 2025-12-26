import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols'
import { FiberNode } from './fiber'
import { ReactElementType } from 'shared/ReactTypes'
import { FunctionComponent, HostComponent, HostText, WorkTag } from './worTags'
import { ChildDeletion, Placement } from './fiberFlags'

function ChildReconciler(shouldTrackEffects: boolean) {
	function deleteChild(returnFiber: FiberNode, childToDelete: FiberNode) {
		if (!shouldTrackEffects) {
			return
		}
		const deletions = returnFiber.deletions
		if (deletions === null) {
			returnFiber.deletions = [childToDelete]
			returnFiber.flags |= ChildDeletion
		} else {
			deletions.push(childToDelete)
		}
	}
	function reconcileSingleElement(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		element: ReactElementType
	): FiberNode {
		const key = element.key
		if (currentFiber !== null) {
			// update
			if (currentFiber.key === key) {
				// key相同
				if (element.$$typeof === REACT_ELEMENT_TYPE) {
					if (currentFiber.type === element.type) {
						// type相同 可以复用
						return currentFiber
					}
					deleteChild(returnFiber, currentFiber)
					// 继续执行，创建新的fiber
				} else {
					if (__DEV__) {
						console.log('')
					}
					// 继续执行，创建新的fiber
				}
			} else {
				// 删除旧的
				deleteChild(returnFiber, currentFiber)
			}
		}
		// 根据reactElement创建一个fiber并返回
		const fiber = createFiberFromElement(element)
		fiber.return = returnFiber
		return fiber
	}
	function reconcileSingleTextNode(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		content: string | number
	) {
		const fiber = new FiberNode(HostText, { content }, null)
		fiber.return = returnFiber
		return fiber
	}
	function placeSingleChild(fiber: FiberNode) {
		//应该追踪副作用 && 首屏渲染
		if (shouldTrackEffects && fiber.alternate === null) {
			fiber.flags |= Placement
		}
		return fiber
	}
	return function reconcileChildFibers(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		newChild?: ReactElementType
	) {
		// 判断当前fiber的类型
		if (typeof newChild === 'object' && newChild !== null) {
			switch (newChild.$$typeof) {
				case REACT_ELEMENT_TYPE:
					return placeSingleChild(
						reconcileSingleElement(returnFiber, currentFiber || null, newChild)
					)
				default:
					if (__DEV__) {
						console.warn('未实现的reconcile类型', newChild)
					}
					break
			}
		}
		// TODO 多接点情况
		// 文本节点
		if (typeof newChild === 'string' || typeof newChild === 'number') {
			return placeSingleChild(
				reconcileSingleTextNode(returnFiber, currentFiber, newChild)
			)
		}
		if (__DEV__) {
			console.warn('未实现的reconcile类型', newChild)
		}
		return null
	}
}
export const reconcileChildFibers = ChildReconciler(true)
export const mountChildFibers = ChildReconciler(false)

export function createFiberFromElement(element: ReactElementType): FiberNode {
	const { type, key, props } = element
	let fiberTag: WorkTag = FunctionComponent
	if (typeof type === 'string') {
		// 例如<div></div> type: 'div'
		fiberTag = HostComponent
	} else if (typeof type !== 'function' && __DEV__) {
		console.warn('未定义的type类型', element)
	}

	const fiber = new FiberNode(fiberTag, props, key)
	fiber.type = type
	return fiber
}
