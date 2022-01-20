using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Models{
    public class TaxiCompany{
        [Key]
        public int ID { get; set; }

        [MinLength(3)]
        [MaxLength(20)]
        [Required]
        public string UserName { get; set; }  

        [MinLength(8)]
        [Required]
        public string Password{get;set;}
        
        [MinLength(3)]
        [MaxLength(15)]
        [Required]
        public string CompanyName { get; set; }

        [MinLength(3)]
        [MaxLength(15)]
        [Required]
        public string City { get; set; }
         
        [EmailAddress]
        [Required]
        public string Email { get; set; }  

        [Phone]
        [Required]
        public string PhoneNumber{get;set;}

        public virtual List<Vehicle> Vehicles{get;set;}
        public virtual List<Driver> Drivers{get;set;}


    }
}