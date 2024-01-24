import { createInstance, appendInitialChild, createTextInstance, Container } from 'hostConfig'
import { FiberNode } from './fiber'
import { HostComponent, HostRoot, HostText } from './worTags'
import { NoFlags } from './fiberFlags'

export const completeWork = (wip: FiberNode) => {
	const newProps = wip.pendingProps
	const current = wip.alternate
	switch (wip.tag) {
		case HostComponent:
			// 判断是否首屏渲染
			if (current !== null && wip.stateNode) {
				// update
			} else {
				// 1 创建dom节点
				const instance = createInstance(wip.type, newProps)
				// 2 将dom节点插入到dom树中
        appendAllChildren(instance,wip)
        wip.stateNode = instance
			}
      bubbleProperties(wip)
			return null
		case HostText:
      // 判断是否首屏渲染
			if (current !== null && wip.stateNode) {
				// update
			} else {
				// 1 创建dom节点
				const instance = createTextInstance(newProps.content)
        wip.stateNode = instance
			}
      bubbleProperties(wip)
			return null
		case HostRoot:
      bubbleProperties(wip)
			return null
		default:
			if (__DEV__) {
				console.warn('未处理的completeWork情况', wip)
			}
			break
	}
}
// 在parent节点下插入wip节点
function appendAllChildren(parent: Container, wip: FiberNode) {
	let node = wip.child
	while (node !== null) {
		if (node.tag === HostComponent || node?.tag === HostText) {
			appendInitialChild(parent, node?.stateNode)
		} else if (node.child !== null) {
			node.child.return = node
			node = node.child
      continue
		}
    if(node === wip){
      return
    }
    while(node.sibling === null){
      if(node.return === null || node.return === wip){
        return
      }
      node = node?.return
    }
    node.sibling.return = node.return
    node = node.sibling
	}
}
// 当前节点的子节点以及子节点的兄弟节点中的flags冒泡到当前节点的subtreeFlags上
function bubbleProperties(wip:FiberNode){
  let subtreeFlags = NoFlags
  let child = wip.child
  while(child !== null){
    subtreeFlags |= child.subtreeFlags
    subtreeFlags |= child.flags

    child.return = wip
    child = child.sibling
  }
  wip.subtreeFlags |= subtreeFlags
}
