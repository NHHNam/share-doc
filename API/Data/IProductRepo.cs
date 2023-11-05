using API.Models;

namespace API.Data
{
    public interface IProductRepo
    {
        bool SaveChanges();
        IEnumerable<Product> GetAllProducts();

        IEnumerable<Product> GetAllProductsByCategoryId(int id);
        IEnumerable<Product> GetAllProductsByUser(int userId);

        IEnumerable<ProductReturn> GetAllProductsBlacklist();
        Product GetProductById(int id);

        ProductReturn getProductByIdAndBlacklist(int id);
        void CreateDoc(Product product);

        void DeleteDoc(Product product);
        void Update(Product product);

        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
    }

    public class ProductReturn
    {
        public int Id { get; set; }

        public string Name { get; set; } = String.Empty;

        public string Description { get; set; } = String.Empty;

        public string Path { get; set; } = String.Empty;

        public string PathDownload { get; set; } = String.Empty;

        public bool isPrivate { get; set; } = false;

        public int CategoryId { get; set; }


        public int UserId { get; set; }

        public ICollection<Comments>? comments { get; set; }

        public ICollection<ShareDocumentDetail>? shareDocumentDetails { get; set; }
        public bool isBlacklisted { get; set; }
    }
}