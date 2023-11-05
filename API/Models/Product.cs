using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using API.Models;

namespace API.Models
{
    [Table("Documents")]
    public class Product
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; } = String.Empty;

        public string Description { get; set; } = String.Empty;

        public string Path { get; set; } = String.Empty;

        public string PathDownload { get; set; } = String.Empty;

        public bool isPrivate { get; set; } = false;

        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now;

        public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.Now;

        public Category? Category { get; set; }

        public int CategoryId { get; set; }

        public User? User { get; set; }

        public int UserId { get; set; }

        public ICollection<Comments>? comments { get; set; }

        public ICollection<ShareDocumentDetail>? shareDocumentDetails { get; set; }
    }
}