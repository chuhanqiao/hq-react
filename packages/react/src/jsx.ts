/**
 * 运行时的工作包括：1.实现jsx方法 2.实现打包流程 3.实现调试打包结果的环境
 * 1.1 jsxDev方法（dev环境）1.2 jsx方法（prod环境）1.3 React.createElement方法
 */
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols'
import {
	Type,
	Key,
	Ref,
	Props,
	ReactElementType,
	ElementType
} from 'shared/ReactTypes'
// jsx方法执行的返回结果是ReactElement的数据结构
const ReactElement = function (
	type: Type,
	key: Key,
	ref: Ref,
	props: Props
): ReactElementType {
	const element = {
		$$typeof: REACT_ELEMENT_TYPE,
		type,
		key,
		ref,
		props,
		__mark: 'hq'
	}
	return element
}
export function isValidElement(object: any) {
	return (
		typeof object === 'object' &&
		object !== null &&
		object.$$typeof === REACT_ELEMENT_TYPE
	)
}
export const jsx = (type: ElementType, config: any, ...maybeChildren: any) => {
	let key: Key = null
	const props: Props = {}
	let ref: Ref = null
	for (const prop in config) {
		const val = config[prop]
		if (prop === 'key') {
			if (val !== undefined) {
				key = '' + val
			}
			continue
		}
		if (prop === 'ref') {
			if (val !== undefined) {
				ref = val
			}
			continue
		}
		// 是否是自己的property
		if ({}.hasOwnProperty.call(config, prop)) {
			props[prop] = val
		}
	}
	// 处理maybeChildren
	const maybeChildrenLength = maybeChildren.length
	if (maybeChildrenLength) {
		if (maybeChildrenLength === 1) {
			props.children = maybeChildren[0]
		} else {
			props.children = maybeChildren
		}
	}
	return ReactElement(type, key, ref, props)
}
export const jsxDEV = (type: ElementType, config: any) => {
	let key: Key = null
	const props: Props = {}
	let ref: Ref = null
	for (const prop in config) {
		const val = config[prop]
		if (prop === 'key') {
			if (val !== undefined) {
				key = '' + val
			}
			continue
		}
		if (prop === 'ref') {
			if (val !== undefined) {
				ref = val
			}
			continue
		}
		// 是否是自己的property
		if ({}.hasOwnProperty.call(config, prop)) {
			props[prop] = val
		}
	}
	return ReactElement(type, key, ref, props)
}
