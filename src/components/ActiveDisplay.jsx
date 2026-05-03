function ActiveDisplay({ isActive = true }) {
    return (
        <div className={`
        transition
        flex flex-row
        items-center justify-center
        px-4! py-0.5!
        border
        rounded-full

        ${isActive ?
                'bg-green-950/30 text-green-600 border-green-600' :
                'bg-red-950/30 text-red-600 border-red-600'
            }
        `}>
            <strong>
                {isActive ? 'Activo' : 'Inactivo'}
            </strong>
        </div>
    )
}

export default ActiveDisplay