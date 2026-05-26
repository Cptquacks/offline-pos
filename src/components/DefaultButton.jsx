import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function DefaultButton({ icon, label, onClick, type = "button", disabled = false, iconLeft = false }) {
    return (
        <button
            className={`
            transition cursor-pointer disabled:cursor-not-allowed
            flex ${iconLeft ? 'flex-row-reverse' : 'flex-row'} 
            items-center
            px-3! py-1! gap-1
            bg-(--accent-alt) text-white!
            rounded-xs

            hover:not-disabled:bg-white! hover:not-disabled:text-(--bg-alt)!
            disabled:opacity-50
            `}
            onClick={onClick}
            type={type}
            disabled={disabled}>
            <FontAwesomeIcon icon={`${icon}`} />
            <strong>
                {label}
            </strong>
        </button>
    )
}

export default DefaultButton