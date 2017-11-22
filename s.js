const express = require('express');
const request = require('request');
const jsSHA = require('jssha');
const fs = require('fs');

const app = express();


app.use(express.static(__dirname + '/public'))

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

let stationObj = {};
fs.readFile('./data/tra-position.txt', 'utf8', (error, data) => {
    if(error){
        console.error("Error: " + error.message);
    }else{
        stationObj = JSON.parse(data);
    }
});

app.get('/gg',(req,res) => {
    res.set({'Access-Control-Allow-Origin': '*'});
    let ttt = req.query.sss;
    let tt = encodeURIComponent(ttt);

    let telat = 23;
    let telon = 120;


    let u = "https://maps.googleapis.com/maps/api/geocode/json?address="+tt+"&key=AIzaSyBKaBDLWHYDtoqbIFFdwViEcXfCDW1YVkY";
    let uu = "http://ptx.transportdata.tw/MOTC/v2/Rail/TRA/Station?$format=JSON";

    const optionss = {
        url : u,
        method: 'GET',
    };
    const options = {
        url : uu,
        method: 'GET',
        headers: authorizationHeader()
    };

    request(optionss, function(err, response, body) {
        let locationObj = JSON.parse(body);
        telat = locationObj.results[0].geometry.location.lat;
        telon = locationObj.results[0].geometry.location.lng;
        let des = function(a){
            return Math.pow((stationObj[a].StationPosition.PositionLat-telat),2)+Math.pow((stationObj[a].StationPosition.PositionLon-telon),2);
        };
        let sdes = new Array(3);
        for(i=0; i < 3; i++)
        {
            sdes[i] = new Array(2);
        }
        let qwe = 0;
        let qwer = 0;
        if (des(0) < des(1))
        {
            sdes[0][0] = des(0);
            sdes[0][1] = des(1);
            sdes[1][0] = stationObj[0].StationPosition.PositionLat;
            sdes[1][1] = stationObj[1].StationPosition.PositionLat;
            sdes[2][0] = stationObj[0].StationPosition.PositionLon;
            sdes[2][1] = stationObj[1].StationPosition.PositionLon;
            qwe = 0;
            qwer = 1;
        }
        else{
            sdes[0][0] = des(1);
            sdes[0][1] = des(0);
            sdes[1][0] = stationObj[1].StationPosition.PositionLat;
            sdes[1][1] = stationObj[0].StationPosition.PositionLat;
            sdes[2][0] = stationObj[1].StationPosition.PositionLon;
            sdes[2][1] = stationObj[0].StationPosition.PositionLon;
            qwe = 1;
            qwer = 0;
        }
        let stationNumber = Object.keys(stationObj).length;
        for (i=2;i< stationNumber;i++)
        {
            if(des(i) < sdes[0][1])
            {
                if(des(i) < sdes[0][0])
                {
                    sdes[0][1] = sdes[0][0];
                    sdes[0][0] = des(i);
                    sdes[1][1] = sdes[1][0];
                    sdes[1][0] = stationObj[i].StationPosition.PositionLat;
                    sdes[2][1] = sdes[2][0];
                    sdes[2][0] = stationObj[i].StationPosition.PositionLon;
                    qwer = qwe;
                    qwe = i;
                }
                else
                {
                    sdes[1][1] = stationObj[i].StationPosition.PositionLat;
                    sdes[2][1] = stationObj[i].StationPosition.PositionLon;
                    sdes[0][1] = des(i);
                    qwer = i;
                }
            }
        }
        let tr = encodeURIComponent(stationObj[qwe].StationAddress);
        let tr2 = encodeURIComponent(stationObj[qwer].StationAddress);
        let reob = new Object();
        reob.n1 = stationObj[qwe].StationName.Zh_tw;
        reob.n2 = stationObj[qwer].StationName.Zh_tw;
        let tyy = "最近兩個車站:"+stationObj[qwer].StationName.Zh_tw+"站   所需時間:";
        const optionsss = {
            url :"https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins="+tt+"&destinations="+tr+"&key=AIzaSyBKaBDLWHYDtoqbIFFdwViEcXfCDW1YVkY",
            method: 'GET',
        };
        request(optionsss, function(err, response, body) {
            let shortestObj1 = JSON.parse(body);
            reob.n3 = shortestObj1.rows[0].elements[0].duration.text;
            const optionssss = {
                url :"https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins="+tt+"&destinations="+tr2+"&key=AIzaSyBKaBDLWHYDtoqbIFFdwViEcXfCDW1YVkY",
                method: 'GET',
            };
            request(optionssss, function(err, response, body) {
                let shortestObj2 = JSON.parse(body);
                reob.n4 = shortestObj2.rows[0].elements[0].duration.text;
                res.json(reob);
            });
        });
    });
});


app.listen(8570, () => {
    console.log('server s is running');
});

