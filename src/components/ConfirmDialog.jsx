import useDialogStore from "../stores/dialogStore"
import DefaultButton from "./DefaultButton"
import DialogTopBar from "./DialogTopBar"

function ConfirmDialog({ label = 'Seguro que desea continuar?', callback }) {
    const { closeDialog } = useDialogStore()

    const handleClick = () => {
        if (callback) callback()
        closeDialog()
    }

    return (
        <div className="
        min-w-[30dvw] max-w-[60dvw]
        min-h-[30dvh] max-h-[60dvh]

        flex flex-col
        gap-1

        bg-(--bg)

        border border-white/20
        rounded-md
        ">
            <DialogTopBar label={"Confirmar"} />

            <section
                className="
                flex-1
                flex flex-row
                w-full h-full
                p-4! text-lg
                "
            >
                <p>
                    {label}
                </p>
            </section>

            <section
                className="
                flex flex-row
                items-center justify-end
                gap-1 p-2!
                "
            >
                <DefaultButton
                    label={"Cancelar"}
                    icon={"times"}
                    customColor={"bg-red-600"}
                    iconLeft

                    onClick={closeDialog}
                />
                <DefaultButton
                    label={"Aceptar"}
                    icon={"check"}
                    customColor={"bg-green-600"}
                    iconLeft

                    onClick={handleClick}
                />
            </section>
        </div>
    )
}

export default ConfirmDialog