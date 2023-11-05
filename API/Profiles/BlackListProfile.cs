using System;
using API.Dtos;
using API.Models;
using AutoMapper;

namespace API.Profiles
{
	public class BlackListProfile : Profile
	{
		public BlackListProfile()
		{
			CreateMap<BlackList, BlackListReadDTO>();
			CreateMap<BlackListCreateDTO, BlackList>();
		}
	}
}

