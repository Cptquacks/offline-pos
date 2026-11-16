import { useState } from "react";
import DefaultButton from "./DefaultButton";
import DeleteButton from "./DeleteButton";
import EmptyList from "./EmptyList";
import TagListWrapper from "./TagListWrapper";
import TagItem from "./TagItem";

function TagList({ label, elements, icon, onAdd, onDelete, onModified }) {

    const [newItem, setNewItem] = useState('')
    const [selectedIndexes, setSelectedIndexes] = useState([])

    const handleSelection = (id) => {
        if (selectedIndexes.includes(id)) {
            setSelectedIndexes(prev => prev.filter(entry => entry !== id))
            return
        }
        setSelectedIndexes(prev => ([...prev, id]))
    }

    return (
        <div className="
        flex flex-col
        w-full h-128
        p-4! gap-3
        bg-(--bg-soft)
        border border-(--border)
        rounded-md
        ">
            <div className="
            flex flex-col
            gap-3
            ">
                <div
                    className="
                    flex flex-row
                    items-center justify-between
                    "
                >
                    <strong>
                        {label}
                    </strong>

                    {elements &&
                        <strong>
                            Elementos: {elements.length}
                        </strong>
                    }
                </div>

                <form className="
                flex flex-row
                items-end
                bg-(--bg)
                p-2! gap-3
                rounded-sm
                border border-white/20
                " onSubmit={(event) => {
                    event.preventDefault()
                    onAdd(newItem)
                    setNewItem('')
                }}>
                    <input
                        className="
                        items-center self-stretch 
                        border-b border-b-(--accent-alt)
                        w-fit
                        "
                        type="text"
                        placeholder="Nueva entrada"
                        value={newItem}
                        onChange={event => setNewItem(event.target.value)}
                        required
                    />

                    <DefaultButton
                        icon="plus"
                        label="Añadir"
                        type="submit"
                    />
                </form>
            </div>

            <div className="
            flex-1
            flex flex-col 
            p-2! gap-1
            w-full
            overflow-y-auto
            ">

                {(elements && elements.length === 0) &&
                    <EmptyList />
                }

                {elements && elements.map((element, index) =>
                    <TagListWrapper
                        key={element.id ?? index}
                        color={element.color ?? null}
                        isSelected={selectedIndexes.includes(element.id)}

                        onSelected={() => {
                            handleSelection(element.id)
                        }}
                        onColorSelected={data => onModified({ name: element.name, color: data }, element.id)}
                    >
                        <TagItem
                            label={element.name ?? element}
                            color={element.color ?? null}
                            icon={icon} />
                    </TagListWrapper>
                )}
            </div>

            {(selectedIndexes && selectedIndexes.length > 0) && <div className="
            flex flex-row
            items-center
            p-2!
            justify-between
            bg-(--bg-alt)
            border border-(--border)
            rounded-md
            ">
                <strong>
                    Elementos seleccionados: {selectedIndexes.length ?? 0}
                </strong>
                <DeleteButton onDelete={() => {
                    onDelete(selectedIndexes)
                    setSelectedIndexes([])
                }} />
            </div>}
        </div>
    )
}

export default TagList