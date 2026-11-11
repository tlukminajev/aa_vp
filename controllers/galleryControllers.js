const mysql = require('mysql2/promise')

//@desc Show gallery photos
//@route GET /gallery
//@access private

const gallery = async (req, res) => {
    let conn

    try {
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE
        })

        const sqlReq = 'SELECT id, filename, alttext FROM galleryphotos WHERE privacy >= ? AND deleted IS NULL ORDER BY id DESC'

        const [sqlRes] = await conn.execute(sqlReq, [2])

        res.render('gallery', {photos: sqlRes})
    }
    catch (err) {
        console.log('Andmebaasiga suhtlemise viga: ' + err)
        res.render('gallery', {photos: []})
    }
    finally {
        if (conn) {
            await conn.end()
        }
    }
}

module.exports = {gallery}