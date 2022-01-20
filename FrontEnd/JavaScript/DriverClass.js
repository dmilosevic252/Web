export class DriverClass{
    constructor(driver){
        this.driver=driver;
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
        title.className="clientName";
        title.innerHTML=this.driver.firstName+" "+this.driver.lastName;
        backgroundDiv.appendChild(title);

        let buttonDiv=document.createElement("div");
        buttonDiv.id="drivercommands";
        backgroundDiv.appendChild(buttonDiv);

        let orderDiv=document.createElement("div");
        orderDiv.id="orderDiv";
        backgroundDiv.appendChild(orderDiv);

        //Arrived
        let arrivedButton=document.createElement("button");
        arrivedButton.id="arrived";
        arrivedButton.className="button";
        arrivedButton.innerHTML="Arrived to destination";
        let arriveListener=(event)=>this.Arrive(this.driver.userName);
        arrivedButton.addEventListener("click",arriveListener,false);
        buttonDiv.appendChild(arrivedButton);


        //Delete account
        let deleteButton=document.createElement("button");
        deleteButton.id="delete";
        deleteButton.className="button";
        deleteButton.innerHTML="Delete Account";
        buttonDiv.appendChild(deleteButton);
        let deleteListener=(event)=>this.DeleteAccount(this.driver.userName);
        deleteButton.addEventListener("click",deleteListener,false);

        //Pause/End shift
        let pauseEndButton=document.createElement("button");
        pauseEndButton.id="pauseEnd";
        pauseEndButton.className="button";
        pauseEndButton.innerHTML="Pause/End shift";
        buttonDiv.appendChild(pauseEndButton);
        let endPauseListener=(event)=>this.PauseEndShift(this.driver.userName);
        pauseEndButton.addEventListener("click",endPauseListener,false);

        //Start shift
        let startButton=document.createElement("button");
        startButton.id="startShift";
        startButton.className="button";
        startButton.innerHTML="Start shift";
        buttonDiv.appendChild(startButton);
        let startShiftListener=(event)=>this.StartShift(this.driver.userName);
        startButton.addEventListener("click",startShiftListener,false);



        //Show current order

        let currentOrder=document.createElement("button");
        currentOrder.id="currentOrder";
        currentOrder.className="button";
        currentOrder.innerHTML="Get Current Order";
        buttonDiv.appendChild(currentOrder);
        let addOrderListener=(event)=>this.GetCurrentOrder(this.driver.userName,orderDiv);
        currentOrder.addEventListener("click",addOrderListener,false);

        

    }

    DeleteAccount(username)
    {
         fetch(`https://localhost:5001/Driver/DeleteDriver/${username}`,{
            headers:{
                'Access-Token': 'token'
            },
            method:'DELETE'})
            .then(data=>{
                if(data.ok){
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
    
    PauseEndShift(username){
        fetch(`https://localhost:5001/Driver/ChangeDriverState/${username}/2`,{
            headers:{
                'Access-Token': 'token'
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
    StartShift(username){
        fetch(`https://localhost:5001/Driver/ChangeDriverState/${username}/0`,{
            headers:{
                'Access-Token': 'token'
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
    Arrive(username){

        fetch(`https://localhost:5001/Driver/Arrive/${username}`,{
            headers:{
                'Access-Token': 'token'
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

    ShowCurrentOrder(info,div){
        div.innerHTML="";
        let startLabel=document.createElement("label");
        startLabel.className="formLabel";
        startLabel.innerHTML="Start Address";
        let start=document.createElement("label");
        start.innerHTML=info.startAddress;
        start.className="address";

        let endLabel=document.createElement("label");
        endLabel.className="formLabel";
        endLabel.innerHTML="End Address";
        let end=document.createElement("label");
        end.innerHTML=info.endAddress;
        end.className="address";

        div.appendChild(startLabel);
        div.appendChild(start);

        div.appendChild(endLabel);
        div.appendChild(end);


    }
    GetCurrentOrder(username,div){
        fetch(`https://localhost:5001/Driver/GetCurrentOrder/${username}`,{
            headers:{
                'Access-Token': 'token'
            },
            method:'GET'})
            .then(data=>{
                if(data.ok){
                    data.json().then(info=>{
                        this.ShowCurrentOrder(info,div);
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


 
}