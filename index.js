const express = require('express');
const dateET = require('./src/dateTimeET');
const fs = require('fs').promises;
const bodyparser = require('body-parser');
const mysql = require('mysql2/promise');
//moodul keskkonnamuutujate lugemiseks
require('dotenv').config();

const textRef = 'public/txt/vanasonad.txt';
const regTextRef = 'public/txt/visits.txt';

//käivitan express() funktsiooni ja tähistan töötava asja nimega "app"
const app = express();
//määrame veebilehe mallide järgi renderdamise mootori (EJS)
app.set('view engine', 'ejs');
//muudan "public" veebiserverile kättesaadavaks
app.use(express.static('public'));
//hakkame päringuid parsima
app.use(bodyparser.urlencoded({extended: false}));

app.get('/', (req, res)=>{
	//res.send('Express.js veeb käivitus!');
	const day = dateET.dayET();
	const date = dateET.dateET(0);
	const time = dateET.timeET();
	res.render('index', {day: day, date: date, time: time});
});

app.get('/vanasona', async (req, res)=>{
	try {
		const data = await fs.readFile(textRef, 'utf8');
		let folkWisdom = data.split(';');
		let wisdom = folkWisdom[Math.round(Math.random() * (folkWisdom.length - 1))];
		res.render('wisdom', {wisdom: wisdom});
	}
	catch (err){
		console.log(err);
		res.render('wisdom', {wisdom: 'Kahjuks ühtegi vanasõna ei leitud!'});
	}
});

app.get('/regvisit', (req, res)=>{
	res.render('regvisit');
});

app.post('/regvisit', async (req, res)=>{
	console.log(req.body);
	try {
		await fs.open(regTextRef, 'a');
		await fs.appendFile(regTextRef, req.body.nameInput + ';');
		res.render('regvisit');
	}
	catch (err) {
		console.log(err);
		res.render('regvisit');
	}	
});

app.get('/visits', async (req, res)=>{
    try{
        const data = await fs.readFile(regTextRef, 'utf8')
        let lines = data.trim().split('\n').filter(line => line.trim() !== '')
        let parts = (lines[lines.length - 1] || '').split(';')
        res.render('visits', {name: parts[0], date: parts[1], time: parts[2], day: parts[3]})
    }
    catch (err){
        console.log(err)
        res.render('visits', {name: '', date: '', time: '', day: ''})
    }
})

app.get('/eestifilm', (req, res)=>{
	res.render('eestifilm');
});

app.get('/eestifilm/film_inimesed', async (req, res)=>{
	let conn;
	try {
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_DATABASE
		});
		//defineerime sql päringu
		let sqlReq = 'SELECT * FROM person';
		//käivitame päringu
		const [sqlRes] = await conn.execute(sqlReq);
		console.log(sqlRes);
		res.render('film_inimesed', {personList: sqlRes});
	}
	catch (err) {
		console.log('Andmebaasiga suhtlemise viga: ' + err);
		res.render('film_inimesed', {personList: []});
	} 
	finally {
		if (conn) {
			await conn.end();
		}
	}
});

app.get('/eestifilm/lisa_film_inimesed', (req, res)=>{
	res.render('lisa_film_inimesed', {notice: 'Ootan sisestust'});
});

app.post('/eestifilm/lisa_film_inimesed', async (req, res)=>{
	console.log(req.body);
	//kontrollime andmeid, teeme kõige lahjema kontrolli
	let deceasedDate = null;
	if(req.body.deceasedInput != '') {
		deceasedDate = req.body.deceasedInput;
	}

	//sünnikuupäeva võrdlemine
	const bornDate = new Date(req.body.bornInput);
	const timeNow = new Date();

	if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || isNaN(bornDate.getTime()) || bornDate > timeNow) {
		console.log('Andmed pole korrektsed!');
		return res.render('lisa_film_inimesed', {notice: 'Sisestatud andmed pole korrektsed!'});
	}
	let conn;
	try {
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_DATABASE
		});
		let sqlReq = 'INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)';
		await conn.execute(sqlReq, [
			req.body.firstNameInput,
			req.body.lastNameInput,
			req.body.bornInput,
			deceasedDate
		]);
		res.render('lisa_film_inimesed', {notice: req.body.firstNameInput + ' ' + req.body.lastNameInput + ' andmebaasi salvestatud.'});
	}
	catch (err) {
		console.log('Andmebaasiga suhtlemise viga');
		res.render('lisa_film_inimesed', {notice: 'Tekksi viga, andmeid ei salvestatud'});
	}
	finally {
		if (conn) {
			await conn.end();
		}
	}
});


app.listen(5316);