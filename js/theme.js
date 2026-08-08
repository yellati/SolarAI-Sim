const themeButton = document.getElementById("themeButton");

const themeIcon = document.getElementById("themeIcon");

themeButton.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    if(document.body.classList.contains("dark-mode")){

        themeIcon.classList.remove("fa-moon");

        themeIcon.classList.add("fa-sun");

    }

    else{

        themeIcon.classList.remove("fa-sun");

        themeIcon.classList.add("fa-moon");

    }

});