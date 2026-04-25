import { useState } from "react"

function SearchBar({ onSearch }) {
    const [searchQuery, setQuery] = useState('')
    const submitSearch = (event) => {
        setQuery(event.target.value)
        onSearch(event.target.value)
    }

    return (
        <div className="
        flex flex-row
        w-full 
        self-center items-center
        px-6! py-1.5! gap-2
        bg-(--bg-alt)
        border border-(--border)
        rounded-full
        ">
            <input className="
            flex-1
            border-b-2 border-(--accent)
            px-2! py-0.5!
            text-md
            " type="search" placeholder="Búsqueda..." required
                value={searchQuery} onChange={submitSearch} />
        </div>
    )
}
export default SearchBar