using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Net;
using GateWay.Extension;
using API.Models;
using API.Data;

namespace GateWay.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : Controller
    {
        private readonly IUserRepo _repository;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly RabbitMQExtension _rabbitMQ = new RabbitMQExtension();

        public AuthController(IUserRepo repository, IMapper mapper, IConfiguration configuration)
        {
            _repository = repository;
            _mapper = mapper;
            _configuration = configuration;
        }

        [HttpGet]
        [Route("login")]
        public IActionResult Login(string email, string fullName)
        {
            //var email = decodeToken(token);
            var user = _repository.GetUserByEmail(email);

            if (user == null)
            {
                var prepared = new User
                {
                    FullName = fullName,
                    Email = email,
                    Roles = "user",
                };
                _repository.CreateUser(prepared);
                _repository.SaveChanges();

                return Ok(new
                {
                    code = HttpStatusCode.OK,
                    token = generateToken(email, prepared.Roles!),
                    user = prepared
                });
            }
            else
            {
                return Ok(new
                {
                    code = HttpStatusCode.OK,
                    token = generateToken(email, user.Roles!),
                    user
                });
            }
        }

        [HttpPost("refreshToken/{email}")]
        public IActionResult RefreshToken(string email)
        {
            //var email = decodeToken(token);
            var user = _repository.GetUserByEmail(email);
            if (user == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(new
                {
                    code = HttpStatusCode.OK,
                    token = generateToken(email, user.Roles!)
                });
            }
        }

        //[HttpGet("active/{email}")]
        //public IActionResult Active(string email)
        //{
        //    var user = _repository.GetUserByEmail(email);
        //    if (user == null)
        //    {
        //        return NotFound();
        //    }
        //    else
        //    {
        //        user.IsActive = true;
        //        _repository.SaveChanges();
        //        _rabbitMQ.MailProducer(new
        //        {
        //            type = "actived",
        //            email
        //        });
        //        return Ok(new
        //        {
        //            code = HttpStatusCode.Accepted,
        //            message = "Activated account"
        //        });
        //    }
        //}

        private string generateToken(string email, string role)
        {
            var handleer = new JwtSecurityTokenHandler();
            var secretKeyBytes = Encoding.UTF8.GetBytes(_configuration["AppSettings:SecretKey"]!);

            var tokenDetail = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Email, email),
                    new Claim(ClaimTypes.Role, role),
                    new Claim("TokenId", Guid.NewGuid().ToString())
                }),
                Expires = DateTime.UtcNow.AddMinutes(30),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(secretKeyBytes), SecurityAlgorithms.HmacSha512Signature)
            };

            var token = handleer.CreateToken(tokenDetail);

            return handleer.WriteToken(token);
        }

        private string decodeToken(string tokenString)
        {
            var handleer = new JwtSecurityTokenHandler();
            // parse the JWT token
            var token = handleer.ReadJwtToken(tokenString);
            // get the claims from the token
            var claims = token.Claims;
            // access individual claims by their names
            return claims.FirstOrDefault(c => c.Type == "email")?.Value!;
        }
    }
}

