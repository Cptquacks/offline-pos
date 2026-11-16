import { useEffect, useMemo, useState } from "react"
import DialogTopBar from "./DialogTopBar"
import { importFile } from "../utils/xlsx-util"
import useAlertStore from "../stores/alertStore"
import ErrorToast from "./ErrorToast"
import ColumnSelector from "./ColumnSelector"
import { normalizeExcelDate } from "../utils/date-util"
import { stringSimilarity } from "../utils/string-util"
import useDialogStore from "../stores/dialogStore"
import DefaultButton from "./DefaultButton"

function XLSXImportDialog({ model, optionalFields, onImport, previewComponent: Preview }) {

    const { closeDialog } = useDialogStore()
    const { addAlert } = useAlertStore()

    const [fileData, setFileData] = useState({
        fileName: null,
        columns: [],
        data: []
    })

    const [programFields, setProgramFields] = useState([])

    const previewFields = useMemo(() => {
        const result = Object.values(model)
        return result
    }, [model])

    const transformedFields = useMemo(() => {
        let entries = Object.keys(model)
        entries = entries.map(entry => ({ key: entry, value: null }))

        return entries
    }, [model])

    const resultantData = useMemo(() => {
        const dateKeys = ['date', 'expiresAt', 'startDate', 'endDate', 'startedAt']
        if (!fileData.data.length || !programFields.length) return [];

        return fileData.data.map(row => {
            const newObj = Object.fromEntries(Object.keys(model).map((key) => [key, null]))
            programFields.forEach(({ key, value }) => {
                if (dateKeys.includes(key) && value && Object.prototype.hasOwnProperty.call(row, value)) {
                    newObj[key] = normalizeExcelDate(row[value]);
                    return
                }

                if (value && Object.prototype.hasOwnProperty.call(row, value)) {
                    newObj[key] = row[value]
                }
            })
            return newObj;
        })
    }, [fileData.data, programFields, model])


    const readyToImport = useMemo(() => {
        const requiredFields = programFields.filter(f => !optionalFields.includes(f.key));
        return fileData.data.length > 0 &&
            requiredFields.every(f => f.value !== null && f.value !== undefined && f.value !== 'null');
    }, [fileData.data.length, programFields, optionalFields]);

    const handleImport = async () => {
        const result = await importFile()
        if (result.canceled) {
            addAlert(
                <ErrorToast
                    label="Ha ocurrido un error al importar el archivo" />
            )
            return
        }
        setFileData(result)
    }

    useEffect(() => {
        async function awaitInit() {
            handleImport()
        }
        awaitInit()
        setProgramFields(transformedFields)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (fileData.columns.length === 0) return
        setProgramFields((fields) => fields.map((field, index) => {
            const bestMatch = fileData.columns
                .map((column) => ({ column, similarity: stringSimilarity(column, previewFields[index]) }))
                .filter((entry) => entry.similarity >= 0.75)
                .sort((a, b) => b.similarity - a.similarity)[0]?.column ?? "null"
            return { ...field, value: bestMatch }
        }))
    }, [fileData.columns, previewFields])

    return (
        <div className="
        flex flex-col
        border border-(--border)
        min-w-[50dvw] max-w-[90dvw]
        min-h-[50dvh] max-h-[90dvh]
        
        bg-(--bg)
        overflow-hidden
        rounded-md
        ">
            <DialogTopBar label={'Importar'} />

            <div className="
            flex flex-col
            p-4! gap-6
            overflow-y-auto
            ">
                <div className="
                flex flex-col
                p-2! gap-1
                bg-(--bg-alt)
                border border-(--border)
                rounded-md
                ">
                    <div className="
                    flex flex-row
                    gap-1
                    text-xl
                    ">
                        <strong>
                            Archivo:
                        </strong>

                        {fileData.fileName &&
                            <q>
                                {fileData.fileName}
                            </q>
                        }
                        {!fileData.fileName &&
                            <cite>
                                No hay archivos importados
                            </cite>
                        }
                    </div>

                    {fileData.fileName &&
                        <table className="
                        table-auto
                        border-collapse
                        w-full
                        ">
                            <thead>
                                <tr>
                                    {fileData.columns.map((entry, index) =>
                                        <th
                                            className="
                                            px-2! py-0.5!
                                            border border-(--border)
                                            "
                                            key={index}
                                            scope="col">{entry}</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {fileData.data.slice(0, 5).map((row, rowIndex) =>
                                    <tr key={rowIndex}>
                                        {fileData.columns.map((col, colIndex) =>
                                            <td
                                                className="
                                                px-2! py-0.5!
                                                border border-(--border)
                                                "
                                                key={colIndex}>
                                                {row[col]}
                                            </td>
                                        )}
                                    </tr>
                                )}
                                <tr className="
                                px-4! py-1!
                                border border-(--border)
                                ">
                                    <td>
                                        <strong>...</strong>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th
                                        className="
                                        border border-(--border)
                                        "
                                        scope="row"
                                        colSpan={fileData.columns.length}>
                                        Previsualización
                                    </th>
                                </tr>
                            </tfoot>
                        </table>
                    }
                </div>

                <div className="
                flex flex-col 
                mt-6! gap-1
                ">
                    <strong className="text-lg">
                        Haga coincidir los campos.
                        <br />
                        Los campos requeridos se denotan con <span className="text-red-400">*</span>
                    </strong>

                    <div className="
                    grid grid-cols-4 gap-2
                    ">
                        {previewFields.map((field, index) =>
                            <ColumnSelector
                                key={index}
                                label={field}
                                columns={fileData.columns}
                                value={programFields[index]?.value}
                                optional={optionalFields.includes(programFields[index]?.key)}

                                onSelected={data => {
                                    setProgramFields(prev => prev.map((f, i) =>
                                        i === index ? { ...f, value: `${data}` } : f
                                    ))
                                }}
                            />
                        )}
                    </div>
                </div>

                {
                    Preview &&
                    <div
                        className="
                        flex flex-col
                        gap-3
                        w-full
                        text-lg
                        "
                    >
                        <strong>
                            Previsualización:
                        </strong>
                        {resultantData.length > 0 &&
                            <Preview
                                isOnPreview={true}
                                data={resultantData[0]} />
                        }
                    </div>
                }
            </div>

            <div className="
            flex flex-row
            p-4! gap-3
            items-center justify-end
            bg-(--bg-soft)
            ">
                <DefaultButton
                    label="Importar"
                    icon="file-import"
                    onClick={async () => {
                        try {
                            await onImport(resultantData)
                            closeDialog()
                        } catch (error) {
                            console.error("No se pudieron importar los datos XLSX:", error)
                            addAlert(
                                <ErrorToast label="No se pudieron importar los datos del archivo" />
                            )
                        }
                    }}
                    disabled={!readyToImport}
                />
            </div>
        </div>
    )
}
export default XLSXImportDialog