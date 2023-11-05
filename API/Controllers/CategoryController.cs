using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using API.Models;
using API.Data;
using API.Dtos;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace GateWay.Controllers
{
    [ApiController]
    // [Authorize(Roles = ("admin"))]
    [Authorize]
    [Route("api/category")]
    public class CategoryController : Controller
    {
        private readonly ICategoryRepo _context;
        private readonly IMapper _mapper;

        public CategoryController(ICategoryRepo context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public ActionResult<IEnumerable<CategoryReadDto>> GetAllCategory()
        {
            var categories = _context.GetAllCategories();
            return Ok(categories);
        }

        [HttpGet("nonPrivate")]
        public ActionResult<IEnumerable<CategoryReadDto>> GetAllCategoryNonePrivate()
        {
            var categories = _context.GetAllCategoriesWithProductNonPrivate();
            return Ok(categories);
        }

        [HttpGet("{id:int}", Name = "GetCategoryById")]
        public ActionResult<CategoryReadDto> GetCategoryById(int id)
        {
            var category = _context.GetCategoryById(id);
            if (category == null) return NotFound();

            return Ok(category);
        }

        [HttpPost]
        public ActionResult<CategoryReadDto> CreateCategory(CategoryCreateDto request)
        {
            var category = _mapper.Map<Category>(request);
            _context.CreateCategory(category);
            _context.SaveChanges();
            var categoryRead = _mapper.Map<CategoryReadDto>(category);
            return CreatedAtRoute(nameof(GetCategoryById), new { Id = categoryRead.Id }, categoryRead);
        }

        [HttpPut("{id:int}")]
        public ActionResult<CategoryReadDto> UpdateCategory(CategoryCreateDto request, int id)
        {
            var category = _context.GetCategoryById(id);
            if (category == null) return NotFound();

            category.Name = request.Name;
            _context.SaveChanges();
            var categoryRead = _mapper.Map<CategoryReadDto>(category);
            return CreatedAtRoute(nameof(GetCategoryById), new { Id = categoryRead.Id }, categoryRead);
        }

        [HttpDelete("{id:int}")]
        public ActionResult DeleteCategory(int id)
        {
            var category = _context.GetCategoryById(id);
            if (category == null) return NotFound();

            _context.DeleteCategory(category);
            _context.SaveChanges();
            return Ok("Delete Category successfully");
        }
    }
}

