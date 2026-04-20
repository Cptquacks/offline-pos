import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import EmptyList from "./EmptyList"
import LogItem from "./LogItem"
import { faBrush } from "@fortawesome/free-solid-svg-icons"
import SearchBar from './SearchBar'

function LogList({ logs, onClean }) {
    return (
        <div className="
        flex flex-col
        p-px! gap-2
        ">
            <div className="
            flex flex-row
            items-center justify-between">
                <p className="
                font-bold!
                text-xl
                ">
                    Recíbos
                </p>

                <button className="
                transition-normal cursor-pointer
                flex flex-row
                items-center
                font-bold
                px-3! py-1! gap-1
                bg-(--accent-alt) hover:bg-white
                text-white hover:text-(--bg-alt)
                rounded-xs
                " onClick={onClean}>
                    Limpiar
                    <FontAwesomeIcon className="
                    fa-rotate-180
                    " icon={faBrush} />
                </button>
            </div>

            <div>
                <SearchBar />
            </div>

            {logs.length === 0 &&
                <EmptyList />}
            {
                logs.map((log, index) =>
                    <LogItem key={index} data={{ index: index, ...log }} />
                )
            }
        </div>
    )
}
export default LogList