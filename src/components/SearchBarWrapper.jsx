function SearchBarWrapper({ children, scroll }) {
    return (
        <nav
            className={`
            transition
            flex flex-row 
            gap-2 py-2! px-4! 
            justify-between 
            shadow-black/25!
            border-b border-dotted 
            ${scroll !== 0 ? 'shadow-xl border-b-white/15' : 'shadow-none border-b-transparent'}
            z-99
            `}
        >
            {children}
        </nav>
    )
} export default SearchBarWrapper