import DefaultButton from "./DefaultButton";

function EditButton({ onClick, onSave, onEditMode = false, canSave = false }) {
    if (onEditMode) {
        return (<DefaultButton label="Guardar" icon="save" onClick={onSave} disabled={!canSave} />)
    }
    return (<DefaultButton label="Editar" icon="pen-to-square" onClick={onClick} />)
}

export default EditButton