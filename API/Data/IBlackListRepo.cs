using System;
using API.Models;

namespace API.Data
{
    public interface IBlackList
    {
        bool SaveChanges();
        IEnumerable<BlackList> GetAllBlackList();
        BlackList GetBlackListById(int id);
        BlackList GetBlackListByIdProduct(int idProduct);
        void CreateBlackList(BlackList blacklist);

        void DeleteBlackList(BlackList blacklist);
    }
}

