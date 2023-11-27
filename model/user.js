const db = require('../untils/db')

function login(username,password) {
    return new Promise((resolve, reject) => {
        db.dbConn.query('SELECT * FROM users WHERE username=? AND password=?',[username,password], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function checkApiToken(token) {
    return new Promise((resolve, reject) => {
        db.dbConn.query('SELECT * FROM users WHERE api=?',[token], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function changePassToken(password,token,hash) {
    return new Promise((resolve, reject) => {
        db.dbConn.query('UPDATE users SET password=?,api=? WHERE password=?',[password,token, hash], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
module.exports = {
    login,
    checkApiToken,
    changePassToken
}