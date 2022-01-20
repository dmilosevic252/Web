export class ClientClass{
    constructor(client){
        this.client=client;
    }

    WelcomeScreen(){

        var root=document.querySelector("#root");
        root.innerHTML="";

        let backgroundDiv=document.createElement("div");
        backgroundDiv.id="backgroundDiv";
        root.appendChild(backgroundDiv);

        root.style.height="auto";
        document.body.style.backgroundImage="linear-gradient(to bottom,#ECECEC, #D2D2D2)";

        let title=document.createElement("h1");
        title.id="clientName";
        title.innerHTML=this.client.firstName+" "+this.client.lastName;
        backgroundDiv.appendChild(title);

        let buttonDiv=document.createElement("div");
        buttonDiv.id="buttonDiv";
        backgroundDiv.appendChild(buttonDiv);

        let orderButton=document.createElement("button");
        orderButton.id="order";
        orderButton.className="button";
        orderButton.innerHTML="Order";
        let orderListener=(event)=>this.Order(this.client.userName);
        orderButton.addEventListener("click",orderListener,false)
        buttonDiv.appendChild(orderButton);

        let deleteButton=document.createElement("button");
        deleteButton.id="delete";
        deleteButton.className="button";
        deleteButton.innerHTML="Delete Account";
        buttonDiv.appendChild(deleteButton);
        
        console.log(this.client.userName);
        let deleteListener=(event)=>this.DeleteAccount(this.client.userName);
        deleteButton.addEventListener("click",deleteListener,false);

        let cityDiv=document.createElement("div");
        cityDiv.id="cityDiv";
        backgroundDiv.appendChild(cityDiv);

        //Select city
        var citySelect=document.createElement("select");
        citySelect.id="citySelect";
        citySelect.name="cities";
        citySelect.addEventListener("change",this.ChangedCity);
        this.GetCities();
        let cityTitle=document.createElement("label");
        cityTitle.className="formLabel";
        cityTitle.innerHTML="City";
        cityTitle.setAttribute("for","cities");
        cityDiv.appendChild(cityTitle);
        cityDiv.appendChild(citySelect);
        

        //Select taxi company
        var taxiDiv=document.createElement("div");
        taxiDiv.id="taxiDiv";
        backgroundDiv.appendChild(taxiDiv);

        //Select vehicle
        var vehicleDiv=document.createElement("div");
        vehicleDiv.id="vehicleDiv";
        backgroundDiv.appendChild(vehicleDiv);

        var finalInfoDiv= document.createElement("div");
        finalInfoDiv.id="finalInfoDiv";
        backgroundDiv.appendChild(finalInfoDiv);




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

    ChangedCity(){
        
        taxiDiv.innerHTML="";
        vehicleDiv.innerHTML="";
        finalInfoDiv.innerHTML="";
        
        var taxiSelect=document.createElement("select");
        taxiSelect.id="taxiSelect";
        taxiSelect.name="taxi";
        let listener=(event)=>ClientClass.prototype.ChangedTaxi();
        taxiSelect.addEventListener("change",listener,false);
        
        let taxiTitle=document.createElement("label");
        taxiTitle.className="formLabel";
        taxiTitle.innerHTML="TaxiCompany";
        taxiTitle.setAttribute("for","taxi");
        let city=citySelect.value;
        fetch(`https://localhost:5001/TaxiCompany/GetTaxiCompanies/${city}`,{
            headers:{
                "Content-Type": "application/json"
            },
            method:'GET'})
            .then(data=>{
                if(data.ok){
                    data.json().then(info=>{
                        ClientClass.prototype.SetDropDown(taxiSelect,info);
                        
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

        taxiDiv.appendChild(taxiTitle);
        taxiDiv.appendChild(taxiSelect);  
        
    }

    SetDropDown(select,info){
        if(info!=null){
            let placeholder=document.createElement("option");
            placeholder.innerHTML="Select option";
            placeholder.selected=true;
            placeholder.disabled=true;
            
            select.appendChild(placeholder);
            for (const key of Object.keys(info)) {
                let option=document.createElement("option");
                let k;
                if(info[key].city!=undefined) k=info[key].city;
                else if(info[key].companyName!=undefined) k=info[key].companyName;
                else k=info[key].vehicleName;
                option.innerHTML=k;
                select.appendChild(option);
            }
        }
        
    }
    GetCities(){
        fetch(`https://localhost:5001/TaxiCompany/GetCities`,{
        headers:{
            "Content-Type": "application/json"
        },
        method:'GET'})
        .then(data=>{
            if(data.ok){
                data.json().then(info=>{
                    this.SetDropDown(citySelect,info);
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
    //city->taxi
    //taxi->vehicle
    ChangedTaxi(){;
    
        vehicleDiv.innerHTML="";
        finalInfoDiv.innerHTML="";
        var vehicleSelect=document.createElement("select");
        vehicleSelect.id="vehicleSelect";
        vehicleSelect.name="vehicle";
        
        let listener=(event)=>ClientClass.prototype.ChangedVehicle();
        vehicleSelect.addEventListener("change",listener,false);

        let vehicleTitle=document.createElement("label");
        vehicleTitle.className="formLabel";
        vehicleTitle.innerHTML="Vehicle";
        vehicleTitle.setAttribute("for","vehicle");
        let taxi=taxiSelect.value;
        let city=citySelect.value;
        fetch(`https://localhost:5001/Vehicle/GetVehiclesInCompany/${city}/${taxi}`,{
            headers:{
                "Content-Type": "application/json"
            },
            method:'GET'})
            .then(data=>{
                if(data.ok){
                    data.json().then(info=>{
                        ClientClass.prototype.SetDropDown(vehicleSelect,info);
                        
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

        vehicleDiv.appendChild(vehicleTitle);
        vehicleDiv.appendChild(vehicleSelect);  
    }
    ChangedVehicle(){
        finalInfoDiv.innerHTML="";
        var startAdd=document.createElement("input");
        startAdd.id="startaddress";
        startAdd.className="inputField";
        startAdd.placeholder="Start Address";
        finalInfoDiv.appendChild(startAdd);

        var endAdd=document.createElement("input");
        endAdd.id="endaddress";
        endAdd.className="inputField";
        endAdd.placeholder="End Address";
        finalInfoDiv.appendChild(endAdd);

        
    }
    Order(clientUserName){
        let city=citySelect.value;
        let taxiCompany=taxiSelect.value;
        let vehicleName=vehicleSelect.value;


        let startAddress=document.querySelector("#startaddress").value;
        let endAddress=document.querySelector("#endaddress").value;
        let time=new Date();
        time.toJSON();

        let order= {"startAddress":startAddress,"endAddress":endAddress};

        fetch(`https://localhost:5001/Orders/AddOrder/${clientUserName}/${vehicleName}/${taxiCompany}/${city}`,{
            headers:{
                "Content-Type": "application/json"
            },
            method:'POST',
            body: JSON.stringify(order)})
            .then(data=>{
                if(data.ok){
                    data.json().then(info=>{
                        alert("Taxi ordered!")
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
    ShowPas

 
}