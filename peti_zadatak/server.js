const fs = require('fs');
const http = require('http');
const url = require('url');
const querystring = require('query-string');
let artikli = [
    {
        "id": 1,
        "naziv": "Coca-Cola",
        "cena": 100.0,
        "imeKompanije": "Coca-Cola"
    },
    {
        "id": 2,
        "naziv": "Ariel",
        "cena": 250.0,
        "imeKompanije": "Kompanija1"
    },
    {
        "id": 3,
        "naziv": "Sunka",
        "cena": 250.0,
        "imeKompanije": "Carnex"
    }
]

http.createServer(function(req, res) {
    let urlObj = url.parse(req.url, true, false)
    if (req.method == "GET") {
        if (urlObj.pathname == "/svi-artikli") {
            if (urlObj.query.imeKompanije != null) {
                response = sviArtikli(urlObj.query.imeKompanije)
            }
            else {
                response = sviArtikli("")
            }
            
            res.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Svi Artikli</title>
                <style>
                    table, th, td {
                        border: 1px solid black;
                    }
                    th,td {
                        padding: 5px 12px;
                    }
                </style>
            </head>
            <body>
                <h3>Svi Artikli</h3>
                <br>
                <br>
                <div id="prikaz">
                    <table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Naziv</th>
                                <th>Cena</th>
                                <th>Ime kompanije</th>
                            </tr>
                        </thead>               
                        <tbody>
            `)
            for(let a of response){
                res.write(`
                    <tr>
                        <td>${a.id}</td>
                        <td>${a.naziv}</td>
                        <td>${a.cena}</td>
                        <td>${a.imeKompanije}</td>
                    </tr>
                `)
            }
            res.end(`
                            </tbody>
                        </table>
                    </body>
                </html>
            `)
        }
        if (urlObj.pathname == "/dodaj-artikal"){
            res.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Dodaj Artikal</title>
                </head>
                <body>
                    <h3>Dodaj Artikal</h3>
                    <br><br>
                    <form action='/dodaj-artikal' method='POST'>
                        ID: <input type='number' name='id'><br><br>
                        NAZIV: <input type='text' name='naziv'><br><br>
                        CENA: <input type='number' name='cena'><br><br>
                        IME KOMPANIJE: <input type='text' name='imeKompanije'><br><br>
                        <button type='submit'>DODAJ Artikal</button>
                    </form>
                </body>
                </html>
            `);
        }
    }
    else if(req.method == "POST") {
        if (urlObj.pathname == "/dodaj-artikal"){
            var body = '';
                req.on('data', function (data) {
                body += data;
            });
            req.on('end', function () {
                dodajArtikal(querystring.parse(body).id,querystring.parse(body).naziv,
                           querystring.parse(body).cena,querystring.parse(body).imeKompanije);
                res.writeHead(302, {
                    'Location': '/svi-artikli'
                });
                res.end();
            });
        }
    }
}).listen(4000);

function sviArtikli(imeKompanije) {
    let response = []
    if (imeKompanije != "") {
        for (let a of artikli) {
            if (a.imeKompanije == imeKompanije) {
                response.push(a)
            }
        }
    }
    else {
        response = artikli
    }

    return response
}

function dodajArtikal(id, naziv, cena, imeKompanije) {
    artikal = {
        "id":id,
        "naziv": naziv,
        "cena": cena,
        "imeKompanije": imeKompanije
    }
    artikli.push(artikal)
}