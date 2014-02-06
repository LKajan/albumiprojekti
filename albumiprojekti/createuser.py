import os, sys
from django.db import models


if __name__ == '__main__':
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "albumiprojekti.settings")

    from django.contrib.auth.models import User
    u = User.objects.get(username='Tester')
    u.set_password('tester')
    u.save()

    # testuser = User.objects.create_user('Tester', 'tester.tetson@aalto.fi', 'tester', first_name="Tester", last_name="Tetson")
    # testuser.save()
