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
     * Methods
     */
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
            return { succes: false }
        }
    }

    /**
     * 
     * @param {String} filePath 
     * @param {Object} jsonData 
     * @returns {Object}
     */
    async writeJsonData(filePath, jsonData) {
        if (!filePath) return {}
        const filepath = path.join(this.dataPath, filePath)
        const dataToWrite = JSON.stringify(jsonData, null, 4)

        try {
            await fs.writeFile(filepath, dataToWrite, 'utf-8')
            return { succes: true }

        } catch (err) {
            console.error(err)
            return { succes: false }
        }
    }
}

export default fileService