import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function LoadingDialog({ label = 'Loading...', current = 0, total = 0 }) {
    return (
        <div className="
        flex flex-col
        w-fit h-fit
        p-4! gap-3
        bg-(--bg)
        border border-white/20
        rounded-md
        ">
            <div className="
            flex flex-row
            items-center justify-between
            gap-3
            ">
                <strong>
                    {label}
                </strong>

                {total === 0 &&
                    <FontAwesomeIcon icon={faSpinner} spinPulse size="lg" />
                }
            </div>
            {(total !== 0) &&
                <div className="
                flex flex-col
                gap-3
                ">
                    <hr className="border-white/20" />

                    <div className="
                    flex flex-row
                    items-center
                    gap-3
                    ">
                        <progress
                            className="
                            w-64 h-2.5
                            [&::-webkit-progress-bar]:rounded-full
                            [&::-webkit-progress-bar]:overflow-hidden
                            [&::-webkit-progress-bar]:bg-(--bg-alt)
                            
                            [&::-webkit-progress-value]:rounded-full
                            [&::-webkit-progress-value]:bg-(--accent)
                            "
                            max={`${total}`}
                            value={`${current}`}
                        />
                        <div className="
                        flex flex-row
                        items-center
                        gap-1
                        ">
                            <FontAwesomeIcon icon={faSpinner} spinPulse size="md" />
                            <strong>
                                {(current / total) * 100}%
                            </strong>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
export default LoadingDialog