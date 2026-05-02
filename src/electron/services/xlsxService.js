import { dialog } from 'electron';
import XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

class xlsxService {

    async importFile() {
        const { canceled, filePaths } = await dialog.showOpenDialog({
            title: "Seleccionar archivo de datos",
            filters: [
                { name: 'Hojas de calculo (Excel) ', extensions: ['xlsx', 'xls', 'csv', 'ods'] }
            ],
            properties: ['openFile']
        })

        if (canceled || filePaths.length === 0) {
            return { canceled: true, data: null }
        }

        try {
            const filePath = filePaths[0];
            const fileExtension = path.extname(filePath).toLowerCase();

            let workBook;

            if (fileExtension === '.csv') {
                // Leer el archivo manualmente con codificación UTF-8
                const csvContent = fs.readFileSync(filePath, 'utf-8');
                workBook = XLSX.read(csvContent, { type: 'string' });
            } else {
                // Para Excel y otros formatos, readFile funciona bien
                workBook = XLSX.readFile(filePath);
            }


            const sheetName = workBook.SheetNames[0]
            const workSheet = workBook.Sheets[sheetName]

            const rawData = XLSX.utils.sheet_to_json(workSheet, { defval: '', raw: false })
            const columns = rawData.length > 0 ? Object.keys(rawData[0]) : []

            return {
                canceled: false,
                fileName: path.basename(filePath),

                columns: columns,
                data: rawData
            };

        } catch (err) {
            console.error(`Error at importFile(): ${err}`)
            return { canceled: true, error: err }
        }
    }
}

export default xlsxService