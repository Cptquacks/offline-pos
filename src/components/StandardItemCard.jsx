import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DeleteButton from "./DeleteButton";
import MissingData from "./MissingData";
import DefaultButton from "./DefaultButton";

function StandardItemCard({
    icon = 'times',
    codeBar,
    title, tagItem,
    stockDisplay, salaryDisplay,
    restockButton, contactButton,
    expirationDisplay,
    contractDisplay,
    onEdit, onDelete,
    isOnPreview = false, missingData = false

}) {
    return (
        <section
            className="
            flex-1
            flex flex-col
            p-1! gap-3
            bg-(--bg-soft)
            h-full w-fit
            border border-white/15
            rounded-sm
            "
        >
            <div
                className="
                flex flex-row
                items-start justify-between
                w-full
                "
            >
                <FontAwesomeIcon className="pt-2!" icon={icon} size="3x" />
                <div
                    className="flex flex-col items-end justify-center px-2!"
                >
                    <strong className="text-lg">
                        {title}
                    </strong>
                    {codeBar &&
                        <small className="text-xs opacity-50">
                            {codeBar}
                        </small>
                    }
                </div>
            </div>

            <div className="flex-1 flex flex-row flex-wrap items-start justify-between gap-1">
                {stockDisplay}
                {salaryDisplay}
                {tagItem}
                {expirationDisplay}
                {contractDisplay}
                {missingData && <MissingData />}
            </div>

            <div className="flex flex-row items-center justify-between *:h-full w-full">
                <div className="flex-1 flex flex-row items-center justify-start gap-0.5 *:h-full">
                    <DefaultButton
                        icon={'pen-to-square'}
                        label={'Editar'}
                        onClick={!isOnPreview ? onEdit : false}
                    />
                    {!isOnPreview && restockButton}
                    {contactButton}
                </div>
                <DeleteButton onDelete={isOnPreview ? onDelete : false} />
            </div>
        </section>
    )
}

export default StandardItemCard