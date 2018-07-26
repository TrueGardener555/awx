
from rest_framework import serializers
from awx.ipam.models import *



# Serializers define the API representation.
class IpamRirSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Rir
        fields = ('name', 'description')
