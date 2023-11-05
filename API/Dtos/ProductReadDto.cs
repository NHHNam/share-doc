namespace API.Dtos
{
    public class ProductReadDto
    {
        public int Id { get; set; }

        public string? Name { get; set; }

        public string? Description { get; set; }

        public int UserId { get; set; }

        public string? Path { get; set; }

        public int CategoryId { get; set; }

        public DateTimeOffset CreatedAt { get; set; }

        public DateTimeOffset UpdatedAt { get; set; }
    }
}