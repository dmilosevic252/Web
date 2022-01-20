
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Models{
    public class Client{
        [Key]
        public int ID { get; set; }

        [MinLength(3)]
        [MaxLength(20)]
        [Required]
        public string UserName{ get; set; }  

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

        
        public virtual List<Order> Orders{get;set;}
    }
}