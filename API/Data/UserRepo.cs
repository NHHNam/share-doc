using System;
using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;
using Nest;

namespace GateWay.Data
{
    public class UserRepo : IUserRepo
    {
        private readonly AppDbContext _context;

        public UserRepo(AppDbContext context)
        {
            _context = context;
        }

        public void CreateUser(User user)
        {
            if (user == null)
            {
                throw new ArgumentNullException(nameof(user));
            }

            _context.Users.Add(user);
        }

        public void DeleteUser(User user)
        {
            _context.Users.Remove(user);
        }

        public IEnumerable<User> GetAllUser()
        {
            return _context.Users.ToList();
        }

        public User GetUserByEmail(string email)
        {
            return _context.Users.Where(p => p.Email == email).Include(c => c.products).FirstOrDefault();
        }

        public User GetUserById(int id)
        {
            return _context.Users.Where(p => p.Id == id).Include(c => c.products).FirstOrDefault();
        }

        public bool SaveChanges()
        {
            return (_context.SaveChanges() >= 0);
        }

        public IEnumerable<User> SearchUser(string value)
        {
            return _context.Users.Where(p => p.Email.Contains(value) || p.FullName.Contains(value)).ToList();
        }
    }
}

