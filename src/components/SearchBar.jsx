import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"

function SearchBar({ onSearch }) {
    const [searchQuery, setQuery] = useState('')
    const submitSearch = () => {
        onSearch(searchQuery)
    }

    return (
        <form onSubmit={submitSearch} className="
        flex flex-row 
        self-center items-center
        px-1! pl-4! py-1! gap-2
        bg-(--bg-alt)
        border border-(--border)
        rounded-full
        ">
            <input className="
            flex-1
            border-b-2 border-(--accent)
            px-2! py-0.5!
            text-sm
            " type="search" placeholder="Búsqueda..." required
                value={searchQuery} onChange={event => setQuery(event.target.value)} />

            <button className="
            transition-normal cursor-pointer
            bg-(--accent-alt) hover:bg-white
            text-white hover:text-(--bg)
            p-1!
            rounded-full
            " onClick={submitSearch}>
                <FontAwesomeIcon icon={faSearch} size="lg" />
            </button>
        </form>
    )
}
export default SearchBar