const express = require('express');
const request = require('request');
const jsSHA = require('jssha');
const fs = require('fs');

const app = express();


const authorizationHeader = () => {
    let AppID = 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF';
    let AppKey = 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF';

    let GMTString = new Date().toGMTString();
    let ShaObj = new jsSHA('SHA-1', 'TEXT');
    ShaObj.setHMACKey(AppKey, 'TEXT');
    ShaObj.update('x-date: ' + GMTString);
    let HMAC = ShaObj.getHMAC('B64');
    let Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';

    return { 'Authorization': Authorization, 'X-Date': GMTString };
};

let filePath = './data/tra-name-id.txt';
let nameToIDObject = {};

fs.readFile(filePath, 'utf8', (error, data) => {
    if(error){
        console.error('Error: ' + error.message);
    } else{
        nameToIDObject = JSON.parse(data);
    }
});


app.get('/search',(req,res) => {
    res.set({'Access-Control-Allow-Origin': '*'});
    console.log("a request is coming to server.js");
    let Zh_tw = req.query.Zh_tw;
    let id = nameToIDObject[Zh_tw];
    let baseUrl = 'http://ptx.transportdata.tw/MOTC/v2/Rail/TRA/Station';
    let urlToSend = baseUrl + "?$filter=StationID%20eq%20'" + id + "'" + "&format=JSON";

    const options = {
        url : urlToSend,
        method: 'GET',
        headers: authorizationHeader()
    };


    request(options, function(err, response, body) {
        res.json(JSON.parse(body));
    });


});
app.listen(18570, () => {
    console.log('server is running');
});
