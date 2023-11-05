using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using API.Dtos;
using API.Data;
using API.Models;

namespace GateWay.Controllers
{
    [ApiController]
    // [Authorize(Roles = ("admin"))]
    [Authorize]
    [Route("api/user")]
    public class UserController : Controller
    {
        private readonly IUserRepo _respository;
        private readonly IMapper _mapper;

        public UserController(IUserRepo repository, IMapper mapper)
        {
            _respository = repository;
            _mapper = mapper;
        }

        [HttpGet("search")]
        public ActionResult<IEnumerable<UserReadDto>> SearchUser(string value)
        {
            var users = _respository.SearchUser(value);
            return Ok(_mapper.Map<IEnumerable<UserReadDto>>(users));
        }

        [HttpGet]
        public ActionResult<IEnumerable<UserReadDto>> GetAllUser()
        {
            var users = _respository.GetAllUser();
            return Ok(_mapper.Map<IEnumerable<UserReadDto>>(users));
        }

        [HttpGet("{id:int}", Name = "GetUserById")]
        public ActionResult<UserReadDto> GetUserById(int id)
        {
            var user = _respository.GetUserById(id);
            if (user != null)
            {
                var userRead = _mapper.Map<UserReadDto>(user);
                return Ok(userRead);
            }
            return NotFound();
        }

        [HttpPost]
        public ActionResult<UserReadDto> CreateUser(UserCreateDto request)
        {
            var user = _mapper.Map<User>(request);
            _respository.CreateUser(user);
            _respository.SaveChanges();

            var userRead = _mapper.Map<UserReadDto>(user);
            return CreatedAtRoute(nameof(GetUserById), new { Id = userRead.Id }, userRead);
        }

        [HttpPut("{id:int}")]
        public ActionResult<UserReadDto> UpdateUser(UserUpdateNameDto request, int id)
        {
            var user = _respository.GetUserById(id);
            if (user == null)
            {
                return NotFound();
            }
            user.FullName = request.FullName;
            _respository.SaveChanges();
            var userRead = _mapper.Map<UserReadDto>(user);
            return CreatedAtRoute(nameof(GetUserById), new { Id = userRead.Id }, userRead);
        }

        [HttpPut("role/{id:int}")]
        public ActionResult<UserReadDto> ChangeRoleUser(UserRoleDTO userRoleDTO, int id)
        {
            var user = _respository.GetUserById(id);
            if (user == null)
            {
                return NotFound();
            }
            user.Roles = userRoleDTO.role;
            _respository.SaveChanges();
            var userRead = _mapper.Map<UserReadDto>(user);
            return CreatedAtRoute(nameof(GetUserById), new { Id = userRead.Id }, userRead);
        }

        [HttpDelete("{id:int}")]
        public ActionResult<UserReadDto> DeleteUser(int id)
        {
            var user = _respository.GetUserById(id);
            if (user == null)
            {
                return NotFound();
            }

            _respository.DeleteUser(user);
            _respository.SaveChanges();

            return Ok("Delete user successfully");
        }
    }
}

