using System;
using API.Models;
using GateWay.Data;

namespace API.Data
{
    public class BlackListRepo : IBlackList
    {
        private readonly AppDbContext _context;

        public BlackListRepo(AppDbContext context)
        {
            _context = context;
        }

        public void CreateBlackList(BlackList blacklist)
        {
            if (blacklist == null)
            {
                throw new ArgumentNullException("Blacklist is null");
            }

            _context.BlackLists.Add(blacklist);
        }

        public void DeleteBlackList(BlackList blacklist)
        {
            _context.BlackLists.Remove(blacklist);
        }

        public IEnumerable<BlackList> GetAllBlackList()
        {
            return _context.BlackLists.ToList();
        }

        public BlackList GetBlackListById(int id)
        {
            return _context.BlackLists.FirstOrDefault(e => e.Id == id);
        }

        public BlackList GetBlackListByIdProduct(int idProduct)
        {
            return _context.BlackLists.FirstOrDefault(e => e.IdProduct == idProduct);
        }

        public bool SaveChanges()
        {
            return (_context.SaveChanges() >= 0);
        }
    }
}

