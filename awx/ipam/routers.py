
from rest_framework import routers


from rest_framework import routers
from awx.ipam.views import IpamRirViewSet

# Routers provide a way of automatically determining the URL conf.
ipam_router = routers.DefaultRouter()
ipam_router.register(r'ipam_rirs', IpamRirViewSet, base_name="ipam_rir")
