from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Post, Profile, Comment, Like


class ProfileSerializer(serializers.ModelSerializer):
    following_count = serializers.ReadOnlyField(source="following.count")
    followers_count = serializers.ReadOnlyField(source="followers.count")
    avatar = serializers.ImageField(required=False, allow_null=True)

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
    author_avatar = serializers.SerializerMethodField()
    author_display_name = serializers.ReadOnlyField(
        source="author.profile.display_name"
    )
    is_liked = serializers.SerializerMethodField()
    is_edited = serializers.SerializerMethodField()
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
            "is_edited",
        ]
        read_only_fields = ["created_at", "updated_at"]

    def get_author_avatar(self, obj):
        try:
            if obj.author.profile.avatar:
                return obj.author.profile.avatar.url
        except ValueError:
            return None
        return None

    def get_is_liked(self, obj):
        user = self.context.get("request").user
        if user.is_authenticated:
            return obj.likes.filter(user=user).exists()
        return False

    def get_is_edited(self, obj):
        diff = obj.updated_at - obj.created_at
        return diff.total_seconds() > 1


class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source="author.username")
    author_avatar = serializers.SerializerMethodField()
    author_display_name = serializers.ReadOnlyField(
        source="author.profile.display_name"
    )
    is_liked = serializers.SerializerMethodField()
    is_edited = serializers.SerializerMethodField()
    likes_count = serializers.ReadOnlyField(source="likes.count")

    class Meta:
        model = Comment
        fields = [
            "id",
            "author_username",
            "author_avatar",
            "author_display_name",
            "content",
            "created_at",
            "updated_at",
            "likes_count",
            "is_liked",
            "is_edited",
        ]

    def get_is_edited(self, obj):
        diff = obj.updated_at - obj.created_at
        return diff.total_seconds() > 1

    def get_author_avatar(self, obj):
        try:
            if obj.author.profile.avatar:
                return obj.author.profile.avatar.url
        except ValueError:
            return None
        return None

    def get_is_liked(self, obj):
        user = self.context.get("request").user
        if user.is_authenticated:
            return obj.likes.filter(user=user).exists()
        return False


class LikeSerializer(serializers.ModelSerializer):
    user_username = serializers.ReadOnlyField(source="user.username")

    class Meta:
        model = Like
        fields = ["id", "user", "user_username", "post", "created_at"]
        read_only_fields = ["user"]


class UserProfileSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    followers = serializers.SerializerMethodField()
    following = serializers.SerializerMethodField()
    posts = PostSerializer(many=True, read_only=True)
    is_following = serializers.SerializerMethodField()
    display_name = serializers.SerializerMethodField()
    bio = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "posts",
            "followers_count",
            "following_count",
            "followers",
            "following",
            "is_following",
            "display_name",
            "bio",
            "avatar",
        ]

    def get_followers_count(self, obj):
        return obj.profile.followers.count()

    def get_following_count(self, obj):
        return obj.profile.following.count()

    def get_is_following(self, obj):
        user = self.context.get("request").user
        if user.is_authenticated:
            return user.profile.following.filter(user=obj).exists()
        return False

    def get_followers(self, obj):
        return [
            {
                "username": profile.user.username,
                "display_name": profile.display_name or profile.user.username,
            }
            for profile in obj.profile.followers.all()
        ]

    def get_following(self, obj):
        return [
            {
                "username": profile.user.username,
                "display_name": profile.display_name or profile.user.username,
            }
            for profile in obj.profile.following.all()
        ]

    def get_display_name(self, obj):
        return obj.profile.display_name

    def get_bio(self, obj):
        return obj.profile.bio

    def get_avatar(self, obj):
        if obj.profile.avatar:
            return obj.profile.avatar.url
        return None
