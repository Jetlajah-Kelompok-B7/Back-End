function moneyFormat(money) {
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    });

    const formattedAmount = formatter.format(money);

    return formattedAmount
}


module.exports = {
    moneyFormat
}