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


class IpamProviderViewSet(viewsets.ModelViewSet):
    queryset = Provider.objects.all()
    serializer_class = IpamProviderSerializer

# Storage
class IpamStorageViewSet(viewsets.ModelViewSet):
    queryset = Storage.objects.all()
    serializer_class = IpamStorageSerializer

# Service
class IpamServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = IpamServiceSerializer

# Network
class IpamNetworkViewSet(viewsets.ModelViewSet):
    queryset = Network.objects.all()
    serializer_class = IpamNetworkSerializer


# App
class IpamAppViewSet(viewsets.ModelViewSet):
    queryset = App.objects.all()
    serializer_class = IpamAppSerializer

# Noc
class IpamNocViewSet(viewsets.ModelViewSet):
    queryset = Noc.objects.all()
    serializer_class = IpamNocSerializer


# Security
class IpamSecurityViewSet(viewsets.ModelViewSet):
    queryset = Security.objects.all()
    serializer_class = IpamSecuritySerializer


# PKI
class IpamPkiViewSet(viewsets.ModelViewSet):
    queryset = Pki.objects.all()
    serializer_class = IpamPkiSerializer



# Backup
class IpamBackupViewSet(viewsets.ModelViewSet):
    queryset = Backup.objects.all()
    serializer_class = IpamBackupSerializer


# Documentaton
class IpamDocumentationViewSet(viewsets.ModelViewSet):
    queryset = Documentation.objects.all()
    serializer_class = IpamDocumentationSerializer


# BareMetal
class IpamBareMetalViewSet(viewsets.ModelViewSet):
    queryset = BareMetal.objects.all()
    serializer_class = IpamBareMetalSerializer


# VirtualHost
class IpamVirtualHostViewSet(viewsets.ModelViewSet):
    queryset = VirtualHost.objects.all()
    serializer_class = IpamVirtualHostSerializer



# NetworkGear
class IpamNetworkGearViewSet(viewsets.ModelViewSet):
    queryset = NetworkGear.objects.all()
    serializer_class = IpamNetworkGearSerializer


# Registry
class IpamRegistryViewSet(viewsets.ModelViewSet):
    queryset = Registry.objects.all()
    serializer_class = IpamRegistrySerializer

