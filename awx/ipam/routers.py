
from rest_framework import routers


from rest_framework import routers
from awx.ipam.views import *  # noqa

# Routers provide a way of automatically determining the URL conf.
ipam_router = routers.DefaultRouter()
ipam_router.register(r'ipam_rirs', IpamRirViewSet, base_name="ipam_rir")
ipam_router.register(r'ipam_vrfs', IpamVrfViewSet, base_name="ipam_vrf")
