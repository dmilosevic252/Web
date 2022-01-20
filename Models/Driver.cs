using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Models{
    public class Driver{
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
        public string FirstName { get; set; }

        [MinLength(3)]
        [MaxLength(15)]
        [Required]
        public string LastName { get; set; }
         
        [Phone]
        public string PhoneNumber { get; set; }

        [JsonIgnore]
        public virtual Vehicle Vehicle{get;set;}

        public DriverState DriverState{get;set;}


    }
}