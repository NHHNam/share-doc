using System;
using API.Models;

namespace API.Data
{
    public interface IUserRepo
    {
        bool SaveChanges();
        IEnumerable<User> GetAllUser();
        User GetUserById(int id);
        User GetUserByEmail(string email);
        void CreateUser(User user);

        IEnumerable<User> SearchUser(string value);

        void DeleteUser(User user);
    }
}

