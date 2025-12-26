import { getPackageJson, resolvePkgPath, getBaseRollupPlugins } from './utils'
import generatePackageJson from 'rollup-plugin-generate-package-json'
import alias from '@rollup/plugin-alias'

const { name, module, peerDependencies } = getPackageJson('react-dom')
//  react包路径
const pkgPath = resolvePkgPath(name)
//  react产物路径
const pkgDistPath = resolvePkgPath(name, true)
export default [
	// react-dom
	{
		input: `${pkgPath}/${module}`,
		output: [
			{
				file: `${pkgDistPath}/index.js`,
				name: 'ReactDom',
				format: 'umd'
			},
			{
				file: `${pkgDistPath}/client.js`,
				name: 'client',
				format: 'umd'
			}
		],
		// 外部包，不打包进react-dom的依赖
		external: [...Object.keys(peerDependencies)],
		plugins: [
			...getBaseRollupPlugins(),
			// 解决打包时的hostConfig指向
			alias({
				entries: {
					hostConfig: `${pkgPath}/src/hostConfig.ts`
				}
			}),
			generatePackageJson({
				inputFolder: pkgPath,
				outputFolder: pkgDistPath,
				baseContents: ({ name, description, version }) => ({
					name,
					description,
					version,
					peerDependencies: {
						react: version
					},
					main: 'index.js'
				})
			})
		]
	},
	// test-utils
	{
		input: `${pkgPath}/test-utils.ts`,
		output: [
			{
				file: `${pkgDistPath}/test-utils.ts`,
				name: 'testUtils',
				format: 'umd'
			}
		],
		external: ['react-dom', 'react'],
		plugins: getBaseRollupPlugins()
	}
]
