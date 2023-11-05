using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using API.Data;
using API.Dtos;
using API.Models;
using System.Net;

namespace API.Controllers
{
    [ApiController]
    [Route("api/blacklist")]
    public class BlackListController : ControllerBase
    {
        private readonly IBlackList _repository;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;

        public BlackListController(IBlackList repository, IMapper mapper, IConfiguration configuration)
        {
            _repository = repository;
            _mapper = mapper;
            _configuration = configuration;
        }

        [HttpPost]
        public IActionResult Add(BlackListCreateDTO bl)
        {
            try
            {
                var newBL = _mapper.Map<BlackList>(bl);
                _repository.CreateBlackList(newBL);
                _repository.SaveChanges();
                return Ok(new
                {
                    status = HttpStatusCode.Created,
                    metadata = newBL
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            try
            {
                var products = _repository.GetAllBlackList();
                return Ok(new
                {
                    status = HttpStatusCode.OK,
                    metadata = products
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            try
            {
                var product = _repository.GetBlackListByIdProduct(id);
                return Ok(new
                {
                    stattus = HttpStatusCode.OK,
                    metadata = product
                });
            }
            catch (Exception ex)
            {
                return Ok(new
                {
                    status = HttpStatusCode.BadRequest,
                    message = ex.Message
                });
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                var Bl = _repository.GetBlackListById(id);
                if (Bl == null)
                {
                    throw new ArgumentNullException();
                }

                _repository.DeleteBlackList(Bl);
                _repository.SaveChanges();

                return Ok(new
                {
                    status = HttpStatusCode.OK,
                    metadata = "Delete successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("product/{id}")]
        public IActionResult DeleteByProductId(int id)
        {
            try
            {
                var Bl = _repository.GetBlackListByIdProduct(id);

                if (Bl != null)
                {
                    _repository.DeleteBlackList(Bl);
                    _repository.SaveChanges();

                    return Ok(new
                    {
                        status = HttpStatusCode.OK,
                        metadata = "Delete successfully"
                    });
                }

                return Ok(new
                {
                    status = HttpStatusCode.OK,
                    metadata = "Delete successfully"
                });

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}

