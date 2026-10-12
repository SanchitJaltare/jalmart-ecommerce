import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = "Create a superuser from environment variables"

    def handle(self, *args, **options):
        User = get_user_model()

        username = os.environ.get("DJANGO_ADMIN_USERNAME")
        email = os.environ.get("DJANGO_ADMIN_EMAIL")
        password = os.environ.get("DJANGO_ADMIN_PASSWORD")

        if not all([username, email, password]):
            raise RuntimeError("Admin environment variables are missing.")

        user, created = User.objects.get_or_create(
            username=username,
            defaults={"email": email},
        )

        user.is_staff = True
        user.is_superuser = True
        user.email = email
        user.set_password(password)
        user.save()

        self.stdout.write(self.style.SUCCESS("Admin account ready."))