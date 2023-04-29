function dsc_pretify(desc) {
    var dsc = desc.split("\r\n");
    txt = ""
    dsc.forEach(element => {
        txt += "<p>" + element + "</p>";
    });
    return txt

}

function short_dsc_pretify(desc){
    var dsc = desc.split("\r\n");
    txt = ""
    for (let index = 0; index < 2; index++) {
        if(dsc[index] != undefined){
            txt += "<p>" + dsc[index] + "</p>";
        }
        
    }
    return txt;
}

module.exports =  {dsc_pretify,short_dsc_pretify}