using API.Dtos;
using API.Models;
using AutoMapper;


namespace GateWay.Profiles
{
    public class CommentProfile : Profile
    {
        public CommentProfile()
        {
            CreateMap<Comments, CommentReadDTO>();
            CreateMap<CommentCreateDTO, Comments>();
        }
    }
}

