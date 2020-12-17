module.exports = async function (con, player) {
  return new Promise(function(resolve, reject) {
    con.query(`SELECT * FROM data WHERE userid = ?`, [player], function(err, data) {
      if (!data[0]) return resolve(false)
        resolve({data:data[0]})
    })
  });
};
