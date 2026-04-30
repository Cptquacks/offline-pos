import { DialogContext } from "../context/DialogContex"
import useDialogStore from "../stores/dialogStore"


function DialogView({ children }) {

    const closeDialog = useDialogStore((state) => state.closeDialog);

    return (
        <DialogContext.Provider value={closeDialog}>
            <section>
                {children}
            </section>
        </DialogContext.Provider>
    )
}
export default DialogView