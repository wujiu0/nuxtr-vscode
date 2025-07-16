import { existsSync, mkdirSync } from 'node:fs'
import { window } from 'vscode'
import { appConfigContent } from '../templates'
import { createFile, generateVueFileTemplate, isNuxt4, isNuxtTwo, projectRootDirectory, projectSrcDirectory } from '../utils'

function promptDirectorySelection () {
    let directories = ['components', 'pages', 'assets', 'plugins', 'layouts', 'middleware', 'modules',]

    const nuxtTwoDirectories = ['static', 'store',]

    const nuxtThreeDirectories = ['public', 'composables', 'server', 'utils', 'stores']

    // Nuxt4 特有的目录（在 app/ 下的新目录结构）
    const nuxt4Directories = ['public', 'composables', 'server', 'utils', 'stores', 'shared']

    if (isNuxtTwo()) {
        directories = [...directories, ...nuxtTwoDirectories]
    } else if (isNuxt4()) {
        // 对于 Nuxt4，大部分目录会在 app/ 下创建
        directories = [...directories, ...nuxt4Directories]
    } else {
        // Nuxt3 默认行为
        directories = [...directories, ...nuxtThreeDirectories]
    }

    directories.sort()

    window
        .showQuickPick(directories, {
            canPickMany: true,
            placeHolder: 'Select directories to create',
        })
        .then((selectedDirs) => {
            if (selectedDirs !== undefined && selectedDirs.length > 0) {
                selectedDirs.forEach(async (dir) => {
                    const dirPath = `${await projectSrcDirectory()}/${dir}`
                    if (!existsSync(dirPath)) {
                        mkdirSync(dirPath)
                    }

                    if (dir === 'pages') {
                        await createFile({
                            fileName: 'index.vue',
                            content: generateVueFileTemplate('page'),
                            fullPath: `${dirPath}/index.vue`,
                        })
                    }

                    if (dir === 'layouts') {
                        await createFile({
                            fileName: 'default.vue',
                            content: generateVueFileTemplate('layout'),
                            fullPath: `${dirPath}/default.vue`,
                        })
                    }
                })
            }
        })
}

const projectStructure = () => {
    promptDirectorySelection()
}

const appConfig = async () => {
    // 对于 Nuxt4，app.config.ts 应该放在 app/ 目录下
    // 对于其他版本，放在项目根目录
    const isNuxt4Project = isNuxt4()
    const filePath =
        isNuxt4Project && (await projectSrcDirectory()).endsWith('/app')
            ? `${await projectSrcDirectory()}/app.config.ts`
            : `${projectRootDirectory()}/app.config.ts`

    createFile({
        fileName: 'app.config.ts',
        content: appConfigContent,
        fullPath: filePath,
    })
}

const nuxtIgnore = () => {
    createFile({
        fileName: '.nuxtignore',
        content: '',
        fullPath: `${projectRootDirectory()}/.nuxtignore`,
    })
}

const nuxtRC = () => {
    createFile({
        fileName: '.nuxtrc',
        content: '',
        fullPath: `${projectRootDirectory()}/.nuxtrc`,
    })
}

const errorLayout = async () => {
    const filePath = `${await projectSrcDirectory()}/error.vue`

    await createFile({
        fileName: 'error.vue',
        content: generateVueFileTemplate('page'),
        fullPath: filePath,
    })
}

export { appConfig, errorLayout, nuxtIgnore, nuxtRC, projectStructure }
