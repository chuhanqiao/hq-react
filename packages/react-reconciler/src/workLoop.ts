import { beginWork } from './beginWork'
import { commitMutationEffect } from './commitWork'
import { completeWork } from './completeWork'
import { FiberNode, FiberRootNode, createWorkInProgress } from './fiber'
import { MutationMask, NoFlags } from './fiberFlags'
import { HostRoot } from './worTags'

// 全局指针指向当前正在工作的单元
let workInProgress: FiberNode | null = null

function prepareFreshStack(root: FiberRootNode) {
	// 根据hostRootFiber生成对应的workInProgress的hostRootFiber
	workInProgress = createWorkInProgress(root.current, {})
}
export function scheduleUploadOnFiber(fiber: FiberNode) {
	const root = markUpdateFromFiberToRoot(fiber)
	renderRoot(root)
}
// 从当前更新的节点向上遍历到根节点fiberRootNode
function markUpdateFromFiberToRoot(fiber: FiberNode) {
	let node = fiber
	let parent = node.return
	while (parent !== null) {
		node = parent
		parent = node.return
	}
	if (node.tag === HostRoot) {
		return node.stateNode
	}
	return null
}
function renderRoot(root: FiberRootNode) {
	// 初始化
	prepareFreshStack(root)
	do {
		try {
			workLoop()
			break
		} catch (e) {
			if (__DEV__) {
				console.log('workLoop发生错误', e)
			}
			workInProgress = null
		}
	} while (true)
	const finishedWork = root.current.alternate
	root.finishedWork = finishedWork
	// 根据wip树以及树中的flags执行具体的dom操作
	commitRoot(root)
}

function commitRoot(root: FiberRootNode) {
	const finishedWork = root.finishedWork
	if (finishedWork === null) {
		return
	}
	if (__DEV__) {
		console.warn('commit阶段开始', finishedWork)
	}
	// 重置finishedWork
	root.finishedWork = null
	// 判断是否存在三个子阶段存在的操作
	const subtreeHasEffect = (finishedWork.subtreeFlags & MutationMask) !== NoFlags
	const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags
	if (subtreeHasEffect || rootHasEffect) {
		// beforeMutation
		// mutation
		commitMutationEffect(finishedWork)
		root.current = finishedWork
		// layout
	} else {
		root.current = finishedWork
	}

}

function workLoop() {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress)
	}
}

function performUnitOfWork(fiber: FiberNode) {
	const next = beginWork(fiber)
	fiber.memoizedProps = fiber.pendingProps
	// 已经递归到最深层
	if (next === null) {
		completeUnitOfWork(fiber)
	} else {
		workInProgress = next
	}
}

function completeUnitOfWork(fiber: FiberNode) {
	let node: FiberNode | null = fiber
	do {
		completeWork(node)
		let sibling = node.sibling
		if (sibling !== null) {
			workInProgress = sibling
			return
		}
		node = node.return
		workInProgress = node
	} while (node !== null)
}
