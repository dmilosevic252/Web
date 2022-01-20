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
    public class ClientController : ControllerBase
    {
        private TaxiContext Context{get;set;}
        public ClientController(TaxiContext context){
            Context=context;
        }

        [Route("AddClient")]
        [HttpPost]
        public async Task<ActionResult> AddClient([FromBody] Client client){
            if(client.FirstName.Length<3 || client.FirstName.Length>15){
                return BadRequest(new {message="Format error for clients first name!"});
            }
            if(client.LastName.Length<3 || client.LastName.Length>15){
                return BadRequest(new {message="Format error for clients last name!"});
            }
            if(client.UserName.Length<3 || client.UserName.Length>20){
                return BadRequest(new {message="Format error for clients username!"});
            }
            if(client.Password.Length<8){
                return BadRequest(new {message="The password is too short. Password must contain at least 8 characters!"});
            }
            if(Context.Clients.Count()>0){
                Client alreadyExists=await Context.Clients.Where(p=>p.UserName==client.UserName).FirstOrDefaultAsync();
                if(alreadyExists!=null){
                    return BadRequest(new {message="Username is already taken!"});
                }
            }
            try
            {
                Context.Clients.Add(client);
                await Context.SaveChangesAsync();
                return Ok(client);                
            }
            catch(System.Exception e)
            {
                return BadRequest(new {message=e.Message});
            }        
        }
        [Route("LoginClient/{username}/{password}")]
        [HttpGet]
        public async Task<ActionResult> GetClient(string username,string password){
            if(username.Length<3 || username.Length>20){
                return BadRequest(new {message="Format error for clients username!"});
            }
            if(password.Length<8){
                return BadRequest(new {message="Format error for password!"});
            }

            Client alreadyExists=await Context.Clients.Where(p=>p.UserName==username && p.Password==password).FirstOrDefaultAsync();
            if(alreadyExists==null){
                return BadRequest(new {message="Client doesn't exist!"});
            }
            return Ok(alreadyExists);      
        }

        [Route("DeleteClient/{username}")]
        [HttpDelete]
        public async Task<ActionResult> DeleteClient(string username){
            if(username.Length<3 || username.Length>20){
                return BadRequest(new {message="Format error for clients username!"});
            }

            Client alreadyExists=await Context.Clients.Where(p=>p.UserName==username).FirstOrDefaultAsync();
            if(alreadyExists==null){
                return BadRequest(new {message="Client doesn't exist!"});
            }
            try
            {
                Context.Clients.Remove(alreadyExists);
                await Context.SaveChangesAsync();
                return Ok(new {message="Client removed!"});                
            }
            catch(System.Exception e)
            {
                return BadRequest(new {message=e.Message});
            }     
        }
        
    }
}
