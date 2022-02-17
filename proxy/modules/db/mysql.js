const waitPort = require('wait-port');
const fs = require('fs');
const mysql = require('mysql2');
const {
    MYSQL_HOST: HOST,
    MYSQL_HOST_FILE: HOST_FILE,
    MYSQL_USER: USER,
    MYSQL_USER_FILE: USER_FILE,
    MYSQL_PASSWORD: PASSWORD,
    MYSQL_PASSWORD_FILE: PASSWORD_FILE,
    MYSQL_DB: DB,
    MYSQL_DB_FILE: DB_FILE,
} = process.env;

let pool;

async function init() {
    const host = HOST_FILE ? fs.readFileSync(HOST_FILE) : HOST;
    const user = USER_FILE ? fs.readFileSync(USER_FILE) : USER;
    const password = PASSWORD_FILE ? fs.readFileSync(PASSWORD_FILE) : PASSWORD;
    const database = DB_FILE ? fs.readFileSync(DB_FILE) : DB;
    console.log(database, 'БАЗА');
    await waitPort({ host, port: 3306 });
    pool = mysql.createPool({
        connectionLimit: 5,
        host,
        user,
        password,
        database,
        charset: 'utf8_general_ci'
    });
    return new Promise((acc, rej) => {
        pool.query(
            'CREATE TABLE IF NOT EXISTS tables (id INT AUTO_INCREMENT PRIMARY KEY, name varchar(255) CHARSET utf8mb4, delivery varchar(255) CHARSET utf8mb4, phone varchar(255) CHARSET utf8mb4)',
            err => {
                if (err) return rej(err);

                console.log(`Connected to mysql db at host ${HOST}`);
                acc();
            },
        );
    });
}
async function teardown() {
    return new Promise((acc, rej) => {
        pool.end(err => {
            if (err) rej(err);
            else acc();
        });
    });
}

async function getItems() {
    return new Promise((acc, rej) => {
        pool.query('SELECT * FROM tables', (err, rows) => {
            if (err) return rej(err);
            acc(
                rows.map(item =>
                    Object.assign({}, item, {
                        completed: item.completed === 1,
                    }),
                ),
            );
        });
    });
}

async function getItem(id) {
    return new Promise((acc, rej) => {
        pool.query('SELECT * FROM tables WHERE id=?', [id], (err, rows) => {
            if (err) return rej(err);
            acc(
                rows.map(item =>
                    Object.assign({}, item, {
                        completed: item.completed === 1,
                    }),
                )[0],
            );
        });
    });
}

async function storeItem(item) {
    return new Promise((acc, rej) => {
        pool.query(
            'INSERT INTO tables (name, delivery, phone) VALUES (?, ?, ?)', [item.name, item.delivery, item.phone],
            (err, result) => {
                if (err) return rej(err);
                acc(result.insertId);
            },
        );
    });
}

async function updateItem(item) {
    return new Promise((acc, rej) => {
        pool.query(
            'UPDATE tables SET name=?, delivery=?, phone=? WHERE id=?', [item.name, item.delivery, item.phone, item.id],
            (err) => {
                if (err) return rej(err);
                acc(true);
            },
        );
    });
}

async function removeItem(id) {
    return new Promise((acc, rej) => {
        pool.query('DELETE FROM tables WHERE id = ?', [id], err => {
            if (err) return rej(err);
            acc();
        });
    });
}

module.exports = {
    init,
    teardown,
    getItems,
    getItem,
    storeItem,
    updateItem,
    removeItem,
};