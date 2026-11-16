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

    async exportFile(data, defaultFileName = 'Exported') {
        const { canceled, filePath } = await dialog.showSaveDialog({
            title: "Guardar archivo de datos",
            defaultPath: `${defaultFileName}.xlsx`,
            filters: [
                { name: 'Excel Workbook', extensions: ['xlsx'] },
                { name: 'CSV', extensions: ['csv'] }
            ],
            properties: ['openFile']
        })

        if (canceled || !filePath) {
            return { canceled: true };
        }

        try {
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');

            const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
            await fs.promises.writeFile(filePath, buffer);

            return { success: true, filePath };
        } catch (err) {
            console.error('Error al exportar:', err);
            return { success: false, error: err.message };
        }
    }
}

export default xlsxService