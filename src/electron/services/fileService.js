import { app } from 'electron'
import path from 'path'
import { promises as fs } from 'fs'

class fileService {

    get dataPath() {

        const isInDev = process.env.NODE_ENV === 'development'

        if (isInDev) {
            return path.join(process.cwd(), 'dummy')
        }

        return app.getPath('userData')
    }

    /**
     * Garantiza que los archivos por defecto existan.
     * Si no existen, los crea con un contenido inicial adecuado.
     */
    async ensureDefaultFiles() {
        // Diccionario de archivos y su contenido por defecto
        const defaultFiles = {
            'traces.json': [],
            'products.json': [],
            'providers.json': [],
            'staff.json': [],
            'tags.json': [],
            'roles.json': [],
            'tickets.json': [],
            'licenses.json': []
        };

        for (const [fileName, defaultContent] of Object.entries(defaultFiles)) {
            const filePath = path.join(this.dataPath, fileName);
            try {
                await fs.access(filePath); // comprueba si existe
            } catch {
                // No existe → crearlo
                try {
                    await fs.writeFile(
                        filePath,
                        JSON.stringify(defaultContent, null, 4),
                        'utf-8'
                    );
                } catch (writeErr) {
                    console.error(`Error al crear ${fileName}:`, writeErr);
                }
            }
        }
    }

    /**
     * 
     * @param {String} filePath 
     * @returns {Object}
     */
    async readJsonData(filePath) {
        if (!filePath) return {}
        const filepath = path.join(this.dataPath, filePath)

        try {
            const data = await fs.readFile(filepath, 'utf-8')
            return JSON.parse(data)

        } catch (err) {
            console.error(err)
            return { success: false }
        }
    }

    /**
     * 
     * @param {String} filePath 
     * @param {Object} jsonData 
     * @returns {Object}
     */
    async writeJsonData(filePath, jsonData) {
        if (!filePath || !jsonData) return {}
        const filepath = path.join(this.dataPath, filePath)
        const dataToWrite = JSON.stringify(jsonData, null, 4)

        try {
            await fs.writeFile(filepath, dataToWrite, 'utf-8')
            return { succes: true }

        } catch (err) {
            console.error(err)
            return { success: false }
        }
    }

    /**
     * 
     * @param {String} filePath 
     * @param {Object} jsonData 
     * @returns {Object}
     */
    async modifyJsonData(filePath, jsonData) {
        if (!filePath || !jsonData) return {}
        const filepath = path.join(this.dataPath, filePath)

        const dataToWrite = await this.readJsonData(filePath)
        dataToWrite.push(jsonData)

        try {
            await fs.writeFile(filepath, JSON.stringify(dataToWrite, null, 4), 'utf-8')
            return { succes: true }

        } catch (err) {
            console.error(err)
            return { success: false }
        }
    }
}

export default fileService