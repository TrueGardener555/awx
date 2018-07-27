
from rest_framework import routers


from rest_framework import routers
from awx.ipam.views import *  # noqa

# Routers provide a way of automatically determining the URL conf.
ipam_router = routers.DefaultRouter()
ipam_router.register(r'ipam_rirs', IpamRirViewSet, base_name="ipam_rir")
ipam_router.register(r'ipam_vrfs', IpamVrfViewSet, base_name="ipam_vrf")
ipam_router.register(r'ipam_datacenters', IpamDatacenterViewSet, base_name="ipam_datacenter")
ipam_router.register(r'ipam_aggregates', IpamAggregateViewSet, base_name="ipam_aggregate")
ipam_router.register(r'ipam_prefixes', IpamPrefixViewSet, base_name="ipam_prefix")
ipam_router.register(r'ipam_ip_addresses', IpamIPAddressViewSet, base_name="ipam_ip_address")
ipam_router.register(r'ipam_vlans', IpamVlanViewSet, base_name="ipam_vlan")
