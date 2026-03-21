from django.urls import path
from . import views

urlpatterns = [
    path("api/user/register/", views.CreateUser.as_view(), name="register"),
    path("posts/", views.PostListCreate.as_view(), name="post-list"),
    path("posts/feed/", views.PostFeedList.as_view(), name="post-feed"),
    path("posts/<int:pk>/", views.PostDetailUpdateDelete.as_view(), name="post-detail"),
    path("profile/", views.ProfileUpdate.as_view(), name="profile-update"),
    path(
        "user/<int:pk>/follow/", views.FollowUnfollowView.as_view(), name="user-follow"
    ),
    path("posts/<int:pk>/like/", views.LikeToggleView.as_view(), name="post-like"),
    path(
        "posts/<int:post_pk>/comments/",
        views.CommentListCreate.as_view(),
        name="comment-list-create",
    ),
    path("comments/<int:pk>/", views.CommentDelete.as_view(), name="comment-delete"),
]
