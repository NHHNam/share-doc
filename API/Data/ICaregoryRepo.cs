using API.Models;

namespace API.Data
{
    public interface ICategoryRepo
    {
        bool SaveChanges();
        IEnumerable<Category> GetAllCategories();
        Category GetCategoryById(int id);
        void CreateCategory(Category category);
        IEnumerable<Category> GetAllCategoriesWithProductNonPrivate();

        void DeleteCategory(Category category);
    }
}