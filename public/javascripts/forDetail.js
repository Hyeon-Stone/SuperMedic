import {getIdxedDBValue, clearIdxedDBValue, getIdxedDBValues} from "./indexDB.js";
function optional(){return}
function addElement(key, selector, func = optional){
    let element;
    getIdxedDBValue(key).then(res => {
        element = res['content'];
        document.querySelector(selector).innerHTML = element;
        func(element);
    });
}
function changeGender(el){
    if (el == '남')
        document.querySelector('.patient_gender').className += '_male'
}
window.onload = function(){
    addElement('name','.patient_name');
    addElement('gender','.patient_gender',changeGender);
    addElement('age','.patient_age');
    addElement('blood_type','.patient_blood_type');
    addElement('allergy','.patient_allergy');
}
window.addEventListener("unload", function (event) {
    clearIdxedDBValue();
});
/**
 * for NAV
 */
const body = document.querySelector('body'),
modeSwitch = body.querySelector(".toggle-switch"),
modeText = body.querySelector(".mode-text");
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