import { ClientClass } from "./ClientClass.js";
import { DriverClass } from "./DriverClass.js";
import { TaxiCompanyClass } from "./TaxiCompanyClass.js";


var clientInfo=["First Name","Last Name"];
var driverInfo=["First Name","Last Name","Phone Number"];
var taxiInfo=["Company Name","City","Email","Phone Number"];
document.body.onload
{
    let userTypes=["Client","TaxiCompany","Driver"];


    var root=document.querySelector("#root");

    let container=document.createElement("div");
    container.id="container";
    root.appendChild(container);

    let titleDiv=document.createElement("div");
    titleDiv.className="titleDiv";
    container.appendChild(titleDiv);

    let loginDiv=document.createElement("div");
    loginDiv.className="loginDiv";
    container.appendChild(loginDiv);

    let loginTitle=document.createElement("h1")
    loginTitle.id="loginTitle";
    loginTitle.innerHTML="Login";
    titleDiv.appendChild(loginTitle);

    //Username field
    let userNameDiv=document.createElement("div");
    userNameDiv.id="userNameDiv";
    var userNameInput=document.createElement("input");
    userNameInput.className="inputField";
    userNameInput.id="userName";
    userNameInput.placeholder="Username";
    loginDiv.appendChild(userNameDiv);
    userNameDiv.appendChild(userNameInput);

    //Password field
    let passwordDiv=document.createElement("div");
    passwordDiv.id="passwordDiv";
    var passwordInput=document.createElement("input");
    passwordInput.type="password";
    passwordInput.className="inputField";
    passwordInput.id="password";
    passwordInput.placeholder="Password";
    loginDiv.appendChild(passwordDiv);
    passwordDiv.appendChild(passwordInput);

    //For register fields
    var registerDiv=document.createElement("div");
    registerDiv.id="registerDiv";
    loginDiv.appendChild(registerDiv);

    //Checkboxes
    let checkboxDiv=document.createElement("div");
    checkboxDiv.id="checkboxDiv";
    userTypes.forEach(type=>{
        //Button
        let radioBtn=document.createElement("input");
        radioBtn.setAttribute("type","radio");
        radioBtn.className="radioButton";
        radioBtn.name="clientType";
        radioBtn.value=type;
        radioBtn.checked=true;

        //Label
        let radioLabel=document.createElement("label");
        radioLabel.innerHTML=type;
        radioLabel.setAttribute("for",radioBtn.id);

        checkboxDiv.appendChild(radioBtn);
        checkboxDiv.appendChild(radioLabel);
    });
    loginDiv.appendChild(checkboxDiv);

    //Login and register buttons
    var logButtonDiv=document.createElement("div");
    let registerButtonDiv=document.createElement("div");
    logButtonDiv.id="logBtnDiv";
    logButtonDiv.className="buttonDiv";
    registerButtonDiv.id="regBtnDiv";
    registerButtonDiv.className="buttonDiv";
    loginDiv.appendChild(logButtonDiv);
    loginDiv.appendChild(registerButtonDiv);
    //Login button
    let logButton=document.createElement("button");
    logButton.className="button";
    logButton.innerHTML="Login";
    logButton.addEventListener("click",LoginClick);
    logButtonDiv.appendChild(logButton);
    
    //Register button
    var registerButton=document.createElement("button");
    registerButton.id="regButton";
    registerButton.className="button";
    registerButton.innerHTML="Register";
    registerButtonDiv.appendChild(registerButton);
    registerButton.addEventListener("click",RegisterClick);

}
function LoginClick()
{
    let user=userNameInput.value;
    let password=passwordInput.value;
    let checked=FindCheckedBtn();

    fetch(`https://localhost:5001/${checked}/Login${checked}/${user}/${password}`,{
        headers:{
            "Content-Type": "application/json"
        },
        method:'GET'})
        .then(data=>{
            if(data.ok){
                data.json().then(info=>{
                    console.log(info);
                    ChangeScreen(checked,info);
                });
            }
            else{
                data.json().then(info=>{
                    alert(info);
                });
            }
        }).catch(err=>{
            alert(err);
        });
}
function RegisterClick(){
    logButtonDiv.innerHTML="";

    registerButton.innerHTML="Create Account";
    SetRadioButtonListeners();
    ChangeRegisterParameters();
    registerButton.removeEventListener("click",RegisterClick);
    registerButton.addEventListener("click",CreateAccount);
    
}
function ChangeRegisterParameters(){

    registerDiv.innerHTML="";
    let userType=FindCheckedBtn();
    let chosen;
    if(userType=="Client") chosen=clientInfo;
    else if(userType=="Driver")chosen=driverInfo;
    else chosen=taxiInfo;

    chosen.forEach(p=>{
        let fieldDiv=document.createElement("div");
        userNameDiv.className="fieldDiv";
        let fieldInput=document.createElement("input");
        fieldInput.className="inputField";
        fieldInput.id=p;
        fieldInput.placeholder=p;
        registerDiv.appendChild(fieldDiv);
        fieldDiv.appendChild(fieldInput);
    });
}
function FindCheckedBtn(){
    let radioBtns=document.querySelectorAll(".radioButton");
    let checked;
    radioBtns.forEach(btn=>{
        if(btn.checked){
            checked=btn.value;
        }
    });
    return checked;
}
function SetRadioButtonListeners(){
    let radioBtns=document.querySelectorAll(".radioButton");
    radioBtns.forEach(btn=>{
        btn.addEventListener("click",ChangeRegisterParameters);
    });
}
function CreateAccount(){
    let userType=FindCheckedBtn();
    let account;
    let inputs=document.querySelectorAll(".inputField");
    if(userType=="Client"){
        account={"username": inputs[0].value, "password": inputs[1].value, "firstName": inputs[2].value, "lastName" :inputs[3].value};
    } 
    else if(userType=="Driver"){
        account={"username": inputs[0].value, "password": inputs[1].value, "firstName": inputs[2].value, "lastName" :inputs[3].value, "phoneNumber":inputs[4].value};
    }
    else{
        account={"username": inputs[0].value, "password": inputs[1].value, "companyName": inputs[2].value, "city" :inputs[3].value, "email":inputs[4].value,"phoneNumber":inputs[5].value};
    }
    console.log(account);
    fetch(`https://localhost:5001/${userType}/Add${userType}`,{
        headers:{
            "Content-Type": "application/json"
        },
        method:'POST',
        body: JSON.stringify(account)})
        .then(data=>{
            if(data.ok){
                data.json().then(info=>{
                    console.log(info);
                    ChangeScreen(userType,info);
                });
            }
            else{
                data.json().then(info=>{
                    alert(info);
                });
            }
        }).catch(err=>{
            alert(err);
        });
}

function ChangeScreen(type,info){
    let nextScreen;
    if(type=="Client"){
        nextScreen= new ClientClass(info);
    }
    else if(type=="TaxiCompany"){
        nextScreen= new TaxiCompanyClass(info);
    }
    else{
        nextScreen= new DriverClass(info);
    }
   nextScreen.WelcomeScreen();

}

