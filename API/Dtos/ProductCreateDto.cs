namespace API.Dtos
{
    public class ProductCreateDto
    {
        public string? Name { get; set; }

        public string? Description { get; set; }

        public int UserId { get; set; }

        public bool isPrivate { get; set; }

        public IFormFile? File { get; set; }

        public int CategoryId { get; set; }
    }
}