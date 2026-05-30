/**
 * 
 * @param {Array} data 
 * @property {Object} newTicket
 * @returns {Object}
 */
export function registerSell(data) {
    const newTicket = {
        "type": 'Venta',

        "products": [],
        "productsAmount": 0,

        "total": {
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

        if (!newTicket.total[item.currency])
            newTicket.total[item.currency] = 0

        newTicket.total[item.currency] += parseInt(item.price) * parseInt(item.cart)
    });

    return newTicket
}

/**
 * 
 * @param {Object} product 
 * @param {Number} amount 
 * @property {Object} newTicket
 * @returns {Object}
 */
export function registerRefund(product, amount) {
    const newTicket = {
        "type": 'Devolución',
        "product": product.name,
        "total": {},
        "date": new Date().toDateString(),
    }

    newTicket.total[product.currency] = product.price * amount

    return newTicket
}