export class TaxiCompanyClass{
    
    constructor(taxiCompany){
        this.taxiCompany=taxiCompany;
    }
    
    WelcomeScreen(){
        var root=document.querySelector("#root");
        root.innerHTML="";
        root.style.height="auto";
        document.body.style.backgroundImage="linear-gradient(to bottom,#ECECEC, #D2D2D2)";

        let backgroundDiv=document.createElement("div");
        backgroundDiv.id="backgroundDiv";
        root.appendChild(backgroundDiv);

        let title=document.createElement("h1");
        title.className="clientName";
        title.innerHTML=this.taxiCompany.companyName;
        backgroundDiv.appendChild(title);

        let buttonDiv=document.createElement("div");
        buttonDiv.id="buttonDiv";
        backgroundDiv.appendChild(buttonDiv);

        //Show vehicles
        let showVehiclesButton=document.createElement("button");
        showVehiclesButton.id="showState";
        showVehiclesButton.className="button";
        showVehiclesButton.innerHTML="Show vehicles";
        buttonDiv.appendChild(showVehiclesButton);

        


        //Delete account
        let deleteButton=document.createElement("button");
        deleteButton.id="delete";
        deleteButton.className="button";
        deleteButton.innerHTML="Delete Account";
        buttonDiv.appendChild(deleteButton);
        let deleteListener=(event)=>this.DeleteAccount(this.taxiCompany.userName);
        deleteButton.addEventListener("click",deleteListener,false);

        //Add driver
        let addDriverButton=document.createElement("button");
        addDriverButton.id="addDriver";
        addDriverButton.className="button";
        addDriverButton.innerHTML="Add Driver";
        buttonDiv.appendChild(addDriverButton);
        
       



        //Add vehicle

        let addVehicleButton=document.createElement("button");
        addVehicleButton.id="addVehicle";
        addVehicleButton.className="button";
        addVehicleButton.innerHTML="Add Vehicle";
        buttonDiv.appendChild(addVehicleButton);
        

        //Give vehicle to driver
        let connectButton=document.createElement("button");
        connectButton.id="driverVehicle";
        connectButton.className="button";
        connectButton.innerHTML="Give vehicle to a driver";
        buttonDiv.appendChild(connectButton);


        var formDiv=document.createElement("div");
        formDiv.id="formDiv";
        backgroundDiv.appendChild(formDiv);

        let driverListener=(event)=>this.OpenDriverForm(formDiv);
        let vehicleListener=(event)=>this.OpenVehicleForm(formDiv);
        let connectListener=(event)=>this.OpenConnectForm(formDiv,this.taxiCompany.userName);
        let showListener=(event)=>this.GetVehicles(true,formDiv,this.taxiCompany.userName);
        addDriverButton.addEventListener("click",driverListener,false);
        addVehicleButton.addEventListener("click",vehicleListener,false);
        connectButton.addEventListener("click",connectListener,false);
        showVehiclesButton.addEventListener("click",showListener,false);
    }

