// eslint-disable-next-line import/no-extraneous-dependencies
import mustache from 'mustache';
import path from 'node:path';
import { loadTemplate, saveFile } from './utils.mjs';
import ClientErrorSettings from './client.json' with { type: 'json' };
import ServerErrorSettings from './server.json' with { type: 'json' };
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
    const clientExports = [];
    const serverExports = [];

    for(let i=0; i<items.length; i++) {
        const parts = items[i].fileName.split('.');
        parts.pop();

        if(items[i].isServerError) {
            serverExports.push(`export * from './${parts.join('.')}';`);
        } else {
            clientExports.push(`export * from './${parts.join('.')}';`);
        }
    }

    // eof ;)
    clientExports.push('');
    serverExports.push('');

    const clientContent = clientExports.join('\n');
    const clientPath = path.join(`${destDirPath}/client/index.ts`);
    await saveFile(clientContent, clientPath);

    const serverContent = serverExports.join('\n');
    const serverPath = path.join(`${destDirPath}/server/index.ts`);
    await saveFile(serverContent, serverPath);
})();
