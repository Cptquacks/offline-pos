import { useEffect, useMemo, useState } from "react"
import DialogTopBar from "./DialogTopBar"
import { importFile } from "../utils/xlsx-util"
import useAlertStore from "../stores/alertStore"
import ErrorToast from "./ErrorToast"
import ColumnSelector from "./ColumnSelector"
import ProductItem from "./ProductItem"
import { normalizeExcelDate } from "../utils/date-util"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFileImport } from "@fortawesome/free-solid-svg-icons"
import useDialogStore from "../stores/dialogStore"

function XLSXImportDialog({ title, model, optionalFields, onImport, previewComponent: Preview }) {

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
            const newObj = { ...model } // copia del modelo base
            programFields.forEach(({ key, value }) => {
                if (dateKeys.includes(key) && value && row.hasOwnProperty(value)) {
                    newObj[key] = normalizeExcelDate(row[value]);
                    return
                }

                if (value && row.hasOwnProperty(value)) {
                    newObj[key] = row[value]
                }
            })
            return newObj;
        })
    }, [fileData.data, programFields, model])


    const readyToImport = useMemo(() => {
        const requiredFields = programFields.filter(f => !optionalFields.includes(f.key));
        return requiredFields.every(f => f.value);
    }, [programFields, optionalFields]);

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
            <DialogTopBar label={title} />

            <div className="
            flex flex-col
            p-4! gap-3
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
                                            border border-(--border)
                                            "
                                            key={index}
                                            scope="col">{entry}</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {fileData.data.slice(0, 3).map((row, towIndex) =>
                                    <tr key={towIndex}>
                                        {fileData.columns.map((col, colIndex) =>
                                            <td
                                                className="
                                                border border-(--border)
                                                "
                                                key={colIndex}>
                                                {row[col]}
                                            </td>
                                        )}
                                    </tr>
                                )}
                                <tr className="
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
                        Haga coincidir los campos
                    </strong>
                    <div className="
                    grid grid-cols-4 gap-2
                    ">
                        {previewFields.map((field, index) =>
                            <ColumnSelector
                                key={index}
                                //label={`${field} K:${programFields[index]?.key ?? 'ERR'}  V:${programFields[index]?.value ?? 'ERR'}`}
                                label={field}
                                columns={fileData.columns}
                                optional={optionalFields.includes(programFields[index]?.key)}

                                onSelected={data => {
                                    const fieldsCopy = programFields.map((f, i) =>
                                        i === index ? { ...f, value: data } : f
                                    )
                                    setProgramFields(fieldsCopy)
                                }}
                            />
                        )}
                    </div>
                </div>

                <div className="text-lg w-fit">
                    <strong>
                        Previsualización
                    </strong>
                    {resultantData.length > 0 &&
                        <Preview
                            isOnPreview={true}
                            data={resultantData[0]} />
                    }
                </div>
            </div>

            <div className="
            flex flex-row
            p-4! gap-3
            items-center justify-end
            bg-(--bg-soft)
            ">
                <button className="
                transition cursor-pointer
                disabled:cursor-not-allowed
                flex flex-row
                items-center
                px-3! py-1! gap-1
                bg-(--accent-alt) text-white!
                hover:not-disabled:bg-white hover:not-disabled:text-(--bg-alt)!
                text-xl!
                rounded-xs
                disabled:opacity-50
                "
                    disabled={!readyToImport}
                    onClick={() => {
                        let result = resultantData
                        result.forEach(item => {
                            Object.keys(model).forEach(entry => {
                                if (previewFields.some(field => field === item[entry]))
                                    item[entry] = null
                            })
                        })

                        onImport(result)
                        closeDialog()
                    }}>
                    <FontAwesomeIcon icon={faFileImport} />
                    <strong>
                        Importar
                    </strong>
                </button>
            </div>
        </div>
    )
}
export default XLSXImportDialog