
// eslint-disable-next-line no-unused-vars
function ChipItem({ label, route, selected, onSelected }) {
    return (
        <div className={`
        transition cursor-pointer
        w-fit
        px-4! py-0.5!
        bg-(--accent-alt)
        rounded-full
        border-2 border-white/20

        ${selected ? 'bg-white **:text-(--bg-alt)!' : ''}
        hover:bg-white hover:**:text-(--bg-alt)!
        `} onClick={onSelected} >
            <strong className="transition text-white!">{label}</strong>
        </ div>
    )
}
export default ChipItem