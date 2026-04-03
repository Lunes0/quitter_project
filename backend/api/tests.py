from urllib import response

import pytest
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status

from .models import Profile, Comment
from .factories import (
    ProfileFactory,
    UserFactory,
    PostFactory,
    CommentFactory,
    LikeFactory,
)


@pytest.mark.django_db
class TestPostInteractions:
    def test_post_serialization_includes_counts(self, api_client):
        user = UserFactory()
        post = PostFactory(author=user)
        CommentFactory.create_batch(3, post=post)
        LikeFactory.create_batch(5, post=post)

        api_client.force_authenticate(user=user)
        url = reverse("post-list")
        response = api_client.get(url)

        post_data = response.data[0]
        assert post_data["likes_count"] == 5
        assert post_data["comments_count"] == 3

    def test_delete_own_post(self, api_client):
        me = UserFactory()
        other_user = UserFactory()
        my_post = PostFactory(author=me)
        other_post = PostFactory(author=other_user)

        api_client.force_authenticate(user=me)

        url_mine = reverse("post-detail", kwargs={"pk": my_post.id})
        response = api_client.delete(url_mine)
        assert response.status_code == status.HTTP_204_NO_CONTENT

        url_others = reverse("post-detail", kwargs={"pk": other_post.id})
        response = api_client.delete(url_others)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_comment_on_post(self, api_client):
        user = UserFactory()
        post = PostFactory()
        api_client.force_authenticate(user=user)

        url = reverse("comment-list-create", kwargs={"post_pk": post.id})
        payload = {"content": "Comment test"}

        response = api_client.post(url, payload)
        assert response.status_code == status.HTTP_201_CREATED
        assert post.comments.count() == 1

        response = api_client.get(url)
        assert len(response.data) == 1
        assert response.data[0]["content"] == "Comment test"

    def test_comment_delete_by_author(self, api_client):
        user = UserFactory()
        comment = CommentFactory(author=user)
        api_client.force_authenticate(user=user)

        url = reverse("comment-detail", kwargs={"pk": comment.id})
        response = api_client.delete(url)

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert Comment.objects.filter(id=comment.id).count() == 0

    def test_comment_update_by_author(self, api_client):
        user = UserFactory()
        comment = CommentFactory(author=user)
        api_client.force_authenticate(user=user)

        url = reverse("comment-detail", kwargs={"pk": comment.id})
        response = api_client.patch(url, {"content": "Updated comment"})

        assert response.status_code == status.HTTP_200_OK
        comment.refresh_from_db()
        assert comment.content == "Updated comment"

    def test_comment_update_sets_updated_at(self, api_client):
        user = UserFactory()
        comment = CommentFactory(author=user)
        api_client.force_authenticate(user=user)

        old_updated_at = comment.updated_at
        url = reverse("comment-detail", kwargs={"pk": comment.id})
        response = api_client.patch(url, {"content": "Updated comment"})

        assert response.status_code == status.HTTP_200_OK
        comment.refresh_from_db()
        assert comment.updated_at and comment.updated_at >= old_updated_at


@pytest.mark.django_db
class TestSocialInteractions:
    def test_like_toggle_functionality(self, api_client):
        user = UserFactory()
        post = PostFactory()
        api_client.force_authenticate(user=user)
        url = reverse("post-like", kwargs={"pk": post.id})

        response = api_client.post(url)
        assert response.status_code == status.HTTP_201_CREATED
        assert post.likes.count() == 1

        response = api_client.post(url)
        assert response.status_code == status.HTTP_200_OK
        assert post.likes.count() == 0

    def test_comment_like_toggle_functionality(self, api_client):
        user = UserFactory()
        comment = CommentFactory()
        api_client.force_authenticate(user=user)
        url = reverse("comment-like", kwargs={"pk": comment.id})

        response = api_client.post(url)
        assert response.status_code == status.HTTP_201_CREATED
        assert comment.likes.count() == 1

        response = api_client.post(url)
        assert response.status_code == status.HTTP_200_OK
        assert comment.likes.count() == 0

    def test_get_followers_and_following_count(self, api_client):
        me_profile = ProfileFactory()
        other_profile = ProfileFactory()

        Profile.objects.filter(id=me_profile.id).update(display_name="User1")
        Profile.objects.filter(id=other_profile.id).update(display_name="User2")

        me_profile.refresh_from_db()
        other_profile.refresh_from_db()
        me_profile.following.add(other_profile)

        api_client.force_authenticate(user=me_profile.user)
        url = reverse("profile-update")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["following_count"] == 1
        assert response.data["display_name"] == "User1"

    def test_cannot_follow_self(self, api_client):
        me = UserFactory()
        api_client.force_authenticate(user=me)

        url = reverse("user-follow", kwargs={"pk": me.id})
        response = api_client.post(url)
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestUserProfile:
    def test_profile_contains_user_posts(self, api_client):
        user = UserFactory()
        PostFactory.create_batch(3, author=user)

        api_client.force_authenticate(user=user)
        url = reverse("user-profile", kwargs={"username": user.username})
        response = api_client.get(url)

        assert response.status_code == 200
        assert len(response.data["posts"]) == 3

    def test_profile_avatar_upload(self, api_client):
        user = UserFactory()
        api_client.force_authenticate(user=user)
        url = reverse("profile-update")

        import io
        from PIL import Image

        file = io.BytesIO()
        img = Image.new("RGB", (100, 100), color="red")
        img.save(file, "jpeg")
        file.name = "test.jpg"
        file.seek(0)

        image = SimpleUploadedFile(file.name, file.read(), content_type="image/jpeg")
        response = api_client.patch(url, {"avatar": image}, format="multipart")

        assert response.status_code == status.HTTP_200_OK

    def test_update_profile_partial(self, api_client):
        profile = ProfileFactory(display_name="Old name", bio="Old bio")
        api_client.force_authenticate(user=profile.user)

        url = reverse("profile-update")
        payload = {"display_name": "New name", "bio": "New bio"}

        response = api_client.patch(url, payload)

        assert response.status_code == status.HTTP_200_OK
        profile.refresh_from_db()
        assert profile.display_name == "New name"
        assert profile.bio == "New bio"

    def test_get_user_profile_by_username(self, api_client):
        user = UserFactory(username="User")
        api_client.force_authenticate(user=user)

        url = reverse("user-profile", kwargs={"username": "User"})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["username"] == "User"

    def test_profile_not_found(self, api_client):
        user = UserFactory()
        api_client.force_authenticate(user=user)

        url = reverse("user-profile", kwargs={"username": "NonExistent"})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND
