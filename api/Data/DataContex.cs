using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace API.Data;

public class DataContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<AppUser> Users { get; set; }
    public DbSet<UserLike> Likes { get; set; }
    public DbSet<Message> Messages { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<UserLike>().HasKey(key => new { key.SourceUserId, key.TargetUserId });

        builder.Entity<UserLike>().HasOne(source => source.SourceUser).WithMany(like => like.LikedUsers).HasForeignKey(source => source.SourceUserId).OnDelete(DeleteBehavior.Cascade);
        builder.Entity<UserLike>().HasOne(source => source.TargetUser).WithMany(like => like.LikedByUsers).HasForeignKey(source => source.TargetUserId).OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Message>().HasOne(source => source.Recipient).WithMany(message => message.MessagesReceived).OnDelete(DeleteBehavior.Restrict);
        builder.Entity<Message>().HasOne(source => source.Sender).WithMany(message => message.MessagesSent).OnDelete(DeleteBehavior.Restrict);
    }
}
