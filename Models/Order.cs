using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Models{
    public class Order{
        [Key]
        public int ID { get; set; }

        [JsonIgnore]
        public virtual Client Client{get;set;}

        [JsonIgnore]
        public virtual Vehicle Vehicle{get;set;}

        [MinLength(3)]
        [MaxLength(50)]
        [Required]
        public string StartAddress{get;set;}

        [MinLength(3)]
        [MaxLength(50)]
        public string EndAddress{get;set;}

        public System.DateTime OrderDateTime {get;set;}
        public OrderState OrderState{get;set;}

    }
}