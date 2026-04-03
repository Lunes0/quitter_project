from django.urls import path
from . import views

urlpatterns = [
    path("posts/", views.PostListCreate.as_view(), name="post-list"),
    path("posts/feed/", views.PostFeedList.as_view(), name="post-feed"),
    path("posts/<int:pk>/", views.PostDetailUpdateDelete.as_view(), name="post-detail"),
    path("profile/", views.ProfileUpdate.as_view(), name="profile-update"),
    path(
        "profile/<str:username>/",
        views.UserProfileDetail.as_view(),
        name="user-profile",
    ),
    path(
        "user/<int:pk>/follow/", views.FollowUnfollowView.as_view(), name="user-follow"
    ),
    path("posts/<int:pk>/like/", views.LikeToggleView.as_view(), name="post-like"),
    path(
        "posts/<int:post_pk>/comments/",
        views.CommentListCreate.as_view(),
        name="comment-list-create",
    ),
    path(
        "comments/<int:pk>/",
        views.CommentDetailUpdateDelete.as_view(),
        name="comment-detail",
    ),
    path(
        "comments/<int:pk>/like/",
        views.CommentLikeToggleView.as_view(),
        name="comment-like",
    ),
    path("users/search/", views.UserSearchList.as_view(), name="user-search"),
]
