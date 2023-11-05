using System.Net;
using API.Data;
using API.Dtos;
using API.Models;
using AutoMapper;

using Microsoft.AspNetCore.Mvc;

namespace GateWay.Controllers
{
    [ApiController]
    [Route("api/comment")]

    public class CommentController : Controller
    {
        private readonly ICommentRepo _repository;
        private readonly IMapper _mapper;

        public CommentController(ICommentRepo commentRepo, IMapper mapper)
        {
            _repository = commentRepo;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult getAllComments()
        {
            var comments = _repository.GetAllComments();

            return Ok(new
            {
                code = HttpStatusCode.OK,
                metadata = comments
            });
        }

        [HttpGet("user/{id:int}")]
        public IActionResult getCommentByUserId(int id)
        {
            var comments = _repository.GetAllCommentsByUser(id);

            return Ok(comments);
        }

        [HttpGet("{id:int}", Name = "getCommentById")]
        public IActionResult getCommentById(int id)
        {
            var comments = _repository.GetCommentById(id);

            if (comments == null)
            {
                return NoContent();
            }

            return Ok(new
            {
                code = HttpStatusCode.OK,
                metadata = comments
            });
        }

        [HttpPost]
        public IActionResult CreateComment(CommentCreateDTO request)
        {
            var comment = _mapper.Map<Comments>(request);
            _repository.CreateDoc(comment);
            _repository.SaveChanges();

            var result = _mapper.Map<CommentReadDTO>(comment);
            return CreatedAtRoute(nameof(getCommentById), new { Id = result.Id }, result);
        }

        [HttpPut("{id:int}")]
        public IActionResult UpdateComment(int id, CommentReadDTO request)
        {
            var comment = _repository.GetCommentById(id);
            if (comment == null)
            {
                return NotFound();
            }

            comment.Comment = request.Comment;
            comment.ProductId = request.ProductId;
            comment.UpdatedAt = request.UpdatedAt;
            _repository.SaveChanges();

            var result = _mapper.Map<CommentReadDTO>(comment);
            return CreatedAtRoute(nameof(getCommentById), new { Id = result.Id }, result);
        }

        [HttpDelete("{id:int}")]
        public IActionResult DeleteComment(int id)
        {

            _repository.DeleteCommentByPoductId(id);
            _repository.SaveChanges();

            return Ok(new
            {
                code = HttpStatusCode.NoContent,
                message = "Delete comment successfuly"
            });
        }

        [HttpDelete("user/{id:int}")]
        public IActionResult DeleteCommentByUserId(int id)
        {

            _repository.DeleteCommentByUserId(id);
            _repository.SaveChanges();

            return Ok(new
            {
                code = HttpStatusCode.NoContent,
                message = "Delete comment successfuly"
            });
        }
    }
}

