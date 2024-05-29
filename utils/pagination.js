const paginationUtils = (page, pageSize, totalRow) => {
    page = page || 1;
    pageSize = pageSize || totalRow;

    let totalPage = Math.ceil(totalRow / pageSize)

    if(isNaN(totalPage)){
        totalPage = 0
    }
    
    return {
        current_page: page - 0,
        total_page: totalPage,
        total_data: totalRow,
        page_size: parseInt(pageSize),
        next_page: page + 1 > totalPage ? null : page + 1,
        prev_page: page - 1 < 1 ? null : page - 1
    };
};

module.exports = { paginationUtils }