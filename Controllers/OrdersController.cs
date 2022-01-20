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
    public class OrdersController : ControllerBase
    {
        private TaxiContext Context{get;set;}
        public OrdersController(TaxiContext context){
            Context=context;
        }
        [Route("AddOrder/{clientUsername}/{vehicleName}/{taxiCompany}/{city}")]
        [HttpPost]
        public async Task<ActionResult> AddOrder([FromBody] Order order,string clientUsername,string vehicleName,string taxiCompany,string city){

            if(clientUsername.Length<3 || clientUsername.Length>15){
                return BadRequest(new {message="Format error for clients username!"});
            }
            Client alreadyExists=await Context.Clients.Where(p=>p.UserName==clientUsername).FirstOrDefaultAsync();
            if(alreadyExists==null){
                return BadRequest(new {message="Client doesn't exist!"});
            }
            order.Client=alreadyExists;

            Driver drivers =await Context.Drivers.Where(v=>v.Vehicle.VehicleName==vehicleName && v.Vehicle.TaxiCompany.CompanyName==taxiCompany && v.Vehicle.TaxiCompany.City==city && v.DriverState.Equals(DriverState.FREE)).FirstOrDefaultAsync();
            if(drivers==null){
                return BadRequest(new {message="No available vehicles!"});
            }
            drivers.DriverState=DriverState.BUSY;
            order.Vehicle=drivers.Vehicle;
            order.OrderState=OrderState.ACCEPTED;
            try
            {
                Context.Orders.Add(order);
                await Context.SaveChangesAsync();
                return Ok("Order added!");                
            }
            catch(System.Exception e)
            {
                return BadRequest(e.Message);
            }        
        }

        [Route("ChangeOrderState")]
        [HttpPut]
        public async Task<ActionResult> ChangeOrderState(int orderID,int state){
            Order alreadyExists=await Context.Orders.Where(p=>p.ID==orderID).FirstOrDefaultAsync();
            if(alreadyExists==null){
                return BadRequest(new {message="The order doesn't exist!"});
            }
            alreadyExists.OrderState=(OrderState) state;
            return Ok(new {message="Order state updated!"});   
        }
    }
}
