# python
import copy
import json
import logging
import operator
import re
import six
import urllib
from collections import OrderedDict
from datetime import timedelta



# Django
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ObjectDoesNotExist, ValidationError as DjangoValidationError
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.utils.encoding import force_text
from django.utils.text import capfirst
from django.utils.timezone import now
from django.utils.functional import cached_property



from awx.main.utils import (
    get_type_for_model, get_model_for_type, timestamp_apiformat,
    camelcase_to_underscore, getattrd, parse_yaml_or_json,
    has_model_field_prefetched, extract_ansible_vars, encrypt_dict,
    prefetch_page_capabilities)





from awx.main.utils.filters import SmartFilter
from awx.main.redact import REPLACE_STR

from awx.main.validators import vars_validate_or_raise

from awx.conf.license import feature_enabled
from awx.api.versioning import reverse, get_request_version
from awx.api.fields import (BooleanNullField, CharNullField, ChoiceNullField,
                            VerbatimField, DeprecatedCredentialField)


# DRF

from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework import fields
from rest_framework import serializers
from rest_framework import validators
from rest_framework.utils.serializer_helpers import ReturnList

from rest_framework import serializers
from awx.ipam.models import *


from awx.ipam.views import *
from awx.main.views import *
# from awx.api.urls import *


def reverse_gfk(content_object, request):
    '''
    Computes a reverse for a GenericForeignKey field.

    Returns a dictionary of the form
        { '<type>': reverse(<type detail>) }
    for example
        { 'organization': '/api/v1/organizations/1/' }
    '''
    if content_object is None or not hasattr(content_object, 'get_absolute_url'):
        return {}

    return {
        camelcase_to_underscore(content_object.__class__.__name__): content_object.get_absolute_url(request=request)
    }




