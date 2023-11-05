using System;
using API.Models;

namespace API.Data
{
    public class ShareDocumentDetailRepo : IShareDocumentDetailRepo
    {
        private readonly AppDbContext _context;
        public ShareDocumentDetailRepo(AppDbContext context)
        {
            _context = context;
        }

        public void CreateDoc(ShareDocumentDetail detail)
        {
            if (detail == null)
            {
                throw new ArgumentNullException(nameof(detail));
            }

            _context.ShareDocumentDetails.Add(detail);
        }

        public void DeleteDoc(ShareDocumentDetail detail)
        {
            _context.ShareDocumentDetails.Remove(detail);
        }

        public IEnumerable<ShareDocumentDetail> GetAll()
        {
            return _context.ShareDocumentDetails.ToList();
        }

        public ShareDocumentDetail GetById(int id)
        {
            return _context.ShareDocumentDetails.FirstOrDefault(p => p.Id == id);
        }

        public void DeleteByProductIdd(int id)
        {
            var details = _context.ShareDocumentDetails.Where(p => p.idProduct == id);
            _context.ShareDocumentDetails.RemoveRange(details);
        }

        public IEnumerable<Product> GetByUserId(int idUser)
        {
            return _context.ShareDocumentDetails
           .Where(doc => doc.idUser == idUser)
           .Join(
               _context.Products,
               doc => doc.idProduct,
               product => product.Id,
               (doc, product) => product
           )
           .ToList();

        }

        public bool SaveChanges()
        {
            return (_context.SaveChanges() >= 0);
        }

    }
}

