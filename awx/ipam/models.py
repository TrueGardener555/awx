from __future__ import unicode_literals

from django.db import models

# Create your models here.
class Ipam(models.Model):
   pass

class Rir(Ipam):
    rir_name = models.CharField(max_length=1024)
    rir_description = models.CharField(max_length=1024)
