var form = document.getElementById("formId");

function submitForm(event) {
    full_name = document.getElementsByName("usr_fullname")[0].value;
    email = document.getElementsByName("usr_email")[0].value;
    pass = document.getElementsByName("usr_pass")[0].value;
    
    if (full_name == 0 || email.length == 0 || pass.length < 8) {
        if(full_name.length == 0){
            document.getElementsByClassName("input_err")[0].style.display = "inline";
        }else{
            document.getElementsByClassName("input_err")[0].style.display = "none";
        }
        if(email.length == 0){
            document.getElementsByClassName("input_err")[1].style.display = "inline";
        }else{
            document.getElementsByClassName("input_err")[1].style.display = "none";
        }
        if(pass.length < 8){
            document.getElementsByName("usr_pass")[0].value = "";
            document.getElementsByClassName("input_err")[2].style.display = "inline";
        }else{
            document.getElementsByClassName("input_err")[2].style.display = "none";
        }
        event.preventDefault();
    }
}

form.addEventListener('submit', submitForm);