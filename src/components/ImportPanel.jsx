import useDialogStore from "../stores/dialogStore"
import XLSXImportDialog from "./XLSXImportDialog"
import XLSXExportDialog from "./XLSXExportDialog"
import DefaultButton from "./DefaultButton"

function ImportPanel({ title, model, optionalFields, onImport, previewComponent, exportData = [] }) {
    const { openDialog } = useDialogStore()

    const handleImport = () => {
        openDialog(
            <XLSXImportDialog
                model={model}
                optionalFields={optionalFields}
                onImport={onImport}
                title={title}
                previewComponent={previewComponent}
            />
        )
    }

    const handleExport = () => {
        openDialog(
            <XLSXExportDialog
                model={model}
                data={exportData}
            />
        )
    }

    return (
        <div className="
        flex flex-row
        w-fit overflow-hidden
        p-2! gap-3
        items-center
        bg-(--bg-alt)
        border border-(--border)
        rounded-md
        ">
            <div className="
            flex flex-row
            gap-2
            ">
                <DefaultButton
                    label="Importar datos desde Excel"
                    icon="file-excel"
                    onClick={handleImport}
                />


                <DefaultButton
                    label="Exportar datos a Excel"
                    icon="file-excel"
                    onClick={handleExport}
                />
            </div>
        </div>
    )
}
export default ImportPanel