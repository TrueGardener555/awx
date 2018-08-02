
from rest_framework import serializers
from awx.ipam.models import *



# Serializers define the API representation.
class IpamRirSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Rir
        fields = ('name', 'description')


class IpamVrfSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Vrf
        fields = ('name', 'description', 'rd', 'enforce_unique')
        

class IpamDatacenterSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Datacenter
        fields = ('name', 'description', 
        	'site', 'location', 'facility', 'physical_address', 
        	'shipping_address', 'contact_name', 'contact_phone', 
        	'contact_email', 'comments'
        	)


class IpamAggregateSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Aggregate
        fields = ( 'family', 'rir', 'date_added', 'description',
        	)


class IpamPrefixSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Prefix
        fields = ('prefix', 'description', 
        	'vrf', 'family', 'datacenter', 'vrf', 'is_pool',
        	)


class IpamIPAddressSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = IPAddress
        fields = ('address', 'description', 
        	'vrf', 'family', 'datacenter', 'status',
        	)



class IpamVlanSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Vlan
        fields = ('name', 'description', 
        	'vid', 'status',
        	)







