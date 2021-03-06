exports.paginationItems = (totalItems, perPage) => {
	return Math.ceil(parseInt(totalItems) / parseInt(perPage));
};
