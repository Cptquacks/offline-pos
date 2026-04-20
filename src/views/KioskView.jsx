import { useEffect, useState } from "react"
import KioskProductList from "../components/KioskProductList"
import LogList from "../components/LogList"

function KioskView() {
    const [productsList, setProductsList] = useState([])
    const [storeTickets, setSoreTickets] = useState([])


    /**
     * 
     * @param {Number} index 
     * @param {Object} data
     */
    const createTicket = async (index, data) => {
        const product = productsList[index]
        const newTicket = {
            product: product.name,
            cost: product.price,
            amount: data.amount,
            currency: product.currency,
            total: product.price * data.amount,
            date: new Date().toISOString().split('T')[0],
            type: data.type
        }

        if (!window.electronAPI) return
        await window.electronAPI.modifyJSON('tickets.json', newTicket)
            .catch(err => console.error(err))

        await window.electronAPI.readJSON('tickets.json')
            .then(res => setSoreTickets(res))
            .catch(err => console.error(err))
    }

    const cleanTicketLog = async () => {

        if (!window.electronAPI) return
        await window.electronAPI.writeJSON('tickets.json', [])
            .then(res => setSoreTickets([]))
            .catch(err => console.error(err))
    }

    /**
     * 
     * @param {Number} index 
     * @param {Number} amount 
     */
    const submitSale = (index, amount) => {
        const data = {
            amount: amount,
            type: "Venta"
        }

        createTicket(index, data)
        modifyProduct(index, amount)
    }

    /**
     * 
     * @param {Number} index 
     * @param {Number} amount 
     */
    const submitRefund = (index, amount) => {
        const data = {
            amount: amount,
            type: "Devolución"
        }
        createTicket(index, data)
        modifyProduct(index, amount * -1)
    }


    /**
     * 
     * @param {Number} index 
     * @param {Number} amount 
     */
    const modifyProduct = async (index, amount) => {
        let productsCopy = productsList
        let data = productsCopy[index]

        // eslint-disable-next-line react-hooks/immutability
        data.current -= amount
        // eslint-disable-next-line react-hooks/immutability
        productsCopy[index] = data

        if (!window.electronAPI) return
        await window.electronAPI.writeJSON('products.json', productsCopy)
            .then(res => console.log(res))
            .catch(err => console.error(err))

        await window.electronAPI.readJSON('products.json')
            .then(res => setProductsList(res))
            .catch(err => console.error(err))
    }

    useEffect(() => {
        if (!window.electronAPI) return
        async function awaitAPI() {
            await window.electronAPI.readJSON('products.json')
                .then(res => setProductsList(res))
                .catch(err => console.error(err))

            await window.electronAPI.readJSON('tickets.json')
                .then(res => setSoreTickets(res))
                .catch(err => console.error(err))
        }
        awaitAPI()
    }, [])

    return (
        <section className="
        grid 
        grid-cols-3 grid-rows-1
        h-full
        p-4! gap-3">

            <div className="
            flex flex-col
            gap-3
            col-span-2
            bg-(--bg-soft)
            rounded-md
            overflow-y-scroll
            ">
                <KioskProductList data={productsList}
                    onSell={(index, amount) => submitSale(index, amount)} onRefund={(index, amount) => submitRefund(index, amount)} />
            </div>

            <div className="
            flex flex-col
            p-4! gap-3
            bg-(--bg-soft)
            rounded-md
            overflow-y-scroll
            ">
                <LogList logs={storeTickets.toReversed()} onClean={() => cleanTicketLog()} />
            </div>

        </section>
    )
}
export default KioskView