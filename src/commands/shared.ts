import { window } from 'vscode';
import { createDir, createFile, createSubFolders, normalizeFileExtension, projectSrcDirectory, showSubFolderQuickPick } from '../utils';

// Nuxt4 shared utility template
const sharedUtilTemplate = (name: string) => `/**
 * ${name} utility function
 * This utility is auto-imported and available in both client and server contexts.
 */
export const ${name} = () => {
  // Your implementation here
}
`;

// Nuxt4 shared type template
const sharedTypeTemplate = (name: string) => `/**
 * ${name} type definition
 * This type is auto-imported and available in both client and server contexts.
 */
export interface ${name} {
  // Your type definition here
}
`;

const createSharedUtil = () => {
    window
        .showInputBox({
            prompt: 'What is your shared utility name?',
            placeHolder: 'shared utility name',
        })
        .then(async (name) => {
            if (!name) { return; }

            const sharedDir = `${await projectSrcDirectory()}/shared`;
            const sharedUtilsDir = `${sharedDir}/utils`;

            await createDir('shared');
            await createDir('shared/utils');

            const subFolders = await createSubFolders(sharedUtilsDir, 'sharedUtils');

            showSubFolderQuickPick({
                name,
                subFolders,
                commandType: 'sharedUtils',
                content: sharedUtilTemplate(name),
            });
        });
};

const createSharedType = () => {
    window
        .showInputBox({
            prompt: 'What is your shared type name?',
            placeHolder: 'shared type name',
        })
        .then(async (name) => {
            if (!name) { return; }

            const sharedDir = `${await projectSrcDirectory()}/shared`;
            const sharedTypesDir = `${sharedDir}/types`;

            await createDir('shared');
            await createDir('shared/types');

            const subFolders = await createSubFolders(sharedTypesDir, 'sharedTypes');

            showSubFolderQuickPick({
                name,
                subFolders,
                commandType: 'sharedTypes',
                content: sharedTypeTemplate(name),
            });
        });
};

const directCreateSharedUtil = (path: string) => {
    window
        .showInputBox({
            prompt: 'What is your shared utility name?',
            placeHolder: 'shared utility name',
        })
        .then((name) => {
            if (!name) { return; }

            const filePath = `${path}/${normalizeFileExtension(name, '.ts')}.ts`;

            createFile({
                fileName: `${name}.ts`,
                content: sharedUtilTemplate(name),
                fullPath: filePath,
            });
        });
};

const directCreateSharedType = (path: string) => {
    window
        .showInputBox({
            prompt: 'What is your shared type name?',
            placeHolder: 'shared type name',
        })
        .then((name) => {
            if (!name) { return; }

            const filePath = `${path}/${normalizeFileExtension(name, '.d.ts')}.d.ts`;

            createFile({
                fileName: `${name}.d.ts`,
                content: sharedTypeTemplate(name),
                fullPath: filePath,
            });
        });
};

export { createSharedType, createSharedUtil, directCreateSharedType, directCreateSharedUtil };

