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
    public class DriverController : ControllerBase
    {
        private TaxiContext Context{get;set;}
        public DriverController(TaxiContext context){
            Context=context;
        }

        [Route("AddDriver")]
        [HttpPost]
        public async Task<ActionResult> AddDriver([FromBody] Driver driver){
            if(driver.FirstName.Length<3 || driver.FirstName.Length>15){
                return BadRequest(new {message="Format error for drivers first name!"});
            }
            if(driver.LastName.Length<3 || driver.LastName.Length>15){
                return BadRequest(new {message="Format error for drivers last name!"});
            }
            if(driver.UserName.Length<3 || driver.UserName.Length>20){
                return BadRequest(new {message="Format error for drivers username!"});
            }
            if(driver.Password.Length<8){
                return BadRequest(new {message="The password is too short. Password must contain at least 8 characters!"});
            }
            driver.DriverState=DriverState.FREE;
            Driver alreadyExists=await Context.Drivers.Where(p=>p.UserName==driver.UserName).FirstOrDefaultAsync();
            if(alreadyExists!=null){
                return BadRequest(new {message="Username is already taken!"});
            }
            try
            {
                Context.Drivers.Add(driver);
                await Context.SaveChangesAsync();
                return Ok(driver);                
            }
            catch(System.Exception e)
            {
                return BadRequest(new {message=e.Message});
            }        
        }

        [Route("DeleteDriver")]
        [HttpDelete]
        public async Task<ActionResult> DeleteDriver(string driverUserName){
            if(driverUserName.Length<3 || driverUserName.Length>20){
                return BadRequest(new {message="Format error for drivers username!"});
            }
            
            Driver alreadyExists=await Context.Drivers.Where(p=>p.UserName==driverUserName).FirstOrDefaultAsync();
            if(alreadyExists==null){
                return BadRequest(new {message="The driver doesn't exist!"});
            }
            try
            {
                Context.Drivers.Remove(alreadyExists);
                await Context.SaveChangesAsync();
                return Ok(new {message="Driver removed!"});                
            }
            catch(System.Exception e)
            {
                return BadRequest(new {message=e.Message});
            }        
        }
        [Route("GetDriver")]
        [HttpGet]
        public async Task<ActionResult> GetDriver(string driverUserName){
            if(driverUserName.Length<3 || driverUserName.Length>20){
                return BadRequest(new {message="Format error for drivers username!"});
            }
            
            Driver alreadyExists=await Context.Drivers.Where(p=>p.UserName==driverUserName).FirstOrDefaultAsync();
            if(alreadyExists==null){
                return BadRequest(new {message="The driver doesn't exist!"});
            }
            try{
                return Ok(alreadyExists);    
            }
            catch(System.Exception e)
            {
                return BadRequest(new {message=e.Message});
            }  
        }

        [Route("ChangeDriverState/{username}/{state}")]
        [HttpPut]
        public async Task<ActionResult> ChangeDriverState(string username,int state){
            Driver alreadyExists=await Context.Drivers.Where(p=>p.UserName==username).FirstOrDefaultAsync();
            if(alreadyExists==null){
                return BadRequest(new {message="The driver doesn't exist!"});
            }
            alreadyExists.DriverState=(DriverState) state;
            Order o = await Context.Orders.Where(p=>p.Vehicle==alreadyExists.Vehicle && p.OrderState==OrderState.ACCEPTED).FirstOrDefaultAsync();
            if(o!=null){
                o.OrderState=OrderState.FINISHED;
            }
            await Context.SaveChangesAsync();
            try{
                return Ok(new {message="Driver state updated!"});   
            }
            catch(System.Exception e)
            {
                return BadRequest(new {message=e.Message});
            }  
        }

        [Route("Arrive/{username}")]
        [HttpPut]
        public async Task<ActionResult> Arrive(string username){
            Driver alreadyExists=await Context.Drivers.Where(p=>p.UserName==username).FirstOrDefaultAsync();
            if(alreadyExists==null){
                return BadRequest(new {message="The driver doesn't exist!"});
            }
            
            Order o = await Context.Orders.Where(p=>p.Vehicle==alreadyExists.Vehicle && p.OrderState==OrderState.ACCEPTED).FirstOrDefaultAsync();
            if(o!=null){
                o.OrderState=OrderState.FINISHED;
                alreadyExists.DriverState=DriverState.FREE;
                await Context.SaveChangesAsync();
                return Ok(new {message="Driver state updated!"});
            }
            else{
                return BadRequest(new {message="Nowhere to arrive!"}); 
            }
        }


        [Route("LoginDriver/{username}/{password}")]
        [HttpGet]
        public async Task<ActionResult> LoginDriver(string username,string password){
            if(username.Length<3 || username.Length>20){
                return BadRequest(new {message="Format error for drivers username!"});
            }
            if(password.Length<8){
                return BadRequest(new {message="Format error for password!"});
            }

            Driver alreadyExists=await Context.Drivers.Where(p=>p.UserName==username && p.Password==password).FirstOrDefaultAsync();
            if(alreadyExists==null){
                return BadRequest(new {message="Driver doesn't exist!"});
            }
            return Ok(alreadyExists);      
        }

        [Route("GetCurrentOrder/{username}")]
        [HttpGet]
        public async Task<ActionResult> GetCurrentOrder(string username){
            if(username.Length<3 || username.Length>20){
                return BadRequest(new {message="Format error for drivers username!"});
            }
          

            Driver alreadyExists=await Context.Drivers.Where(p=>p.UserName==username).FirstOrDefaultAsync();

            if(alreadyExists==null){
                return BadRequest(new {message="Driver doesn't exist!"});
            }
            if(alreadyExists.DriverState==DriverState.OFF){
                return BadRequest(new {message="The driver is not working currently!"});
            }
            Order o=await Context.Orders.Where(p=>p.Vehicle==alreadyExists.Vehicle && p.OrderState==OrderState.ACCEPTED).FirstOrDefaultAsync();

            if(o==null){
                return BadRequest(new{message="No current orders!"});
            }
            return Ok(o);      
            
            
        }
        

        
        
    }
}
