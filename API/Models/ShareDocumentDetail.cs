using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    [Table("ShareDocumentUserDetail")]
    public class ShareDocumentDetail
    {
        [Key]
        public int Id { get; set; }
        public Product? Product { get; set; }
        public int idProduct { get; set; }
        public User? User { get; set; }
        public int idUser { get; set; }
    }
}

