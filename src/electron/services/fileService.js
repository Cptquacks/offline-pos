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