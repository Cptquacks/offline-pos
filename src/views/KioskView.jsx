import { useEffect, useState } from "react"
import useTicketStore from "../stores/ticketStore"
import useProductStore from "../stores/productStore"
import ItemsList from "../components/ItemsList"
import KioskProductItem from "../components/KioskProductItem"
import TicketItem from "../components/TicketItem"
import SearchBar from "../components/SearchBar"
import TagFilter from "../components/TagFilter"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBrush, faCheck, faShoppingCart, faTicket } from "@fortawesome/free-solid-svg-icons"
import CartItem from "../components/CartItem"
import { registerRefund, registerSell } from "../utils/ticket-util"

function KioskView() {
    const { productData, loadData, modifyProduct } = useProductStore()
    const { ticketData, loadData: loadTickets, addTicket, cleanTickets } = useTicketStore()

    const [cartItems, setCartItems] = useState([])

    const handleSell = () => {
        addTicket(registerSell(cartItems))

        productData.forEach((item, index) => {
            const data = cartItems.filter(product => item.name === product.name)[0]
            if (!data) return

            const updatedProduct = { ...item, current: item.amount - data.cart }
            modifyProduct(updatedProduct, index)
            loadData()
        })

        setCartItems([])
    }

    useEffect(() => {
        loadData()
        loadTickets()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <section className="
        grid 
        grid-cols-2 grid-rows-2
        h-full
        p-4! gap-3">

            <div className="
            flex flex-col
            row-span-2
            gap-3
            bg-(--bg-soft)
            rounded-md
            overflow-y-scroll
            ">
                <div className="
                flex flex-row
                justify-between
                p-4!
                ">
                    <SearchBar />
                    <TagFilter />
                </div>
                <ItemsList>
                    {productData.map((item, index) =>
                        <KioskProductItem
                            key={index}
                            data={{ index: index, ...item }}
                            onAdd={
                                (data, amount) => setCartItems(prev => ([
                                    ...prev,
                                    { cart: amount, ...data }
                                ]))
                            }
                            onRefund={(data, amount) => {
                                addTicket(registerRefund(data, amount))
                            }}
                        />)}
                </ItemsList>
            </div>

            <div className="
            flex flex-col
            p-4! gap-3
            bg-(--bg-soft)
            rounded-md
            overflow-y-scroll
            ">
                <div className="flex flex-row justify-between items-end">
                    <div className="flex flex-row items-center gap-1">
                        <FontAwesomeIcon icon={faShoppingCart} size="xl" />
                        <p className="font-bold! text-2xl">
                            Carrito de compra
                        </p>
                    </div>

                    <div className="
                    font-bold text-xl
                    px-4! py-0.5!
                    bg-(--bg-alt)
                    border border-(--border)
                    rounded-full
                    ">
                        Productos: {cartItems.length}
                    </div>
                </div>

                <div className="
                flex flex-row
                self-end
                p-2! gap-3
                bg-(--bg-alt)
                border border-(--border)
                rounded-md
                ">
                    <button className="
                    flex flex-row
                    items-center
                    px-3! py-1! gap-1
                    font-bold!
                    text-white! 
                    bg-green-600
                    border border-white/40
                    rounded-sm

                    transition cursor-pointer
                    hover:bg-white hover:text-(--bg-alt)!
                    " onClick={handleSell}>
                        <FontAwesomeIcon icon={faCheck} />
                        Vender
                    </button>

                    <button className="
                    flex flex-row
                    items-center
                    px-3! py-1! gap-1
                    font-bold!
                    text-white! 
                    bg-red-600
                    border border-white/40
                    rounded-sm

                    transition cursor-pointer
                    hover:bg-white hover:text-(--bg-alt)!
                    " onClick={() => setCartItems([])}>
                        <FontAwesomeIcon className="fa-rotate-180" icon={faBrush} />
                        Limpiar
                    </button>
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
            overflow-y-scroll
            ">
                <div className="flex flex-row justify-between items-end">

                    <div className="flex flex-row gap-3 items-center">
                        <FontAwesomeIcon icon={faTicket} size="xl" />
                        <p className="font-bold! text-2xl">
                            Recibos de compra
                        </p>
                    </div>

                    <button className="
                    flex flex-row
                    items-center
                    px-3! py-1! gap-1
                    font-bold!
                    text-white! 
                    bg-(--accent-alt)
                    rounded-xs

                    transition cursor-pointer
                    hover:bg-white hover:text-(--bg-alt)!
                    " onClick={() => {
                            loadTickets()
                            cleanTickets()
                        }}>
                        <FontAwesomeIcon className="fa-rotate-180" icon={faBrush} />
                        Limpiar
                    </button>
                </div>

                <ItemsList>
                    {ticketData.map((ticket, index) =>
                        <TicketItem key={index}
                            data={ticket} />
                    )}
                </ItemsList>
            </div>

        </section>
    )
}
export default KioskView