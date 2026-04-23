/**
 * 
 * @param {Array} data 
 * @returns {Object}
 */
export function registerSell(data) {
    const newTicket = {
        "type": 'Venta',

        "products": [],
        "productsAmount": 0,

        "total": {
            "CUP": 0,
            "USD": 0
        },

        "date": new Date().toDateString(),
    }

    data.forEach(item => {
        newTicket.productsAmount += item.cart
        newTicket.products.push({
            "name": item.name,
            "price": item.price,
            "amount": item.cart
        })

        newTicket.total[item.currency] = item.price * item.cart
    });

    return newTicket
}

/**
 * 
 * @param {Object} product 
 * @param {Number} amount 
 * @returns {Object}
 */
export function registerRefund(product, amount) {
    const newTicket = {
        "type": 'Devolución',
        "product": product.name,
        "total": {
            "CUP": 0,
            "USD": 0
        },
        "date": new Date().toDateString(),
    }
    newTicket.total[product.currency] = product.price * amount

    return newTicket
}