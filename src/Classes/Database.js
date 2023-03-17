const mysql = require('mysql');
const { DB_HOST, DB_USER, DB_NAME, DB_PASS } = process.env;

class Connection {
	constructor() {
		this.connection = mysql.createConnection({
            multipleStatements: true,
            encoding: 'utf8',
            charset: 'utf8mb4',
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASS,
            database: DB_NAME
		});
		this.connection.on('error', console.error);
		this.escape = this.connection.escape.bind(this.connection);
	}

	query(query) {
		return new Promise((resolve, reject) => {
			this.connection.query(query, (err, result) => {
				if (err) return reject(err);
				return resolve(result.length === 1 ? result[0] : result);
			});
		});
	}

}

module.exports = Connection;