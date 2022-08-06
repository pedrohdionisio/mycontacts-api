function capitalizeString(string) {
  return string
    .trim()
    .toLowerCase()
    .replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
}

module.exports = capitalizeString;