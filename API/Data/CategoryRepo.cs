using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class CategoryRepo : ICategoryRepo
    {
        private readonly AppDbContext _context;

        public CategoryRepo(AppDbContext context)
        {
            _context = context;
        }

        public void CreateCategory(Category category)
        {
            if (category == null) throw new ArgumentNullException();

            _context.Categories.Add(category);
        }

        public void DeleteCategory(Category category)
        {
            if (category == null) throw new ArgumentNullException();

            _context.Categories.Remove(category);
        }

        public IEnumerable<Category> GetAllCategories()
        {
            return _context.Categories.Include(c => c.products).ToList();
        }

        public IEnumerable<Category> GetAllCategoriesWithProductNonPrivate()
        {
            return _context.Categories.Include(c => c.products.Where(p => p.isPrivate == false)).ToList();
        }

        public Category GetCategoryById(int id)
        {
            return _context.Categories.Where(p => p.Id == id).Include(c => c.products).FirstOrDefault();
        }

        public bool SaveChanges()
        {
            return (_context.SaveChanges() >= 0);
        }
    }
}