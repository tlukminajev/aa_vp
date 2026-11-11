const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const sharp = require('sharp');
const path = require('path');

//@desc home page for uploading photos to gallery
//@route GET /galleryphotoupload
//@access public
const galleryPhotoUpload = (req,res) => {
    res.render('galleryphotoupload')
}



const galleryPhotoUploadPost = async (req,res) => {
    //console.log(req.body)
    //console.log(req.file)
    let conn

    const originalPath = process.env.UPLOAD_ORIGINAL_PATH
    const resizedPath = process.env.UPLOAD_RESIZED_PATH
    const thumbnailPath = process.env.UPLOAD_THUMBNAIL_PATH

    const watermarkPath = './public/pic/vp_logo_small.png'

    try {
        //genereerime oma failinime
        const fileName = 'vp_' + Date.now() + '.jpg'

        const inputFile = path.join(originalPath, fileName)

        await fs.rename(req.file.path, inputFile)

        await sharp(inputFile).resize(800, 500).composite([{input: watermarkPath,gravity: 'southeast'}]).jpeg({quality: 90}).toFile(path.join(resizedPath, fileName))

        await sharp(inputFile).resize(100, 100).jpeg({quality: 90}).toFile(path.join(thumbnailPath, fileName))

        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE
        })
        const sqlReq = 'INSERT INTO galleryphotos (filename, origname, alttext, privacy, userid) VALUES (?,?,?,?,?)'
        //const userId = 1;
        const userId = req.session.userId;
        const [result] = await conn.execute(sqlReq, [fileName, req.file.originalname, req.body.altInput, req.body.privacyInput, userId])
        res.render('galleryphotoupload')
    }
    catch (err) {
        console.log('Viga:' + err)
        res.render('galleryphotoupload')
    }
    finally {
        if(conn) {
            await conn.end();
        }
    }
}

module.exports = {
    galleryPhotoUpload,
    galleryPhotoUploadPost
}
