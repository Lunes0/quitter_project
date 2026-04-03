import factory
from django.contrib.auth.models import User
from .models import Post, Profile, Comment, Like


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
        django_get_or_create = ("username",)
        skip_postgeneration_save = True

    username = factory.Sequence(lambda n: f"user_{n}")

    @factory.post_generation
    def password(self, create, extracted, **kwargs):
        if create:
            self.set_password("password123")
            self.save()

    @factory.post_generation
    def profile(self, create, extracted, **kwargs):
        if not create:
            return
        if not hasattr(self, "profile"):
            Profile.objects.create(user=self)


class ProfileFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Profile
        django_get_or_create = ("user",)

    user = factory.SubFactory(UserFactory)
    display_name = factory.Faker("name")
    bio = factory.Faker("sentence")


class PostFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Post

    author = factory.SubFactory(UserFactory)
    content = factory.Faker("paragraph", nb_sentences=3)


class CommentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Comment

    post = factory.SubFactory(PostFactory)
    author = factory.SubFactory(UserFactory)
    content = factory.Faker("sentence")


class LikeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Like

    post = factory.SubFactory(PostFactory)
    user = factory.SubFactory(UserFactory)
