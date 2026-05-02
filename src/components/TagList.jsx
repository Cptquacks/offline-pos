import { useState } from "react";
import DefaultButton from "./DefaultButton";
import DeleteButton from "./DeleteButton";
import EmptyList from "./EmptyList";

function TagList({ label, children, onAdd, onDelete, selected }) {

    const [newItem, setNewItem] = useState(null)

    return (
        <div className="
        flex flex-col
        p-4! gap-3
        bg-(--bg-soft)
        border border-(--border)
        rounded-md
        ">
            <div className="
            flex flex-col
            gap-1
            ">
                <strong>
                    {label}
                </strong>

                <form className="
                flex flex-row
                items-end
                bg-(--bg)
                p-2! gap-3
                rounded-sm
                border border-white/20
                " onSubmit={() => onAdd(newItem)}>
                    <input
                        className="
                        items-center self-stretch 
                        border-b border-b-(--accent-alt)
                        "
                        type="text"
                        placeholder="Nueva entrada"
                        value={newItem}
                        onChange={event => setNewItem(event.target.value)}
                        required />
                    <DefaultButton
                        icon="plus"
                        label="Añadir"
                        type="submit"
                        onClick={() => { }}
                    />
                </form>
            </div>

            <div className="
            flex-1
            flex flex-col gap-1
            w-full
            overflow-y-scroll
            ">

                {(children && children.length === 0) &&
                    <EmptyList />
                }

                {children}
            </div>

            {(selected && selected.length > 0) && <div className="
            flex flex-row
            items-center
            p-2!
            justify-between
            bg-(--bg-alt)
            border border-(--border)
            rounded-md
            ">
                <strong>
                    Elementos seleccionados: {selected.length ?? 0}
                </strong>
                <DeleteButton onDelete={onDelete} />
            </div>}
        </div>
    )
}

export default TagList