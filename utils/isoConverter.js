function convertISO(date) {
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');

    const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}`;

    return formattedDate;
}

module.exports = {
    convertISO
};