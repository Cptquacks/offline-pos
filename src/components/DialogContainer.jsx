import DialogTopBar from "./DialogTopBar"

function DialogContainer({ children, topBarLabel = '', hasTopBar = true }) {
    return (
        <section className="
        flex flex-col
        bg-(--bg)
        w-fit min-w-[50dvw]
        h-fit min-h-[50dvh]
        rounded-md
        border border-(--border)
        overflow-hidden
        ">
            {hasTopBar && <DialogTopBar label={topBarLabel} />}

            <div className="flex-1 overflow-y-auto">
                {children}
            </div>
        </section>
    )
}
export default DialogContainer