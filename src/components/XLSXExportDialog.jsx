import { useMemo } from "react"
import useDialogStore from "../stores/dialogStore"
import DialogTopBar from "./DialogTopBar"
import DefaultButton from "./DefaultButton"
import { exportFile } from "../utils/xlsx-util"

function XLSXExportDialog({ model, data }) {
    const { closeDialog } = useDialogStore()

    const previewData = useMemo(() => {
        let rawData = data
        let result = []

        result.push(Object.values(model))

        rawData.forEach(entry => result.push(Object.values(entry)))
        return result
    }, [data, model])

    const transformedData = useMemo(() => {
        return data.map(item => {
            const newItem = {};
            Object.keys(model).forEach(key => {

                if (typeof item[key] === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item[key])) {
                    const [year, month, day] = item[key].split('-').map(Number)
                    newItem[model[key]] = new Date(year, month, day)
                    return
                }

                newItem[model[key]] = item[key];
            });
            return newItem;
        });
    }, [data, model]);

    return (
        <div className="
        flex flex-col
        border border-white/15
        min-w-[60dvw] max-w-[90dvw]
        min-h-[60dvh] max-h-[90dvh]
        
        bg-(--bg)
        overflow-hidden
        rounded-md
        ">
            <DialogTopBar label="Exportar" />

            <div className="
            flex-1
            flex flex-col
            p-4! gap-3
            overflow-y-auto
            ">

                <table className="
                table-auto
                border-collapse
                w-full
                ">
                    <thead >
                        <tr>
                            {previewData[0].map((data, index) =>
                                <th
                                    key={index}
                                    className="bg-white/5 border border-white/15 px-1! py-0.5! "
                                    scope="col">
                                    {data}
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {previewData.slice(1).map((y, yIndex) =>
                            <tr key={yIndex}>
                                {y.map((x, xIndex) =>
                                    <td
                                        key={xIndex}
                                        className="border border-white/15 px-1! py-0.5!"
                                        scope="col"
                                    >
                                        {x ||
                                            <cite className="opacity-50">
                                                Vacío
                                            </cite>
                                        }
                                    </td>
                                )}
                            </tr>
                        )}
                    </tbody>
                </table>

            </div>

            <div className="
            flex flex-row 
            items-center justify-end
            p-2!
            bg-(--bg-soft)
            ">
                <DefaultButton
                    label="Exportar"
                    icon={"file-export"}
                    onClick={() => {
                        closeDialog()
                        exportFile(transformedData, 'exported')
                    }} />
            </div>
        </div>
    )
}

export default XLSXExportDialog