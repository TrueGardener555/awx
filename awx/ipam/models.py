from __future__ import unicode_literals

from django.db import models

# Create your models here.

class Rir(models.Model):
    name = models.CharField(max_length=1024)
    description = models.CharField(max_length=1024)



class Vrf(models.Model):
    name = models.CharField(max_length=1024)
    description = models.CharField(max_length=1024)
