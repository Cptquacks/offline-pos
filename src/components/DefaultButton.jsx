import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function DefaultButton(
    {
        icon, iconSize = "md", iconLeft = false,
        label, customColor = null, inversedIcon = false, type = "button",
        disabled = false, loading = false, onClick
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
            type={type}
            disabled={disabled || loading}

            onClick={onClick}
        >
            <FontAwesomeIcon
                className={`
                ${inversedIcon ? 'fa-rotate-180' : ''}
                `}
                icon={!loading ? `${icon}` : 'spinner'}
                size={iconSize}
                spinPulse={loading}
            />
            <strong>
                {label}
            </strong>
        </button>
    )
}

export default DefaultButton