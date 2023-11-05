using API.Dtos;
using API.Models;
using AutoMapper;

namespace API.Profiles
{
    public class ShareDocumentDetailProfile : Profile
    {
        public ShareDocumentDetailProfile()
        {

            // Source -> Target
            CreateMap<ShareDocumentDetail, ShareProductDetailCreateDTO>();
            CreateMap<ProductCreateDto, ShareProductDetailReadDTO>();
        }
    }
}

