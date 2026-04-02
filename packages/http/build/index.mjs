import mustache from 'mustache';
import path from 'node:path';
import { loadTemplate, saveFile } from './utils.mjs';
import ClientErrorSettings from './client.json' with { type: 'json' };
import ServerErrorSettings from './server.json' with { type: 'json' };
import url from 'node:url';

/**
 * Derive a human-readable status message from a PascalCase key.
 * e.g. "BadRequest" -> "Bad Request", "HTTPVersionNotSupported" -> "HTTP Version Not Supported"
 */
function deriveStatusMessage(key) {
    return key
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
}

/**
 * Derive a CONSTANT_CASE code from a PascalCase key.
 * e.g. "BadRequest" -> "BAD_REQUEST"
 */
function deriveCode(key) {
    return key
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
        .toUpperCase();
}

/**
 * Normalize a config entry. Accepts either a number (statusCode)
 * or an object with optional overrides.
 */
function normalizeEntry(key, value) {
    const entry = typeof value === 'number' ? { statusCode: value } : value;
    const statusMessage = entry.statusMessage || deriveStatusMessage(key);
    return {
        statusCode: entry.statusCode,
        statusMessage: statusMessage.replace(/'/g, "\\'"),
        code: entry.code || deriveCode(key),
    };
}

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

    for (const key of keys) {
        const isServerError = Object.prototype.hasOwnProperty.call(ServerErrorSettings, key);
        const pathSuffix = isServerError ? 'server' : 'client';

        const entry = normalizeEntry(key, settings[key]);

        const fileName = `${entry.statusCode}-${entry.code.toLowerCase().replace(/_/g, '-')}.ts`;
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
            ...entry,
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

    for (const item of items) {
        const parts = item.fileName.split('.');
        parts.pop();

        if (item.isServerError) {
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
