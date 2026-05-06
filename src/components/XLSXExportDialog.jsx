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
        console.log(result)
        return result
    }, [data, model])

    const transformedData = useMemo(() => {
        return data.map(item => {
            const newItem = {};
            Object.keys(model).forEach(key => {
                newItem[model[key]] = item[key];
            });
            return newItem;
        });
    }, [data, model]);

    return (
        <div className="
        flex flex-col
        border border-(--border)
        min-w-[60dvw] max-w-[90dvw]
        min-h-[60dvh] max-h-[90dvh]
        
        bg-(--bg)
        overflow-hidden
        rounded-md
        ">
            <DialogTopBar label="Exportar" />
            <div>

            </div>

            <div className="
            flex-1
            flex flex-col
            p-4! gap-3
            ">

                <table className="
                table-auto
                border-collapse
                w-full
                ">
                    <thead>
                        <tr>
                            {previewData[0].map((data, index) =>
                                <th
                                    key={index}
                                    className="border border-(--border)"
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
                                        className="border border-(--border)"
                                        scope="col">
                                        {x}
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