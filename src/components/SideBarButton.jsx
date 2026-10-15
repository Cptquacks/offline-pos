import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

/**
 * @param {Number} index
 * @param {String} label 
 * @param {String} icon 
 * @param {Boolean} selected
 * @param {Function} onSelected
 * @returns {import("react").ReactElement}
 */
function SideBarButton({ label, icon, route, selected, onSelected, showLabel = true }) {
    const navigate = useNavigate()

    const handleSelection = () => {
        onSelected(route)
        navigate(route)
    }
    return (
        <div className={`
        transition-normal cursor-pointer

        flex flex-row
        h-fit 
        items-center
        gap-2 p-4! py-3!
        ${showLabel ? 'w-full' : 'w-fit py-4!'}

        bg-(--bg-alt) ${selected ? 'bg-(--accent)/30! text-white' : ''}
        border border-(--border) rounded-md

        ${selected ? 'shadow-md shadow-purple-600/10' : 'hover:shadow-(--shadow)'}
        `} onClick={handleSelection}>
            <FontAwesomeIcon icon={`fas fa-${icon}`} size="lg" />
            {showLabel &&
                <p className={`
                font-bold! ${selected ? 'text-white!' : ''}
                `}>
                    {label}
                </p>
            }
        </div>
    )
}
export default SideBarButton;