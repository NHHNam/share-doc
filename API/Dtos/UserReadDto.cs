using System;
namespace API.Dtos
{
    public class UserReadDto
    {
        public int Id { get; set; }

        public string? Email { get; set; }

        public string? Roles { get; set; }

        public string? FullName { get; set; }

        public DateTime BirthDate { get; set; }
    }
}

