
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
from collections import OrderedDict
from datetime import timedelta



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


# Load environment
CURRENT = os.path.abspath(os.path.dirname(__file__))
_BASE_DIR = os.path.abspath(os.path.join(CURRENT, ".."))
DIR_INFRASTRUCTURES = "%s/ipam_sources/infrastructures" % (_BASE_DIR)
DIR_RESOURCES = "%s/ipam_sources/resources" % (_BASE_DIR)


def infrastructure_api_source():

    data = OrderedDict()
    _directories = os.listdir( DIR_INFRASTRUCTURES )
    for _directory in _directories:
        data[_directory] = OrderedDict()
        _files = os.listdir( "%s/%s"  % ( DIR_INFRASTRUCTURES, _directory ) )

        data[_directory]['count'] = len(_files)
        data[_directory]['results'] = []
        data[_directory]['related'] = OrderedDict()
        for _file in _files:
            voutput = from_yml_get_related( "%s/%s/%s"  % ( DIR_INFRASTRUCTURES, _directory, _file ) )

            data[_directory]['results'].append(voutput['id'])
            data[_directory]['related'][voutput['id']] =  voutput



    # data['providers'] = OrderedDict()
    # data['storages'] = OrderedDict()
    # data['networks'] = OrderedDict()
    # data['CURRENT'] = CURRENT
    # data['_BASE_DIR'] = _BASE_DIR
    # data['DIR_INFRASTRUCTURES'] = os.listdir( DIR_INFRASTRUCTURES )
    # data['DIR_RESOURCES'] = os.listdir( DIR_RESOURCES )

    return data





def from_yml_get_related(src_path):


    data_loaded = {'id': '--'}
    with open(src_path, 'r') as stream:
        try:
            data_loaded = yaml.load(stream)
            data_loaded['id'] = slugify(data_loaded['name'])
        except yaml.YAMLError as exc:
            print(exc)
    # pass
    return data_loaded




