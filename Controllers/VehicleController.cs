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
    public class VehicleController : ControllerBase
    {
        private TaxiContext Context{get;set;}
        public VehicleController(TaxiContext context){
            Context=context;
        }

        [Route("AddVehicle")]
        [HttpPost]
        public async Task<ActionResult> AddVehicle([FromBody] Vehicle vehicle){

            if(vehicle.VehicleName.Length<3 || vehicle.VehicleName.Length>30){
                return BadRequest(new {message="Format error for vehicle name!"});
            }

            Vehicle alreadyExists=await Context.Vehicles.Where(p=>p.VehicleNumber==vehicle.VehicleNumber && p.VehicleName==vehicle.VehicleName && p.TaxiCompany.CompanyName==vehicle.TaxiCompany.CompanyName).FirstOrDefaultAsync();
            if(alreadyExists!=null){
                return BadRequest(new {message="Vehicle already exist!"});
            }
            try
            {
                Context.Vehicles.Add(vehicle);
                await Context.SaveChangesAsync();
                return Ok(new {message="Vehicle added!"});                
            }
            catch(System.Exception e)
            {
                return BadRequest(new {message=e.Message});
            }        
        }

        [Route("DeleteVehicle")]
        [HttpDelete]
        public async Task<ActionResult> DeleteVehicle(string taxiCompanyName,string vehicleName,int vehicleNumber){
            if(vehicleName.Length<3 || vehicleName.Length>30){
                return BadRequest(new {message="Format error for vehicle name!"});
            }
            if(taxiCompanyName.Length<3 && taxiCompanyName.Length>15){
                return BadRequest(new {message="Format error for taxi company name!"});
            }
             Vehicle alreadyExists=await Context.Vehicles.Where(p=>p.VehicleNumber==vehicleNumber && p.VehicleName==vehicleName && p.TaxiCompany.CompanyName==taxiCompanyName).FirstOrDefaultAsync();
            if(alreadyExists==null){
                return BadRequest(new {message="The vehicle doesn't exist!"});
            }
            try
            {
                Context.Vehicles.Remove(alreadyExists);
                await Context.SaveChangesAsync();
                return Ok(new {message="Vehicle removed!"});                
            }
            catch(System.Exception e)
            {
                return BadRequest(new {message=e.Message});
            }        
        }
        [Route("GetVehicle")]
        [HttpGet]
        public async Task<ActionResult> GetVehicle(string vehicleName,int vehicleNumber){
            if(vehicleName.Length<3 || vehicleName.Length>30){
                return BadRequest(new {message="Format error for vehicle name!"});
            }
            Vehicle alreadyExists=await Context.Vehicles.Where(p=>p.VehicleNumber==vehicleNumber && p.VehicleName==vehicleName).FirstOrDefaultAsync();
            if(alreadyExists==null){
                return BadRequest(new {message="The vehicle doesn't exist!"});
            }
            return Ok(alreadyExists.TaxiCompany);     
        }

        [Route("GetVehiclesInCompany/{city}/{taxiCompanyName}")]
        [HttpGet]
        public async Task<ActionResult> GetVehiclesInCompany(string city,string taxiCompanyName){
            if(taxiCompanyName.Length<3 || taxiCompanyName.Length>20){
                return BadRequest(new {message="Format error for vehicle name!"});
            }
            if(city.Length<3 || city.Length>15){
                return BadRequest(new {message="Format error for city!"});
            }
            try{
                return Ok(
                    await Context.Vehicles.Where(p=>p.TaxiCompany.CompanyName==taxiCompanyName && p.TaxiCompany.City==city).Select(p=>new {p.VehicleName}).Distinct().ToListAsync()
                );
            }
            catch(System.Exception e){
                return BadRequest(new {message=e.Message});
            }     
        }



        
    }
}
