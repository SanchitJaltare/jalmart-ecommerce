
import os
from django.db import migrations
from django.contrib.auth.hashers import make_password


def create_admin(apps, schema_editor):
    User = apps.get_model("auth", "User")

    username = os.environ.get("DJANGO_ADMIN_USERNAME")
    email = os.environ.get("DJANGO_ADMIN_EMAIL")
    password = os.environ.get("DJANGO_ADMIN_PASSWORD")

    if not all([username, email, password]):
        raise RuntimeError(
            "DJANGO_ADMIN_USERNAME, DJANGO_ADMIN_EMAIL, "
            "and DJANGO_ADMIN_PASSWORD must be configured."
        )

    database = schema_editor.connection.alias

    user, created = User.objects.using(database).get_or_create(
        username=username,
        defaults={"email": email},
    )

    user.email = email
    user.is_staff = True
    user.is_superuser = True
    user.password = make_password(password)

    user.save(
        using=database,
        update_fields=[
            "email",
            "is_staff",
            "is_superuser",
            "password",
        ],
    )


class Migration(migrations.Migration):

    dependencies = [
        ("store", "0005_productreview"),
    ]

    operations = [
        migrations.RunPython(
            create_admin,
            migrations.RunPython.noop,
        ),
    ]
