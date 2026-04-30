// components/DialogRoot.jsx
import useDialogStore from '../stores/dialogStore';
import DialogView from '../views/DialogView';

function DialogRoot() {
    const { isOpen, dialogContent, closeDialog } = useDialogStore();

    if (!isOpen) return null;

    return (
        <div className="
        fixed 
        inset-0 
        z-50 flex 
        items-center 
        justify-center 
        bg-black/80
        ">
            <DialogView className>
                {dialogContent}
            </DialogView>
        </div>
    );
}

export default DialogRoot;