class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    A ModelSerializer that takes an additional `fields` argument that
    controls which fields should be displayed.
    """

    def __init__(self, *args, **kwargs):
        # Don't pass the 'fields' arg up to the superclass
        fields = kwargs.pop('fields', None)

        # Instantiate the superclass normally
        super(DynamicFieldsModelSerializer, self).__init__(*args, **kwargs)

        if fields is not None:
            # Drop any fields that are not specified in the `fields` argument.
            allowed = set(fields)
            existing = set(self.fields)
            # for field_name in existing - allowed:
            for field_name in existing:
                self.fields.pop(field_name)

            if 'id' not in self.fields:
                self.fields.pop('id')






class BaseSerializerMetaclass(serializers.SerializerMetaclass):
    '''
    Custom metaclass to enable attribute inheritance from Meta objects on
    serializer base classes.

    Also allows for inheriting or updating field lists from base class(es):

        class Meta:

            # Inherit all fields from base class.
            fields = ('*',)

            # Inherit all fields from base class and add 'foo'.
            fields = ('*', 'foo')

            # Inherit all fields from base class except 'bar'.
            fields = ('*', '-bar')

            # Define fields as 'foo' and 'bar'; ignore base class fields.
            fields = ('foo', 'bar')

            # Extra field kwargs dicts are also merged from base classes.
            extra_kwargs = {
                'foo': {'required': True},
                'bar': {'read_only': True},
            }

            # If a subclass were to define extra_kwargs as:
            extra_kwargs = {
                'foo': {'required': False, 'default': ''},
                'bar': {'label': 'New Label for Bar'},
            }

            # The resulting value of extra_kwargs would be:
            extra_kwargs = {
                'foo': {'required': False, 'default': ''},
                'bar': {'read_only': True, 'label': 'New Label for Bar'},
            }

            # Extra field kwargs cannot be removed in subclasses, only replaced.

    '''

    @staticmethod
    def _is_list_of_strings(x):
        return isinstance(x, (list, tuple)) and all([isinstance(y, basestring) for y in x])

    @staticmethod
    def _is_extra_kwargs(x):
        return isinstance(x, dict) and all([isinstance(k, basestring) and isinstance(v, dict) for k,v in x.items()])

    @classmethod
    def _update_meta(cls, base, meta, other=None):
        for attr in dir(other):
            if attr.startswith('_'):
                continue
            val = getattr(other, attr)
            meta_val = getattr(meta, attr, None)
            # Special handling for lists/tuples of strings (field names).
            if cls._is_list_of_strings(val) and cls._is_list_of_strings(meta_val or []):
                meta_val = meta_val or []
                new_vals = []
                except_vals = []
                if base: # Merge values from all bases.
                    new_vals.extend([x for x in meta_val])
                for v in val:
                    if not base and v == '*': # Inherit all values from previous base(es).
                        new_vals.extend([x for x in meta_val])
                    elif not base and v.startswith('-'): # Except these values.
                        except_vals.append(v[1:])
                    else:
                        new_vals.append(v)
                val = []
                for v in new_vals:
                    if v not in except_vals and v not in val:
                        val.append(v)
                val = tuple(val)
            # Merge extra_kwargs dicts from base classes.
            elif cls._is_extra_kwargs(val) and cls._is_extra_kwargs(meta_val or {}):
                meta_val = meta_val or {}
                new_val = {}
                if base:
                    for k,v in meta_val.items():
                        new_val[k] = copy.deepcopy(v)
                for k,v in val.items():
                    new_val.setdefault(k, {}).update(copy.deepcopy(v))
                val = new_val
            # Any other values are copied in case they are mutable objects.
            else:
                val = copy.deepcopy(val)
            setattr(meta, attr, val)

    def __new__(cls, name, bases, attrs):
        meta = type('Meta', (object,), {})
        for base in bases[::-1]:
            cls._update_meta(base, meta, getattr(base, 'Meta', None))
        cls._update_meta(None, meta, attrs.get('Meta', meta))
        attrs['Meta'] = meta
        return super(BaseSerializerMetaclass, cls).__new__(cls, name, bases, attrs)


class BaseSerializer(serializers.ModelSerializer):

    __metaclass__ = BaseSerializerMetaclass

    class Meta:
        fields = ('id', 'type', 'url',
                  'name', 'description')
        summary_fields = ()
        summarizable_fields = ()

    # add the URL and related resources
    type           = serializers.SerializerMethodField()
    url            = serializers.CharField(source='get_absolute_url', read_only=True)
    # url            = serializers.SerializerMethodField()
    # related        = serializers.SerializerMethodField()
    # summary_fields = serializers.SerializerMethodField()

    # make certain fields read only
    # created       = serializers.SerializerMethodField()
    # modified      = serializers.SerializerMethodField()


    def get_type(self, obj):
        return get_type_for_model(self.Meta.model)

    def get_url(self, obj):
        if obj is None or not hasattr(obj, 'get_absolute_url'):
            return ''
        elif isinstance(obj, User):
            return self.reverse('api:user_detail', kwargs={'pk': obj.pk})
        else:
            return obj.get_absolute_url(request=self.context.get('request'))


# Serializers define the API representation.
class IpamRirSerializer(BaseSerializer):
    class Meta:
        model = Rir
        fields = '__all__'
        # fields = ('*','-description')


class IpamVrfSerializer(BaseSerializer):
    
    # url = serializers.HyperlinkedIdentityField(view_name='vrfs', lookup_field='slug')

    class Meta:
        model = Vrf
        fields = '__all__'
        # fields = ('url', 'name', 'description', 'rd', 'enforce_unique')
        

class IpamDatacenterSerializer(BaseSerializer):

    # providers = serializers.RelatedField(many=True,read_only=True)

    class Meta:
        model = Datacenter
        fields = '__all__'
        # fields = ('name', 'description', 
        #   'site', 'location', 'facility', 'physical_address', 
        #   'shipping_address', 'contact_name', 'contact_phone', 
        #   'contact_email', 'comments'
        #   )


class IpamAggregateSerializer(BaseSerializer):
    class Meta:
        model = Aggregate
        fields = '__all__'
        # fields = ( 'family', 'rir', 'date_added', 'description',
        #   )


class IpamPrefixSerializer(BaseSerializer):
    class Meta:
        model = Prefix
        fields = '__all__'
        # fields = ('prefix', 'description', 
        #   'vrf', 'family', 'datacenter', 'vrf', 'is_pool',
        #   )


class IpamIPAddressSerializer(BaseSerializer):
    class Meta:
        model = IPAddress
        fields = '__all__'
        # fields = ('address', 'description', 
        #   'vrf', 'family', 'datacenter', 'status',
        #   )



class IpamVlanSerializer(BaseSerializer):
    class Meta:
        model = Vlan
        fields = '__all__'
        # fields = ('name', 'description', 
        #   'vid', 'status',
        #   )




class IpamProviderSerializer(BaseSerializer):

    artifacts = serializers.JSONField(default={})
    opts = serializers.JSONField(default={})
    hosts = serializers.JSONField(default={})
    svc_enabled = serializers.JSONField(default={})
    requirements = serializers.JSONField(default={})
    security = serializers.JSONField(default={})
    # url = serializers.CharField(source='get_absolute_url', read_only=True)
    # groups = serializers.PrimaryKeyRelatedField(many=True)
    # datacenter = serializers.HyperlinkedRelatedField(queryset=Datacenter.objects.all())
    # datacenter = serializers.HyperlinkedRelatedField(view_name='ipam_provider-list', lookup_field='providers', read_only=True)
    # datacenters = serializers.RelatedField(many=True,read_only=True)

    class Meta:
        model = Provider
        fields = '__all__'
        # fields = ('id', 'name', 'description', 
        #   'url', 'token', 'username', 'password', 'hosts', 'artifacts', 
        #   'scm_type', 'scm_url', 'scm_branch', 'scm_revision', 'svc_enabled', 'security', 
        #   'requirements', 'opts', 'source', 'credential', 'datacenter',
        #   )














