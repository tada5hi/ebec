// eslint-disable-next-line import/no-extraneous-dependencies
import { hasOwnProperty } from 'ebec';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from 'mustache';
import path from 'path';
import { loadTemplate, saveFile } from './utils';
import ClientErrorSettings from './client.json';
import ServerErrorSettings from './server.json';

type ErrorSetting = {
    code: string,
    statusCode: number,
    message: string
};
/**
 * Generate client and server errors.
 */
(async () => {
    const settings : Record<string, ErrorSetting> = {
        ...ClientErrorSettings,
        ...ServerErrorSettings,
    };

    const destDirPath = path.join(__dirname, '..', 'src', 'errors');
    const items : { fileName: string, isServerError: boolean }[] = [];

    const tpl = await loadTemplate('error.tpl');

    const keys = Object.keys(settings);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const isServerError : boolean = hasOwnProperty(ServerErrorSettings, key);

        const pathSuffix : string = isServerError ? 'server' : 'client';

        const fileName = `${settings[key].statusCode}-${(settings[key].code).toLowerCase().replace(/_/g, '-')}.ts`;
        const destFilePath : string = path.join(destDirPath, pathSuffix, fileName);

        let className : string = key;

        const classErrorSuffix : boolean = key.toLocaleLowerCase().endsWith('error');
        if (!classErrorSuffix) {
            className += 'Error';
        }

        const baseClassName : string = isServerError ? 'ServerError' : 'ClientError';

        const content = render(tpl, {
            namespaceFile: 'index.ts',
            decorateMessage: isServerError,
            logMessage: isServerError,
            class: className,
            baseClass: baseClassName,
            ...settings[key],
        });

        await saveFile(content, destFilePath);

        items.push({
            fileName,
            isServerError,
        });
    }

    // default
    const lines : string[] = [
        'export * from \'./base\';',
    ];

    items.map((item) => {
        const parts = item.fileName.split('.');
        parts.pop();

        const relativeDirectory : string = item.isServerError ? 'server' : 'client';
        lines.push(`export * from './${relativeDirectory}/${parts.join('.')}';`);

        return item;
    });

    // eof ;)
    lines.push('');

    const content : string = lines.join('\n');

    const destFilePath : string = path.join(`${destDirPath}/index.ts`);
    await saveFile(content, destFilePath);
})();
