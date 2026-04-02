import fs from 'node:fs';
import path from 'node:path';

/**
 * Save file with promise api.
 *
 * @param content
 * @param filePath
 */
export async function saveFile(content, filePath) {
    return new Promise(((resolve, reject) => {
        fs.writeFile(filePath, content, (err) => {
            if (err) reject(err);

            resolve();
        });
    }));
}

/**
 * Load template (.tpl) file from disk.
 * @param file
 * @return Promise<string>
 */
export async function loadTemplate(file) {
    const tplPath = path.isAbsolute(file) ?
        file :
        path.join(__dirname, '..', 'template', file);

    return new Promise((resolve, reject) => {
        fs.readFile(tplPath, ({ encoding: 'utf-8' }), (err, data) => {
            if (err) reject(err);

            resolve(data);
        });
    });
}
