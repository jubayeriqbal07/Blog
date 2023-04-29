function usr_nav_ico_clicked() {
    console.log("clicked");
    document.getElementById("usr_nav_list").classList.toggle("display-none");
}
function hide_usr_nav_list(){
    document.getElementById("usr_nav_list").classList.add("display-none");
}