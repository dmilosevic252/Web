using Microsoft.EntityFrameworkCore;

namespace Models{
    public class TaxiContext:DbContext{
        public TaxiContext(DbContextOptions dbContextOptions)
            :base(dbContextOptions)
        {
            
        }
        public DbSet<Client> Clients{get;set;}
        public DbSet<Driver> Drivers{get;set;}
        public DbSet<Order> Orders{get;set;}
        public DbSet<TaxiCompany> TaxiCompanies{get;set;}
        public DbSet<Vehicle> Vehicles{get;set;}

    }
}