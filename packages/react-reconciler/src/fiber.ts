import { Props, Key, Ref } from 'shared/ReactTypes'
import { WorkTag } from './worTags'
import { Flags, NoFlags } from './fiberFlags'
import { Container } from 'hostConfig'

export class FiberNode {
	tag: WorkTag
	pendingProps: Props
	key: Key
	type: any
	stateNode: any
	ref: Ref
	return: FiberNode | null
	sibling: FiberNode | null
	child: FiberNode | null
	index: number

	memoizedProps: Props | null
	memoizedState: any
	alternate: FiberNode | null
	flags: Flags
	// 子树中的flags，用于“归”阶段收集flags优化
	subtreeFlags: Flags
	updateQueue: unknown

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		this.tag = tag
		this.key = key
		//  如果是一个div，stateNode就保存div这个dom
		this.stateNode = null
		// fiberNode对应的类型
		this.type = null
		// 父
		this.return = null
		this.child = null
		this.sibling = null
		this.index = 0
		this.ref = null
		//  作为工作单元
		this.pendingProps = pendingProps
		this.memoizedProps = null
		this.memoizedState = null
		this.alternate = null
		this.updateQueue = null
		// 副作用
		this.flags = NoFlags
		this.subtreeFlags = NoFlags
	}
}
export class FiberRootNode {
	container: Container
	current: FiberNode
	finishedWork: FiberNode | null
	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container
		this.current = hostRootFiber
		hostRootFiber.stateNode = this
		this.finishedWork = null
	}
}
export const createWorkInProgress = (
	current: FiberNode,
	pendingProps: Props
): FiberNode => {
	let wip = current.alternate
	if (wip === null) {
		//  mount
		wip = new FiberNode(current.tag, pendingProps, current.key)
		wip.stateNode = current.stateNode

		wip.alternate = current
		current.alternate = wip
	} else {
		// update
		wip.pendingProps = pendingProps
		wip.flags = NoFlags
		wip.subtreeFlags = NoFlags
	}
	wip.type = current.type
	wip.updateQueue = current.updateQueue
	wip.child = current.child
	wip.memoizedProps = current.memoizedProps
	wip.memoizedState = current.memoizedState
	return wip
}
