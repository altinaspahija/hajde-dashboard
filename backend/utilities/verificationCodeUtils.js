
const tokens = [];

const maxLifespan = 60000 * 15; // 5 Min


function insert(email, token, code) {
    const element = {
        email: email,
        token: token,
        code: code
    };

    tokens[email] = {
        createdAt: Date.now(), 
        email: element.email,
        token: element.token,
        code: element.code
    };

    const t = setTimeout(() => {
        if (tokens[email]) {
            delete tokens[email];
        }
        clearTimeout(t);
    }, maxLifespan);
}

function getItem(email) {
    const item = tokens[email];
    // if (item) {
    //     delete tokens[email];
    // }
    
    return item;
}

module.exports = { insert, getItem };