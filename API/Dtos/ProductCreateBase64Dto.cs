using System;
namespace API.Dtos
{
    public class ProductCreateBase64Dto
    {
        public string? Name { get; set; }

        public string? Description { get; set; }

        public int UserId { get; set; }

        public bool isPrivate { get; set; }

        public string? base64String { get; set; }

        public string? NameFile { get; set; }

        public int CategoryId { get; set; }
    }
}

