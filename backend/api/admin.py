from django.contrib import admin
from .models import Post, Profile, Comment, Like


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "display_name"]
    search_fields = ["user__username", "display_name"]


admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Like)
