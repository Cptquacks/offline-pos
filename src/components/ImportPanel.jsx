import { faFileExcel } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import useDialogStore from "../stores/dialogStore"
import XLSXImportDialog from "./XLSXImportDialog"

function ImportPanel({ title, model, optionalFields, onImport }) {
    const { openDialog } = useDialogStore()

    const handleImport = () => {
        openDialog(
            <XLSXImportDialog
                model={model}
                optionalFields={optionalFields}
                onImport={onImport}
                title={title}
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
                <button className="
                transition-normal cursor-pointer
                flex flex-row
                items-center
                pl-0.5! px-2! py-1! gap-px
                bg-(--accent-alt) hover:bg-white
                text-white hover:text-(--bg)
                text-sm font-bold
                rounded-xs
                " onClick={handleImport}>
                    <FontAwesomeIcon icon={faFileExcel} size="lg" />
                    Importar desde Excel
                </button>

                <button className="
                transition-normal cursor-pointer
                flex flex-row
                items-center
                pl-0.5! px-2! py-1! gap-px
                bg-(--accent-alt) hover:bg-white
                text-white hover:text-(--bg)
                text-sm font-bold
                rounded-xs
                ">
                    <FontAwesomeIcon icon={faFileExcel} size="lg" />
                    Exportar a Excel
                </button>
            </div>
        </div>
    )
}
export default ImportPanel