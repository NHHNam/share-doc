
using API.Data;
using API.Dtos;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace API.Controllers
{
    [ApiController]
    [Route("api/sharedocument")]
    public class ShareDocumentDetailController : ControllerBase
    {
        private readonly IShareDocumentDetailRepo _repository;
        private readonly IMapper _mapper;
        public ShareDocumentDetailController(IShareDocumentDetailRepo shareDocumentDetailRepo, IMapper mapper)
        {
            _repository = shareDocumentDetailRepo;
            _mapper = mapper;
        }

        #region get

        [HttpGet("{id:int}", Name = "GetById")]
        public ActionResult<ShareProductDetailReadDTO> GetById(int id)
        {
            var doc = _repository.GetById(id);
            if (doc != null)
            {
                return Ok(doc);
            }
            return NotFound();
        }

        [HttpGet("user/{id:int}")]
        public ActionResult<ShareProductDetailReadDTO> GetByUserId(int id)
        {
            var doc = _repository.GetByUserId(id);
            if (doc != null)
            {
                return Ok(doc);
            }
            return NotFound();
        }

        #endregion

        #region Create

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> CreateDetail(ShareProductDetailCreateDTO request)
        {

            var detail = new ShareDocumentDetail()
            {
                idUser = request.idUser,
                idProduct = request.idProduct
            };

            _repository.CreateDoc(detail);
            _repository.SaveChanges();

            return Ok();
        }

        #endregion

        #region Delete

        [HttpDelete("product/{id}")]
        public IActionResult DeleteByProductId(int id)
        {
            try
            {
                _repository.DeleteByProductIdd(id);
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

        #endregion
    }
}

