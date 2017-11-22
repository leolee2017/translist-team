document.getElementById('name').onkeypress = function (e) {
    let event = e || window.event;
    let charCode = event.which || event.keyCode;

    if (charCode == '13') {
        let urlToSend = "http://luffy.ee.ncku.edu.tw:18570/search" + "?Zh_tw=" + document.getElementById("name").value;
        console.log(urlToSend);
        $.get(urlToSend, (data) => {
            let content = JSON.stringify(data[0]['StationAddress']);
            document.getElementById("address").innerHTML = content.replace(/^"|"$/g, '');
            console.log(JSON.stringify(data));
        });
        return false;
    }
}
