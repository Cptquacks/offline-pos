import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function DefaultButton(
    {
        icon, iconSize = "md", iconLeft = false,
        label, type = "button",
        onClick, disabled = false,
        customColor = null, inversedIcon = false
    }
) {
    return (
        <button
            className={`
            transition 
            cursor-pointer
            flex 
            items-center
            px-3! py-1! gap-1
            text-white!
            rounded-xs

            hover:not-disabled:bg-white! 
            hover:not-disabled:text-(--bg-alt)! 
            
            disabled:cursor-not-allowed
            disabled:opacity-50

            ${iconLeft ? 'flex-row-reverse' : 'flex-row'}
            ${customColor ? `${customColor} border border-white/40` : 'bg-(--accent-alt)'} 
            `}
            onClick={onClick}
            type={type}
            disabled={disabled}
        >
            <FontAwesomeIcon className={`${inversedIcon ? 'fa-rotate-180' : ''}`} icon={`${icon}`} size={iconSize} />
            <strong>
                {label}
            </strong>
        </button>
    )
}

export default DefaultButton