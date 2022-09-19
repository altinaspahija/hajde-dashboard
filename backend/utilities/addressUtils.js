
module.exports = function convertToOrQuery(data, obj, name) {
    if (typeof data === "string") {
        return data;
    } else if (Array.isArray(data)) {
        return { "$in": data };
    }

    throw new Error("Unknown object", data);
};