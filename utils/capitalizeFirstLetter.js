function capitalizeFirstLetter(string) {
	if (string === undefined) {
		return undefined;
	}
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

module.exports = capitalizeFirstLetter;
