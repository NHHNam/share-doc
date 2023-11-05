using System;
using API.Models;

namespace API.Data
{
    public interface IShareDocumentDetailRepo
    {
        bool SaveChanges();
        IEnumerable<ShareDocumentDetail> GetAll();

        IEnumerable<Product> GetByUserId(int idUser);

        ShareDocumentDetail GetById(int id);

        void DeleteByProductIdd(int id);

        void CreateDoc(ShareDocumentDetail detail);

        void DeleteDoc(ShareDocumentDetail detail);

    }
}

