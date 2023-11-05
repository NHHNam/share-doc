using System;
using API.Models;

namespace API.Data
{
    public class CommentRepo : ICommentRepo
    {
        private readonly AppDbContext _context;

        public CommentRepo(AppDbContext context)
        {
            _context = context;
        }

        public void CreateDoc(Comments comment)
        {
            if (comment == null)
            {
                throw new ArgumentNullException("Comment is null");
            }
            _context.Comments.Add(comment);
        }

        public void DeleteCommentByPoductId(int idProduct)
        {
            var comments = _context.Comments.Where(c => c.ProductId == idProduct);
            _context.Comments.RemoveRange(comments);
        }

        public void DeleteCommentByUserId(int idUser)
        {
            var comments = _context.Comments.Where(c => c.UserId == idUser);
            _context.Comments.RemoveRange(comments);
        }

        public void DeleteDoc(Comments comment)
        {
            _context.Remove(comment);
        }

        public IEnumerable<Comments> GetAllComments()
        {
            return _context.Comments.ToList();
        }

        public IEnumerable<Comments> GetAllCommentsByUser(int id)
        {
            return _context.Comments.Where(c => c.UserId == id).ToList();
        }

        public Comments GetCommentById(int id)
        {
            return _context.Comments.Where(c => c.Id == id).FirstOrDefault();
        }

        public bool SaveChanges()
        {
            return (_context.SaveChanges() >= 0);
        }
    }
}

