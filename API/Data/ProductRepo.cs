using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace API.Data
{
    public class ProductRepo : IProductRepo
    {
        private readonly AppDbContext _context;
        private IDbContextTransaction _transaction;

        public ProductRepo(AppDbContext context)
        {
            _context = context;
        }


        public void CreateDoc([FromForm] Product product)
        {
            if (product == null)
            {
                throw new ArgumentNullException(nameof(product));
            }

            _context.Products.Add(product);
        }

        public void DeleteDoc(Product product)
        {
            _context.Products.Remove(product);
        }

        public IEnumerable<Product> GetAllProducts()
        {
            return _context.Products.Include(p => p.Category).ToList();
        }

        public IEnumerable<Product> GetAllProductsByUser(int userId)
        {
            return _context.Products.Where(p => p.UserId == userId).ToList();
        }


        public Product GetProductById(int id)
        {
            return _context.Products.Where(p => p.Id == id).Include(m => m.comments).FirstOrDefault();
        }

        public bool SaveChanges()
        {
            return (_context.SaveChanges() >= 0);
        }

        public async Task BeginTransactionAsync()
        {
            _transaction = await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.CommitAsync();
                _transaction.Dispose();
            }
        }

        public async Task RollbackTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync();
                _transaction.Dispose();
            }
        }

        public void Update(Product product)
        {
            _context.Entry(product).State = EntityState.Modified;
        }

        public IEnumerable<Product> GetAllProductsByCategoryId(int id)
        {
            return _context.Products.Where(p => p.CategoryId == id).ToList();
        }

        public IEnumerable<ProductReturn> GetAllProductsBlacklist()
        {
            return _context.Products.Select(product => new ProductReturn
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Path = product.Path,
                PathDownload = product.PathDownload,
                isPrivate = product.isPrivate,
                CategoryId = product.CategoryId,
                UserId = product.UserId,
                comments = product.comments,
                shareDocumentDetails = product.shareDocumentDetails,
                isBlacklisted = _context.BlackLists.Any(blacklist => blacklist.IdProduct == product.Id)
            })
            .ToList();
        }

        public ProductReturn getProductByIdAndBlacklist(int id)
        {
            return _context.Products.Where(p => p.Id == id).Select(product => new ProductReturn
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Path = product.Path,
                PathDownload = product.PathDownload,
                isPrivate = product.isPrivate,
                CategoryId = product.CategoryId,
                UserId = product.UserId,
                comments = product.comments,
                shareDocumentDetails = product.shareDocumentDetails,
                isBlacklisted = _context.BlackLists.Any(blacklist => blacklist.IdProduct == product.Id)
            }).Include(m => m.comments).FirstOrDefault();
        }
    }
}