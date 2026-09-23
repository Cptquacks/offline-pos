import { useEffect, useMemo, useState } from "react"
import useTicketStore from "../stores/ticketStore"
import useProductStore from "../stores/productStore"
import ItemsList from "../components/ItemsList"
import KioskProductItem from "../components/KioskProductItem"
import TicketItem from "../components/TicketItem"
import SearchBar from "../components/SearchBar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faReceipt, faShoppingCart } from "@fortawesome/free-solid-svg-icons"
import CartItem from "../components/CartItem"
import { registerRefund, registerSell } from "../utils/ticket-util"
import useTraceStore from "../stores/traceStore"
import DropdownMenu from "../components/DropdownMenu"
import useTagStore from "../stores/tagStore"
import { stringSimilarity } from "../utils/string-util"
import DefaultButton from "../components/DefaultButton"

function KioskView() {
    const { productData, loadData, modifyProduct } = useProductStore()
    const { ticketData, loadData: loadTickets, addTicket, cleanTickets } = useTicketStore()
    const { tagList, loadTags } = useTagStore()
    const { addSell, addRefund } = useTraceStore()

    const tags = useMemo(() => {
        let result = [{ label: 'Todos', icon: 'filter', value: 'All' }]
        const mappedArray = tagList.map(tag => ({ label: tag.name, icon: 'tag' }))
        result = result.concat(mappedArray)
        return result
    }, [tagList])

    const [cartItems, setCartItems] = useState([])
    const [filter, setFilter] = useState('All')
    const [query, setQuery] = useState('')

    const filteredList = useMemo(() => {
        let result = productData

        if (filter !== 'All') {
            result = result.filter(product => product.tag === filter)
        }

        if (query.trim().length > 0) {
            result = result.filter(product => stringSimilarity(product.name, query) >= 0.3)
            result = result.map(product => ({ ...product, similarity: stringSimilarity(product.name, query) }))
            result = result.sort((a, b) => b.similarity - a.similarity)

        }

        return result
    }, [query, filter, productData])

    const handleSell = async () => {
        addTicket(registerSell(cartItems))
        addSell(cartItems)

        const productNames = cartItems.map(item => item.name)

        for (let index = 0; index < productData.length; index++) {
            if (!productNames.includes(productData[index].name)) continue


            const data = cartItems.find(product => productData[index].name === product.name)
            if (!data) return
            const updatedProduct = { ...data, current: data.current - data.cart }
            modifyProduct(updatedProduct, index)
        }

        setCartItems([])
    }

    /**
     * 
     * @param {Object} data 
     * @param {NUmber} amount 
     */
    const handleRefund = (data, amount) => {

        addTicket(registerRefund(data, amount))
        addRefund(data, amount)

        productData.forEach((item, index) => {
            if (item.name !== data.name) return
            const updatedProduct = { ...item, current: parseInt(item.current) + parseInt(amount) }
            modifyProduct(updatedProduct, index)
        })
    }

    useEffect(() => {
        loadData()
        loadTickets()
        loadTags()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <section className="
        grid 
        grid-cols-3 grid-rows-2
        h-full
        p-4! gap-3">

            <div className="
            flex flex-col
            col-span-2 row-span-2
            gap-3
            bg-(--bg-soft)
            rounded-md
            ">
                <div className="
                flex flex-row
                justify-between
                py-2! px-4! gap-3
                ">
                    <SearchBar
                        onSearch={data => setQuery(data)}
                    />
                    <DropdownMenu
                        elements={tags}
                        onSelected={data => setFilter(data)}
                    />
                </div>

                <div className="
                flex flex-col
                overflow-y-auto
                ">
                    <ItemsList>
                        {filteredList.map((item, index) =>
                            <KioskProductItem
                                key={index}
                                data={{ index: index, ...item }}
                                onAdd={
                                    (data, amount) => setCartItems(prev => ([
                                        ...prev,
                                        { ...data, cart: amount }
                                    ]))
                                }
                                onRefund={(data, amount) => handleRefund(data, amount)}
                            />)}
                    </ItemsList>
                </div>
            </div>

            <div className="
            flex flex-col
            p-4! gap-3
            bg-(--bg-soft)
            rounded-md
            overflow-y-auto
            ">
                <div
                    className="
                    flex flex-row 
                    justify-between items-center
                    "
                >
                    <FontAwesomeIcon icon={faShoppingCart} size="xl" />



                    <div className="
                    flex flex-row
                    self-end
                    p-1.5! gap-2
                    bg-(--bg-alt)
                    border border-(--border)
                    rounded-sm
                    ">
                        <DefaultButton
                            label="Vender"
                            icon="check"
                            onClick={handleSell}
                            customColor="bg-green-600"
                            disabled={cartItems.length === 0}
                        />

                        <DefaultButton
                            label="Limpiar"
                            icon="brush"
                            onClick={handleSell}
                            customColor="bg-red-600"
                            inversedIcon
                        />
                    </div>
                </div>

                <ItemsList>
                    {cartItems.map((item, index) =>
                        <CartItem key={index}
                            data={{ index: index, ...item }}
                            onRemove={(target) => {
                                setCartItems(prev => prev.filter((_, index) => index !== target))
                            }} />
                    )}
                </ItemsList>
            </div>

            <div className="
            flex flex-col
            p-4! gap-3
            bg-(--bg-soft)
            rounded-md
            ">
                <div className="flex flex-row justify-between items-end">

                    <div className="flex flex-row gap-3 items-center">
                        <FontAwesomeIcon icon={faReceipt} size="xl" />
                        <p className="font-bold! text-2xl">
                            Recibos de compra
                        </p>
                    </div>

                    <DefaultButton
                        label="Limpiar"
                        icon="brush"
                        inversedIcon
                        onClick={() => {
                            loadTickets()
                            cleanTickets()
                        }}
                    />
                </div>

                <div className="overflow-y-auto">
                    <ItemsList>
                        {ticketData.map((ticket, index) =>
                            <TicketItem key={index}
                                data={ticket} />
                        )}
                    </ItemsList>
                </div>
            </div>

        </section>
    )
}
export default KioskView