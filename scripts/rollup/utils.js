import path from 'path'
import fs from 'fs'
import ts from 'rollup-plugin-typescript2'
import cjs from '@rollup/plugin-commonjs'

const pkgPath = path.resolve(__dirname, '../../packages')
//  指定打包产物的路径
const distPath = path.resolve(__dirname, '../../dist/node_modules')
export function resolvePkgPath(pkgName, isDist) {
	if (isDist) {
		return `${distPath}/${pkgName}`
	}
	return `${pkgPath}/${pkgName}`
}
export function getPackageJson(pkgName) {
	const path = `${resolvePkgPath(pkgName)}/package.json`
	const str = fs.readFileSync(path, { config: 'utf-8' })
	return JSON.parse(str)
}
//  获取公用的plugins
export function getBaseRollupPlugins({ typescript = {} } = {}) {
	return [cjs(), ts(typescript)]
}
