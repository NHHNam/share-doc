using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using API.Models;

namespace API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Comments> Comments { get; set; }
        public DbSet<BlackList> BlackLists { get; set; }
        public DbSet<ShareDocumentDetail> ShareDocumentDetails { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Product>()
                .HasOne(e => e.User)
                .WithMany(e => e.products)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_Product_User");

            modelBuilder.Entity<Product>()
                .HasOne(e => e.Category)
                .WithMany(e => e.products)
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_Product_Category");

            modelBuilder.Entity<Comments>()
                .HasOne(e => e.Product)
                .WithMany(p => p.comments)
                .HasForeignKey(e => e.ProductId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_Product_Comments");

            modelBuilder.Entity<Comments>()
                .HasOne(e => e.User)
                .WithMany(u => u.comments)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_Comments_UserId");

            modelBuilder.Entity<ShareDocumentDetail>()
            .HasOne(e => e.User)
            .WithMany(u => u.shareDocumentDetails)
            .HasForeignKey(c => c.idUser)
            .HasConstraintName("FK_ShareDocumentDetail_User");

            modelBuilder.Entity<ShareDocumentDetail>()
            .HasOne(e => e.Product)
            .WithMany(u => u.shareDocumentDetails)
            .HasForeignKey(c => c.idProduct)
            .HasConstraintName("FK_ShareDocumentDetail_Product");
        }
    }
}