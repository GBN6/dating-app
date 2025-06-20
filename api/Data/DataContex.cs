using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext(DbContextOptions options) : IdentityDbContext<AppUser, AppRole, int, IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>>(options)
{
    public DbSet<UserLike> Likes { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<Photo> Photos { get; set; }
    public DbSet<Group> Groups { get; set; }
    public DbSet<Connection> Connections { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<AppUser>().HasMany(ur => ur.UserRoles)
            .WithOne(ur => ur.User)
            .HasForeignKey(ur => ur.UserId)
            .IsRequired();

        builder.Entity<AppRole>().HasMany(ur => ur.UserRoles)
            .WithOne(ur => ur.Role)
            .HasForeignKey(ur => ur.RoleId)
            .IsRequired();

        builder.Entity<UserLike>().HasKey(key => new { key.SourceUserId, key.TargetUserId });

        builder.Entity<UserLike>().HasOne(source => source.SourceUser).WithMany(like => like.LikedUsers).HasForeignKey(source => source.SourceUserId).OnDelete(DeleteBehavior.Cascade);
        builder.Entity<UserLike>().HasOne(source => source.TargetUser).WithMany(like => like.LikedByUsers).HasForeignKey(source => source.TargetUserId).OnDelete(DeleteBehavior.NoAction);

        builder.Entity<Message>().HasOne(source => source.Recipient).WithMany(message => message.MessagesReceived).OnDelete(DeleteBehavior.Restrict);
        builder.Entity<Message>().HasOne(source => source.Sender).WithMany(message => message.MessagesSent).OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Photo>().HasQueryFilter(p => p.IsApproved);
    }
}
