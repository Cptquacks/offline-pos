import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function UserCard({ name, onClick = () => { } }) {
    return (
        <button className="
        transition
        cursor-pointer
        flex flex-col
        p-2! gap-3
        h-38
        items-center justify-center
        bg-(--bg-soft)
        rounded-sm
        border border-transparent
        hover:border-white/25
        hover:bg-(--accent-alt)/50
        hover:text-white
        " onClick={onClick}>
            <FontAwesomeIcon icon={'user'} size="3x" />
            <strong>
                {name}
            </strong>
        </button>
    )
}
export default UserCard