using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using API.Models;

namespace API.Models
{
    [Table("User")]
    public class User
    {
        [Key]
        public int Id { get; set; }

        public string? Email { get; set; }

        public string? Roles { get; set; }

        public string? FullName { get; set; }

        public DateTime BirthDate { get; set; }

        public ICollection<Product>? products { get; set; }

        public ICollection<Comments>? comments { get; set; }

        public ICollection<ShareDocumentDetail>? shareDocumentDetails { get; set; }
    }
}

