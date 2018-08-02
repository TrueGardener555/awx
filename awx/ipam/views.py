from django.shortcuts import render

from rest_framework import  viewsets
from awx.ipam.models import * # noqa
from awx.ipam.serializers import * # noqa

# Create your views here.



## ViewSets define the view behavior.
class IpamRirViewSet(viewsets.ModelViewSet):
    queryset = Rir.objects.all()
    serializer_class = IpamRirSerializer



class IpamVrfViewSet(viewsets.ModelViewSet):
    queryset = Vrf.objects.all()
    serializer_class = IpamVrfSerializer


class IpamDatacenterViewSet(viewsets.ModelViewSet):
    queryset = Datacenter.objects.all()
    serializer_class = IpamDatacenterSerializer


class IpamAggregateViewSet(viewsets.ModelViewSet):
    queryset = Aggregate.objects.all()
    serializer_class = IpamAggregateSerializer



class IpamPrefixViewSet(viewsets.ModelViewSet):
    queryset = Prefix.objects.all()
    serializer_class = IpamPrefixSerializer


class IpamIPAddressViewSet(viewsets.ModelViewSet):
    queryset = IPAddress.objects.all()
    serializer_class = IpamIPAddressSerializer



class IpamVlanViewSet(viewsets.ModelViewSet):
    queryset = Vlan.objects.all()
    serializer_class = IpamVlanSerializer




