function getStartOfDay(date) {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
        return null;
    }
    d.setUTCHours(0, 0, 0, 0);
    return d;
}

function getEndOfDay(date) {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
        return null;
    }
    d.setUTCHours(23, 59, 59, 999);
    return d;
}

module.exports = {
    getStartOfDay,
    getEndOfDay
};
