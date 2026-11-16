import { useEffect, useState } from "react"
import LoadingWidget from "./LoadingWidget"
import useStaffStore from "../stores/staffStore"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import TagItem from "./TagItem"
import DefaultButton from "./DefaultButton"
import useDialogStore from "../stores/dialogStore"
import DialogContainer from "./DialogContainer"
import UserCard from "./UserCard"

function AccountDisplay() {
    const { staffData, loadData } = useStaffStore()
    const { openDialog, closeDialog } = useDialogStore()

    const [userID, setUserID] = useState(1)
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        (async () => {
            await loadData()
            const user = staffData.find(member => member.id === userID)
            setUserData(user)
        })()
    }, [userID, loadData])

    if (staffData.length === 0) return
    if (!userData) return <LoadingWidget />
    return (
        <section
            className="
            flex flex-col
            p-2!
            bg-(--bg-soft)
            border-white/10 border rounded-md
            "
        >
            <section className="flex flex-row items-start w-full gap-1">
                <FontAwesomeIcon icon={'user'} size="2x" />
                <div className="flex flex-col w-full gap-3">

                    <div className="flex flex-row w-full justify-between">
                        <strong className="mx-1">{userData?.name}</strong>
                        <TagItem sm label={userData?.role} />
                    </div>
                </div>
            </section>

            <hr className="border-white/15 border my-3! mb-2!" />
            <div className="flex flex-row w-full *:w-full *:rounded-full items-center">
                <DefaultButton
                    icon={'user-cog'}
                    label={'Cambiar de usuario'}
                    onClick={() => openDialog(
                        <DialogContainer topBarLabel="Cuentas de usuario">
                            <div className="grid grid-cols-5 gap-1 m-2!">
                                {staffData.sort((a, b) => a.id - b.id).map(user =>
                                    <UserCard
                                        key={user.id}
                                        name={user.name}
                                        onClick={() => { setUserID(user.id); closeDialog() }}
                                    />
                                )}
                            </div>
                        </DialogContainer>
                    )}
                />
            </div>
        </section >
    )
}
export default AccountDisplay