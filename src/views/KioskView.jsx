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
import useTraceStore from "../stores/traceStore"
import DropdownMenu from "../components/DropdownMenu"
import useTagStore from "../stores/tagStore"
import { stringSimilarity } from "../utils/string-util"
import DefaultButton from "../components/DefaultButton"
import SearchBarWrapper from "../components/SearchBarWrapper"
import useAlertStore from "../stores/alertStore"
import ErrorToast from "../components/ErrorToast"

function KioskView() {
    const { productData, loadData } = useProductStore()
    const { ticketData, loadData: loadTickets, addSale, addRefund, cleanTickets } = useTicketStore()
    const { tagList, loadTags } = useTagStore()
    const { addAlert } = useAlertStore()
    const { ensureToday, loadData: loadTraces } = useTraceStore()

    const [scroll, setScroll] = useState(0)
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
            result = result.filter(product => product.category === filter)
        }

        if (query.trim().length > 0) {
            result = result.filter(product => stringSimilarity(product.name, query) >= 0.3)
            result = result.map(product => ({ ...product, similarity: stringSimilarity(product.name, query) }))
            result = result.sort((a, b) => b.similarity - a.similarity)

        }

        return result
    }, [query, filter, productData])

    const handleAddToCart = async (product, amount) => {
        const quantity = Number(amount)
        const alreadyInCart = cartItems
            .filter((item) => item.id === product.id)
            .reduce((total, item) => total + Number(item.cart), 0)

        if (!Number.isInteger(quantity) || quantity <= 0 || alreadyInCart + quantity > product.stock) {
            addAlert(<ErrorToast label={`Stock insuficiente para ${product.name}`} />)
            return
        }

        try {
            await ensureToday()
        } catch (error) {
            addAlert(<ErrorToast label={error instanceof Error ? error.message : "No se pudo preparar la traza de hoy."} />)
            return
        }
        setCartItems((items) => [...items, { ...product, cart: quantity }])
    }

    const handleSell = async () => {
        const soldAmounts = cartItems.reduce((amounts, item) => {
            amounts.set(item.id, (amounts.get(item.id) ?? 0) + Number(item.cart))
            return amounts
        }, new Map())

        for (const [productId, amount] of soldAmounts) {
            const product = productData.find((item) => item.id === productId)
            if (!product || product.stock < amount) {
                addAlert(<ErrorToast label={`Stock insuficiente para ${product?.name ?? 'un producto del carrito'}`} />)
                return
            }
        }

        try {
            await addSale(cartItems)
        } catch (error) {
            addAlert(<ErrorToast label={error instanceof Error ? error.message : "No se pudo completar la venta."} />)
            return
        }
        await loadData()
        setCartItems([])
    }

    /**
     * 
     * @param {Object} data 
     * @param {NUmber} amount 
     */
    const handleRefund = async (data, amount) => {

        try {
            await addRefund(data, amount)
        } catch (error) {
            addAlert(<ErrorToast label={error instanceof Error ? error.message : "No se pudo registrar la devolución."} />)
            return
        }
        await loadData()
    }

    useEffect(() => {
        loadData()
        loadTickets()
        loadTraces()
        loadTags()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <section
            className="
            grid grid-cols-3
            h-full
            p-4! gap-3
            "
        >

            <div className="
            flex flex-col
            col-span-2
            bg-(--bg-soft)
            rounded-md
            ">
                <SearchBarWrapper scroll={scroll}>
                    <SearchBar
                        onSearch={data => setQuery(data)}
                    />
                    <DropdownMenu
                        elements={tags}
                        onSelected={data => setFilter(data)}
                    />
                </SearchBarWrapper>

                <div
                    className="
                    flex flex-col
                    overflow-y-auto
                    "
                    onScroll={event => setScroll(event.currentTarget.scrollTop)}
                >
                    <ItemsList cols={3} removeAdd >
                        {filteredList.map((item, index) =>
                            <KioskProductItem
                                key={index}
                                data={{ index: index, ...item }}
                                onAdd={
                                    handleAddToCart
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
                            onClick={() => setCartItems([])}
                            customColor="bg-red-600"
                            inversedIcon
                        />
                    </div>
                </div>

                <ItemsList removeAdd >
                    {cartItems.map((item, index) =>
                        <CartItem key={index}
                            data={{ index: index, ...item }}
                            onRemove={(target) => {
                                setCartItems(prev => prev.filter((_, index) => index !== target))
                            }}
                            itemColor={tagList.filter(tag => tag.name === item.category)[0]?.color ?? '#000'}
                        />

                    )}
                </ItemsList>
            </div>

        </section >
    )
}
export default KioskView