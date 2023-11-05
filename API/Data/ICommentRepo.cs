using System;
using API.Models;

namespace API.Data
{
    public interface ICommentRepo
    {
        bool SaveChanges();
        IEnumerable<Comments> GetAllComments();
        Comments GetCommentById(int id);

        IEnumerable<Comments> GetAllCommentsByUser(int id);

        void DeleteCommentByPoductId(int idProduct);
        void DeleteCommentByUserId(int idUser);

        void CreateDoc(Comments comment);
        void DeleteDoc(Comments comment);
    }
}

