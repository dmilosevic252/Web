using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Web.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TaxiCompanyController : ControllerBase
    {
        private TaxiContext Context{get;set;}
        public TaxiCompanyController(TaxiContext context){
            Context=context;
        }

        [Route("AddTaxiCompany")]
        [HttpPost]
        public async Task<ActionResult> AddTaxiCompany([FromBody] TaxiCompany taxiCompany){

            if(taxiCompany.CompanyName.Length<3 || taxiCompany.CompanyName.Length>15){
                return BadRequest(new {message="Format error for company name!"});
            }
            if(taxiCompany.City.Length<3 || taxiCompany.City.Length>15){
                return BadRequest(new {message="Format error for city!"});
            }
            if(taxiCompany.UserName.Length<3 || taxiCompany.UserName.Length>20){
                return BadRequest(new {message="Format error for company username!"});
            }
            if(taxiCompany.Password.Length<8){
                return BadRequest(new {message="The password is too short. Password must contain at least 8 characters!"});
            }

            TaxiCompany alreadyExists=await Context.TaxiCompanies.Where(p=>p.UserName==taxiCompany.UserName).FirstOrDefaultAsync();
            if(alreadyExists!=null){
                return BadRequest(new {message="Username is already taken!"});
            }
            try
            {
                Context.TaxiCompanies.Add(taxiCompany);
                await Context.SaveChangesAsync();
                return Ok(new {message="Taxi Company added!"});                
            }
            catch(System.Exception e)
            {
                return BadRequest(new {message=e.Message});
            }        
        }

        [Route("DeleteTaxiCompany")]
        [HttpDelete]
        public async Task<ActionResult> DeleteTaxiCompany(string taxiCompanyUserName){
            if(taxiCompanyUserName.Length<3 || taxiCompanyUserName.Length>20){
                return BadRequest(new {message="Format error for company username!"});
            }
            
            TaxiCompany alreadyExists=await Context.TaxiCompanies.Where(p=>p.UserName==taxiCompanyUserName).FirstOrDefaultAsync();
            if(alreadyExists==null){
                return BadRequest(new {message="The taxi company doesn't exist!"});
            }
            try
            {
                Context.TaxiCompanies.Remove(alreadyExists);
                await Context.SaveChangesAsync();
                return Ok(new {message="Taxi Company removed!"});                
            }
            catch(System.Exception e)
            {
                return BadRequest(new {message=e.Message});
            }        
        }

        [Route("LoginTaxiCompany/{username}/{password}")]
        [HttpGet]
        public async Task<ActionResult> LoginTaxiCompany(string username,string password){
            if(username.Length<3 || username.Length>20){
                return BadRequest(new {message="Format error for taxi companies username!"});
            }
            if(password.Length<8){
                return BadRequest(new {message="Format error for password!"});
            }

            TaxiCompany alreadyExists=await Context.TaxiCompanies.Where(p=>p.UserName==username && p.Password==password).FirstOrDefaultAsync();
            if(alreadyExists==null){
                return BadRequest(new {message="Taxi company doesn't exist!"});
            }
            return Ok(alreadyExists);      
        }
        [Route("GetCities")]
        [HttpGet]
        public async Task<ActionResult> GetCities(){
            try{
                return Ok(
                    await Context.TaxiCompanies.Select(p => new {p.City}).Distinct().ToListAsync()
                );
            }
            catch(System.Exception e){
                return BadRequest(new {message=e.Message});
            }      
        }
        [Route("GetTaxiCompanies/{city}")]
        [HttpGet]
        public async Task<ActionResult> GetTaxiCompanies(string city){
            try{
                
                return Ok(
                    await Context.TaxiCompanies.Where(p=>p.City==city).Select(p => new {p.CompanyName}).ToListAsync()
                );
            }
            catch(System.Exception e){
                return BadRequest(new {message=e.Message});
            }      
        }

        [Route("AddVehicle/{username}")]
        [HttpPost]
        public async Task<ActionResult> AddVehicle([FromBody] Vehicle vehicle,string username){
            if(username.Length<3 || username.Length>20){
                return BadRequest(new {message="Username format incorrect!"});
            }
            TaxiCompany company=await Context.TaxiCompanies.Where(p=>p.UserName==username).FirstOrDefaultAsync();
            Vehicle v=await Context.Vehicles.Where(v=>v.VehicleName==vehicle.VehicleName && v.VehicleNumber==vehicle.VehicleNumber && v.TaxiCompany.UserName==username).FirstOrDefaultAsync();
            if(company==null){
                return BadRequest("Taxi company doesn't exist!");
            }
            if(v!=null){
                return BadRequest("Vehicle already exists!");
            }
            try{
                vehicle.TaxiCompany=company;
                Context.Vehicles.Add(vehicle);
                await Context.SaveChangesAsync();
                return Ok(new {vehicle.TaxiCompany.CompanyName}); 
            }
            catch(System.Exception e){
                return BadRequest(new {message=e.Message});
            }      
        }

        [Route("GetVehicles/{username}")]
        [HttpGet]
        public async Task<ActionResult> GetVehicles(string username){
            try{
                TaxiCompany t=await Context.TaxiCompanies.Where(p=>p.UserName==username).FirstOrDefaultAsync();
                List<Vehicle> vehicles=t.Vehicles;
                return Ok(
                    vehicles.Select(p => new {p.VehicleName,p.VehicleNumber,p.Driver})
                );
            }
            catch(System.Exception e){
                return BadRequest(e.Message);
            }      
        }

        [Route("GetDrivers/{username}")]
        [HttpGet]
        public async Task<ActionResult> GetDrivers(string username){
            try{
                return Ok(
                    await Context.TaxiCompanies.Where(p=>p.UserName==username).Select(p => new {p.Drivers}).ToListAsync()
                );
            }
            catch(System.Exception e){
                return BadRequest(e.Message);
            }      
        }


        [Route("AddDriver/{taxiCompanyUserName}/{driverUserName}")]
        [HttpPut]
        public async Task<ActionResult> AddDriver(string taxiCompanyUserName,string driverUserName){
            if(driverUserName.Length<3 || driverUserName.Length>20){
                return BadRequest("Drivers username in wrong format!");
            }
            if(taxiCompanyUserName.Length<3 || taxiCompanyUserName.Length>20){
                return BadRequest("Taxi username in wrong format!");
            }
            Driver driver=await Context.Drivers.Where(p=>p.UserName==driverUserName).FirstOrDefaultAsync();
            TaxiCompany taxi=await Context.TaxiCompanies.Where(p=>p.UserName==taxiCompanyUserName).FirstOrDefaultAsync();
            if(taxi.Drivers.Contains(driver)){
                return BadRequest("Driver already works for the company!");
            }
            if(driver==null){
                return BadRequest("Driver doesn't exist!");
            }
            if(taxi==null){
                return BadRequest("Taxi company doesn't exist!");
            }
            try{
                taxi.Drivers.Add(driver);
                await Context.SaveChangesAsync();
                return Ok("Driver added!");
            }
            catch(System.Exception e){
                return BadRequest(e.Message);
            }      
        }

        [Route("GiveDriverVehicle/{taxiCompanyUserName}/{driverUserName}/{vehicleName}/{vehicleNumber}")]
        [HttpPut]
        public async Task<ActionResult> GiveDriverVehicle(string taxiCompanyUserName,string driverUserName,string vehicleName,int vehicleNumber){
            if(driverUserName.Length<3 || driverUserName.Length>20){
                return BadRequest("Drivers username in wrong format!");
            }
            if(taxiCompanyUserName.Length<3 || taxiCompanyUserName.Length>20){
                return BadRequest("Taxi username in wrong format!");
            }
            if(vehicleName.Length<3 || vehicleName.Length>30){
                return BadRequest("Taxi username in wrong format!");
            }
            
            Driver driver=await Context.Drivers.Where(p=>p.UserName==driverUserName).FirstOrDefaultAsync();
            Vehicle v=await Context.Vehicles.Where(v=>v.VehicleName==vehicleName && v.VehicleNumber==vehicleNumber && v.TaxiCompany.UserName==taxiCompanyUserName).FirstOrDefaultAsync();
            if(v.Driver.Count>0){
                return BadRequest("Vehicle taken!");
            }
            if(v.Driver.Contains(driver)){
                return BadRequest("Driver already drives that vehicle!");
            }
            if(driver==null){
                return BadRequest("Driver doesn't exist!");
            }
            if(v==null){
                return BadRequest("Vehicle doesn't exist!");
            }
            try{
                driver.Vehicle=v;
                await Context.SaveChangesAsync();
                return Ok("Success!");
            }
            catch(System.Exception e){
                return BadRequest(e.Message);
            }      
        }

        

        

        


        
    }
}
