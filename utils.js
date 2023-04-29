function dsc_pretify(desc) {
    var dsc = desc.split("\r\n");
    txt = ""
    dsc.forEach(element => {
        txt += "<p>" + element + "</p>";
    });
    return txt

}

module.exports =  {dsc_pretify}