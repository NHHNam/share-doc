using System;
using API.Models;

namespace API.Dtos
{
    public class CategoryReadDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public ICollection<Product> products { get; set; }
    }
}

