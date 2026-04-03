from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    avatar = models.ImageField(
        upload_to="avatars/%Y/%m/", default="default.png", blank=True
    )
    display_name = models.CharField(max_length=100, blank=True)
    bio = models.TextField(max_length=160, blank=True)
    following = models.ManyToManyField(
        "self", symmetrical=False, related_name="followers", blank=True
    )

    def __str__(self):
        if self.user:
            return f"@{self.user.username}"
        return "Profile without user"


class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    content = models.TextField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.author.username}: {self.content[:20]}..."

    @property
    def likes_count(self):
        return self.likes.count()


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(max_length=280)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created_at"]

    @property
    def likes_count(self):
        return self.likes.count()


class Like(models.Model):
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name="likes", null=True, blank=True
    )
    comment = models.ForeignKey(
        Comment, on_delete=models.CASCADE, related_name="likes", null=True, blank=True
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["post", "user"],
                name="unique_post_like",
                condition=models.Q(post__isnull=False),
            ),
            models.UniqueConstraint(
                fields=["comment", "user"],
                name="unique_comment_like",
                condition=models.Q(comment__isnull=False),
            ),
        ]

    def clean(self):
        from django.core.exceptions import ValidationError

        if not self.post and not self.comment:
            raise ValidationError(
                "A like must be associated with either a post or a comment."
            )
        if self.post and self.comment:
            raise ValidationError(
                "A like cannot be associated with both a post and a comment."
            )

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
