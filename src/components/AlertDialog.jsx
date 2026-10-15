import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import useDialogStore from "../stores/dialogStore"
import DefaultButton from "./DefaultButton"

function AlertDialog({ title, label, icon, color }) {
    const { closeDialog } = useDialogStore()
    return (
        <section
            className="
            flex flex-col
            gap-0.5
            items-start
            min-w-[30dvw] max-w-[90dvw]
            min-h-[30dvh] max-h-[90dvh]
            bg-(--bg)
            border border-white/20
            rounded-md
            "
        >
            <div
                className="
                flex flex-row 
                items-center 
                w-full
                p-2! gap-1.25
                bg-(--bg-soft)
                border-b border-b-white/20
                "
            >
                <FontAwesomeIcon
                    className={`${color}`}
                    icon={icon ?? 'exclamation-triangle'}
                    size="2x"
                />
                <strong className="text-3xl">
                    {title}
                </strong>
            </div>

            <div className="flex-1 px-4! py-2!">
                <p>
                    {label}
                </p>
            </div>

            <footer
                className="
                flex flex-row
                p-2!
                justify-end
                w-full
                bg-(--bg-soft)
                border-t border-t-white/20
                "
            >
                <DefaultButton
                    icon={'check'}
                    label={'Aceptar'}
                    customColor={'bg-green-400'}
                    iconLeft
                    onClick={() => closeDialog()}
                />
            </footer>
        </section>
    )
}
export default AlertDialog