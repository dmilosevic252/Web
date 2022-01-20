using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Models{
    public class Vehicle{
        [Key]
        public int ID { get; set; }

        [Required]
        public int VehicleNumber{get;set;}
        [MinLength(3)]
        [MaxLength(30)]

        [Required]
        public string VehicleName{get;set;}


        public virtual List<Driver> Driver{get;set;}
        
        [JsonIgnore]
        public virtual TaxiCompany TaxiCompany{get;set;}

        [JsonIgnore]
        public virtual List<Order> Orders{get;set;}
    }   
}