    DeleteAccount(username)
    {
         fetch(`https://localhost:5001/Client/DeleteClient/${username}`,{
            headers:{
                'Access-Token': 'token'
            },
            method:'DELETE'})
            .then(data=>{
                if(data.ok){
                    //Promeni
                    root.innerHTML="";
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
    GetDrivers(driverSelect,username){
        fetch(`https://localhost:5001/TaxiCompany/GetDrivers/${username}`,{
            headers:{
                "Content-Type": "application/json"
            },
            method:'GET'})
            .then(data=>{
                if(data.ok){
                    data.json().then(info=>{
                        this.SetDropDown("Driver",driverSelect,info);
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
    GetVehicles(draw,presentationElement,username){
        fetch(`https://localhost:5001/TaxiCompany/GetVehicles/${username}`,{
            headers:{
                "Content-Type": "application/json"
            },
            method:'GET'})
            .then(data=>{
                if(data.ok){
                    data.json().then(info=>{
                        if(!draw) this.SetDropDown("Vehicle",presentationElement,info);
                        else this.DrawVehicles(presentationElement,info);
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

    SetDropDown(type,select,info){
        if(info!=null){
            let placeholder=document.createElement("option");
            placeholder.innerHTML="Select option";
            placeholder.selected=true;
            placeholder.disabled=true;
            select.appendChild(placeholder);
            if(type=="Driver"){
                var driversList=info[0];
                for(var entry in driversList){
                    var drivers=driversList[entry];
                    for(var j=0;j<drivers.length;j++){
                        let option=document.createElement("option");
                        option.innerHTML=drivers[j].firstName+" "+drivers[j].lastName+" ("+drivers[j].userName+")";
                        option.value=drivers[j].userName;
                        select.appendChild(option);
                    }
                }
            }
            else{
                for (const key of Object.keys(info)) {
                    let option=document.createElement("option");
                    option.innerHTML=info[key].vehicleName+" "+info[key].vehicleNumber;
                    option.value=info[key].vehicleName+" "+info[key].vehicleNumber;
                    select.appendChild(option);
                }
            }   
        }
    }
    AddVehicle(event,vehicleName,vehicleNumber){
        console.log(vehicleName+" "+vehicleNumber);
        let vehicle={"vehicleNumber":vehicleNumber,"vehicleName":vehicleName};
        fetch(`https://localhost:5001/TaxiCompany/AddVehicle/${this.taxiCompany.userName}`,{
            headers:{
                "Content-Type": "application/json"
            },
            method:'POST',
            body: JSON.stringify(vehicle)})
            .then(data=>{
                if(data.ok){
                    data.json().then(info=>{
                        alert(info);
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
    AddDriver(event,driverUserName){
        console.log(driverUserName);
        fetch(`https://localhost:5001/TaxiCompany/AddDriver/${this.taxiCompany.userName}/${driverUserName}`,{
            headers:{
                "Content-Type": "application/json"
            },
            method:'PUT'})
            .then(data=>{
                data.json().then(info=>{
                        alert(info.message);
                    });
            }).catch(err=>{
                alert(err);
            });
    }
    GiveDriverVehicle(driverUserName,vehicleName){
        let companyUserName=this.taxiCompany.userName;
        var vehicleInfo=vehicleName.split(' ');
        fetch(`https://localhost:5001/TaxiCompany/GiveDriverVehicle/${companyUserName}/${driverUserName}/${vehicleInfo[0]}/${vehicleInfo[1]}`,{
            headers:{
                "Content-Type": "application/json"
            },
            method:'PUT'})
            .then(data=>{
                if(data.ok){
                    data.json().then(info=>{
                        alert(info.message);
                    });
                   
                }
                else{
                    data.json().then(info=>{
                        alert(info.message);
                    });
                }
            }).catch(err=>{
                alert(err);
            });

    }
    DrawVehicles(formDiv,info){
        formDiv.innerHTML="";

        let vehicleStateDiv=document.createElement("div");
        vehicleStateDiv.className="vehiclesState";
        for (const key of Object.keys(info)) {
            var vehicleActive=false;
            var vehicleColor=3;
            let vehicle=document.createElement("div");

            let vehicleLabel=document.createElement("h3");
            vehicleLabel.innerHTML=info[key].vehicleName+" "+info[key].vehicleNumber;
            vehicle.appendChild(vehicleLabel);

            let driversUl=document.createElement("ul");
            vehicle.appendChild(driversUl);

            var driversList=info[key].driver;
            console.log(driversList);
            for(var i=0;i<driversList.length;i++){
                let option=document.createElement("li");
                option.innerHTML=driversList[i].firstName+" "+driversList[i].lastName+" ("+driversList[i].userName+")";
                if(driversList[i].driverState<vehicleColor){
                    vehicleColor=driversList[i].driverState;
                }
                if(driversList[i].driverState!=2){
                    option.className="activeDriver";
                }
                else{
                    option.className="inactiveDriver";
                }
                driversUl.appendChild(option);
            }
            vehicle.classList.add("V"+vehicleColor,"VehicleStateDiv");
            vehicleStateDiv.appendChild(vehicle);
        }
        formDiv.appendChild(vehicleStateDiv);
    }
    

    OpenDriverForm(formDiv){
        formDiv.innerHTML="";
        
        var driverInput=document.createElement("input");
        driverInput.className="inputField";
        driverInput.placeholder="Enter user name";
        formDiv.appendChild(driverInput);
        
        let confirmButton=document.createElement("button");
        confirmButton.className="button";
        confirmButton.innerHTML="Confirm";
        confirmButton.addEventListener("click",e=>this.AddDriver(e,driverInput.value));
        formDiv.appendChild(confirmButton);
    }
    OpenVehicleForm(formDiv){
        formDiv.innerHTML="";
        
        let vehicleNameInput=document.createElement("input");
        vehicleNameInput.className="inputField";
        vehicleNameInput.placeholder="Vehicle Name";
        formDiv.appendChild(vehicleNameInput);

        let vehicleNumberInput=document.createElement("input");
        vehicleNumberInput.className="inputField";
        vehicleNumberInput.placeholder="Vehicle Number";
        formDiv.appendChild(vehicleNumberInput);

        let confirmButton=document.createElement("button");
        confirmButton.className="button";
        confirmButton.innerHTML="Confirm";
        confirmButton.addEventListener("click",e=>this.AddVehicle(e,vehicleNameInput.value,vehicleNumberInput.value));
        formDiv.appendChild(confirmButton);

        
       
    }
    OpenConnectForm(formDiv,username){
        formDiv.innerHTML="";

        let placeholder=document.createElement("option");
        placeholder.innerHTML="Select option";
        placeholder.selected=true;
        placeholder.disabled=true;

        let driverSelect=document.createElement("select");
        let driverLabel=document.createElement("label");
        driverSelect.name="driverSelect";
        driverLabel.setAttribute("for","driverSelect");
        driverLabel.className="formLabel";
        driverLabel.innerHTML="Driver";
        formDiv.appendChild(driverLabel);
        formDiv.appendChild(driverSelect);
        driverSelect.appendChild(placeholder);

        let vehicleSelect=document.createElement("select");
        let vehicleLabel=document.createElement("label");
        vehicleSelect.name="vehicleSelect";
        vehicleLabel.setAttribute("for","driverSelect");
        vehicleLabel.innerHTML="Vehicle";
        vehicleLabel.className="formLabel";
        formDiv.appendChild(vehicleLabel);
        formDiv.appendChild(vehicleSelect);
        driverSelect.appendChild(placeholder);
        
        let confirmButton=document.createElement("button");
        confirmButton.className="button";
        confirmButton.innerHTML="Confirm";
        confirmButton.addEventListener("click",e=>this.GiveDriverVehicle(driverSelect.value,vehicleSelect.value));
        formDiv.appendChild(confirmButton);
        
        TaxiCompanyClass.prototype.GetDrivers(driverSelect,username);
        TaxiCompanyClass.prototype.GetVehicles(false,vehicleSelect,username);
    }
 
}