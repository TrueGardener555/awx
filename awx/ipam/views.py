from django.shortcuts import render

from rest_framework import  viewsets
from awx.ipam.models import * # noqa
from awx.ipam.serializers import * # noqa

# Create your views here.



# ViewSets define the view behavior.
class IpamRirViewSet(viewsets.ModelViewSet):
    queryset = Rir.objects.all()
    serializer_class = IpamRirSerializer



class IpamVrfViewSet(viewsets.ModelViewSet):
    queryset = Vrf.objects.all()
    serializer_class = IpamVrfSerializer