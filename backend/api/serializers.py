from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Post, Profile, Comment, Like


class ProfileSerializer(serializers.ModelSerializer):
    following_count = serializers.ReadOnlyField(source="following.count")
    followers_count = serializers.ReadOnlyField(source="followers.count")

    class Meta:
        model = Profile
        fields = ["avatar", "display_name", "bio", "following_count", "followers_count"]


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "password", "profile"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source="author.username")
    author_avatar = serializers.ReadOnlyField(source="author.profile.avatar.url")
    author_display_name = serializers.ReadOnlyField(
        source="author.profile.display_name"
    )
    is_liked = serializers.SerializerMethodField()
    likes_count = serializers.ReadOnlyField(source="likes.count")
    comments_count = serializers.ReadOnlyField(source="comments.count")

    class Meta:
        model = Post
        fields = [
            "id",
            "author_username",
            "author_display_name",
            "author_avatar",
            "content",
            "created_at",
            "updated_at",
            "likes_count",
            "comments_count",
            "is_liked",
        ]
        read_only_fields = ["created_at", "updated_at"]

    def get_is_liked(self, obj):
        user = self.context.get("request").user
        if user.is_authenticated:
            return obj.likes.filter(user=user).exists()
        return False


class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source="author.username")

    class Meta:
        model = Comment
        fields = ["id", "author_username", "content", "created_at"]


class LikeSerializer(serializers.ModelSerializer):
    user_username = serializers.ReadOnlyField(source="user.username")

    class Meta:
        model = Like
        fields = ["id", "user", "user_username", "post", "created_at"]
        read_only_fields = ["user"]
