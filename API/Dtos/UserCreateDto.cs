using System;
namespace API.Dtos
{
  public class UserCreateDto
  {
    public string? Email { get; set; }

    public string? Roles { get; set; }

    public string? FullName { get; set; }


    public DateTime BirthDate { get; set; }

  }
}

