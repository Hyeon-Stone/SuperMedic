const body = document.querySelector('body'),
sidebar = body.querySelector('nav'),
toggle = body.querySelector(".toggle"),
searchBtn = body.querySelector(".search-box"),
modeSwitch = body.querySelector(".toggle-switch"),
modeText = body.querySelector(".mode-text");
imgTogle = body.querySelector(".img_togle");


toggle.addEventListener("click" , () =>{
    sidebar.classList.toggle("close");
})

imgTogle.addEventListener("click" , () =>{
    sidebar.classList.toggle("close");
})

searchBtn.addEventListener("click" , () =>{
    sidebar.classList.remove("close");
    document.getElementById('search').focus();
})

modeSwitch.addEventListener("click" , () =>{
    body.classList.toggle("dark");
    if(body.classList.contains("dark")){
        modeText.innerText = "Dark mode";
        localStorage.setItem("theme", "Dark");
    }else{
        modeText.innerText = "Light mode";
        localStorage.setItem("theme", "Light");
    }
});


const currentTheme = localStorage.getItem("theme");
if (currentTheme == "Dark") {
    body.classList.toggle("dark");
    modeText.innerText = "Dark mode";
}