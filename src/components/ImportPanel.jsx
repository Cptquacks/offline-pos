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
            <p>
                Importar datos
            </p>

            <div className="
            flex flex-row
            gap-2
            ">
                <DefaultButton
                    label="Importar desde Excel"
                    icon="file-excel"
                    onClick={handleImport}
                    iconSize="lg"
                />


                <DefaultButton
                    label="Exportar a Excel"
                    icon="file-excel"
                    onClick={handleExport}
                    iconSize="lg"
                />
            </div>
        </div>
    )
}
export default ImportPanel