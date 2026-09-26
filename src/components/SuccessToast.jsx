import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function SuccessToast({ label }) {
    return (
        <div className="
        flex flex-row
        w-full min-h-12
        self-stretch
        gap-2

        bg-emerald-950
        border border-emerald-300/20
        text-emerald-200!

        rounded-lg
        overflow-hidden
        ">
            <div className="
            flex flex-col
            w-fit
            items-center justify-center 
            bg-emerald-300/20
            ">
                <FontAwesomeIcon
                    className="
                    flex-1
                    px-4!
                    "
                    icon={'check'}
                    size="md" />
            </div>

            <div className="flex-1 p-2!">
                <strong className="text-md">
                    {label}
                </strong>
            </div>
        </div>
    )
}
export default SuccessToast