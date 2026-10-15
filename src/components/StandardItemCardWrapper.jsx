function StandardItemCardWrapper({ children, isSelected = false, canSelect = false, onSelect }) {
    return (
        <section
            className="
            flex flex-row
            items-center

            "
        >
            {canSelect && <div
                className="
                flex flex-row
                items-center
                w-fit h-full
                gap-1 p-2!
                bg-(--accent-alt)/50
                border border-white/15
                border-r-0 border-r-transparent
                rounded-sm rounded-r-none
                "
            >
                <input
                    className="
                    w-5
                    h-5
                    "
                    type="checkbox" id="selectionCheckbox"
                    checked={isSelected}
                    onChange={onSelect}
                />
            </div>}
            {children}
        </section>
    )
}

export default StandardItemCardWrapper