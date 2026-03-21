from django.shortcuts import get_object_or_404, render
from django.db.models import Q
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Post, Profile, Like, Comment
from .serializers import (
    UserSerializer,
    PostSerializer,
    ProfileSerializer,
    CommentSerializer,
)


class PostFeedList(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        following_ids = user.profile.following.values_list("user_id", flat=True)
        return Post.objects.filter(
            Q(author_id__in=following_ids) | Q(author=user)
        ).distinct()


class PostListCreate(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Post.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class PostDetailUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Post.objects.filter(author=self.request.user)


class ProfileUpdate(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile


class CreateUser(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class FollowUnfollowView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        if request.user.id == pk:
            return Response(
                {"error": "You cannot follow yourself."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        target_profile = get_object_or_404(Profile, user_id=pk)
        my_profile = request.user.profile

        if my_profile.following.filter(id=target_profile.id).exists():
            my_profile.following.remove(target_profile)
            return Response({"message": "Unfollowed"}, status=status.HTTP_200_OK)

        my_profile.following.add(target_profile)
        return Response({"message": "Followed"}, status=status.HTTP_201_CREATED)


class LikeToggleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        post_obj = get_object_or_404(Post, id=pk)
        user = request.user

        like_qs = Like.objects.filter(post=post_obj, user=user)

        if like_qs.exists():
            like_qs.delete()
            return Response(
                {"message": "Post unliked", "likes_count": post_obj.likes.count()},
                status=status.HTTP_200_OK,
            )

        Like.objects.create(post=post_obj, user=user)
        return Response(
            {"message": "Post liked", "likes_count": post_obj.likes.count()},
            status=status.HTTP_201_CREATED,
        )


class CommentListCreate(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        post_id = self.kwargs.get("post_pk")
        return Comment.objects.filter(post_id=post_id)

    def perform_create(self, serializer):
        post_obj = get_object_or_404(Post, id=self.kwargs.get("post_pk"))
        serializer.save(author=self.request.user, post=post_obj)


class CommentDelete(generics.DestroyAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Comment.objects.filter(author=self.request.user)
