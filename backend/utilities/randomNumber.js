const { v1: uuidv1, v4: uuidv4 } = require('uuid');

function generate_random(from, to) {
    return Math.floor(Math.random() * to) + from;
}

function generate_random_uuid() {
    return uuidv4().replace(/-/g, "");
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

module.exports = {
    generate_random,
    generate_random_uuid,
    randomIntFromInterval
};