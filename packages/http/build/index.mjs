// eslint-disable-next-line import/no-extraneous-dependencies
import mustache from 'mustache';
import path from 'node:path';
import { loadTemplate, saveFile } from './utils.mjs';
import ClientErrorSettings from './client.json' assert { type: 'json' };
import ServerErrorSettings from './server.json' assert { type: 'json' };
import url from "node:url";


/**
 * Generate client and server errors.
 */
(async () => {
    const settings = {
        ...ClientErrorSettings,
        ...ServerErrorSettings,
    };

    const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
    const destDirPath = path.join(__dirname, '..', 'src', 'errors');
    const items = [];

    const tpl = await loadTemplate(path.join(__dirname, '..', 'template', 'error.tpl'));

    const keys = Object.keys(settings);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const isServerError = Object.prototype.hasOwnProperty.call(ServerErrorSettings, key);

        const pathSuffix = isServerError ? 'server' : 'client';

        const fileName = `${settings[key].statusCode}-${(settings[key].code).toLowerCase().replace(/_/g, '-')}.ts`;
        const destFilePath = path.join(destDirPath, pathSuffix, fileName);

        let className = key;

        const classErrorSuffix = key.toLocaleLowerCase().endsWith('error');
        if (!classErrorSuffix) {
            className += 'Error';
        }

        const baseClassName = isServerError ? 'ServerError' : 'ClientError';

        const content = mustache.render(tpl, {
            namespaceFile: 'index.ts',
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
    const lines = [
        'export * from \'./base\';',
    ];

    items.map((item) => {
        const parts = item.fileName.split('.');
        parts.pop();

        const relativeDirectory = item.isServerError ? 'server' : 'client';
        lines.push(`export * from './${relativeDirectory}/${parts.join('.')}';`);

        return item;
    });

    // eof ;)
    lines.push('');

    const content = lines.join('\n');

    const destFilePath = path.join(`${destDirPath}/index.ts`);
    await saveFile(content, destFilePath);
})();
