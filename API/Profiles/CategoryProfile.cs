using API.Dtos;
using API.Models;
using AutoMapper;


namespace GateWay.Profiles
{
    public class CategoryProfile : Profile
    {
        public CategoryProfile()
        {
            // Source -> Target
            CreateMap<Category, CategoryReadDto>();
            CreateMap<CategoryCreateDto, Category>();
        }
    }
}

