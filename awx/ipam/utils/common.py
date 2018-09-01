
# All Rights Reserved.

# Python
import base64
import json
import yaml
import logging
import os
import re
import subprocess
import stat
import sys
import urllib
import urlparse
import threading
import contextlib
import tempfile
import six
import psutil
from functools import reduce
from StringIO import StringIO

from decimal import Decimal

# Decorator
from decorator import decorator

# Django
from django.core.exceptions import ObjectDoesNotExist
from django.db import DatabaseError
from django.utils.translation import ugettext_lazy as _
from django.db.models.fields.related import ForeignObjectRel, ManyToManyField
from django.db.models.query import QuerySet
from django.db.models import Q

# Django REST Framework
from rest_framework.exceptions import ParseError, PermissionDenied
from django.utils.encoding import smart_str
from django.utils.text import slugify
from django.apps import apps

logger = logging.getLogger('awx.ipam.utils')



# def demo():
# 	return { "demo": "test" }