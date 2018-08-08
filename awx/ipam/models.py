from __future__ import unicode_literals
from django.utils.encoding import python_2_unicode_compatible
from awx.ipam.constants import *
from awx.ipam.fields import IPNetworkField, IPAddressField
from django.db import models

from django.contrib.contenttypes.fields import GenericRelation
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db.models.expressions import RawSQL
# from django.urls import reverse

# AWX
from awx.api.versioning import reverse


from django.utils.translation import ugettext_lazy as _
#from awx.main.fields import JSONField, AskForField
from django.contrib.postgres.fields import JSONField




class CreatedUpdatedModel(models.Model):
    created = models.DateField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


@python_2_unicode_compatible
class Rir(CreatedUpdatedModel):
    """
    RIR
    """	
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=200)

    class Meta:
        ordering = ['name']
        verbose_name = 'RIR'
        verbose_name_plural = 'RIRs'


    def __str__(self):
        return self.name


    def get_absolute_url(self, request=None):
        return reverse('api:ipam_rir-detail', kwargs={'pk': self.pk}, request=request)
        # return reverse('api:ipam_rir-list', request=request)




@python_2_unicode_compatible
class Vrf(CreatedUpdatedModel):
    """
    A virtual routing and forwarding (VRF) table represents a discrete layer three forwarding domain (e.g. a routing
    table). Prefixes and IPAddresses can optionally be assigned to VRFs. (Prefixes and IPAddresses not assigned to a VRF
    are said to exist in the "global" table.)
    """
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    rd = models.CharField(max_length=21, verbose_name='Route distinguisher')
    enforce_unique = models.BooleanField(default=True, verbose_name='Enforce unique space',
                                         help_text="Prevent duplicate prefixes/IP addresses within this VRF")

    class Meta:
        ordering = ['name']
        verbose_name = 'VRF'
        verbose_name_plural = 'VRFs'

    def __str__(self):
        return self.display_name or super(Vrf, self).__str__()

    @property
    def display_name(self):
        if self.name and self.rd:
            return "{} ({})".format(self.name, self.rd)
        return None

    def get_absolute_url(self, request=None):
        return reverse('api:ipam_vrf-detail', kwargs={'pk': self.pk}, request=request)



@python_2_unicode_compatible
class Datacenter(CreatedUpdatedModel):
    """
    Datacenter
    """	
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=200, blank=True)
    site = models.CharField(max_length=50, blank=True)
    location = models.CharField(max_length=50, blank=True)
    facility = models.CharField(max_length=50, blank=True)
    physical_address = models.CharField(max_length=200, blank=True)
    shipping_address = models.CharField(max_length=200, blank=True)
    contact_name = models.CharField(max_length=50, blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    contact_email = models.EmailField(blank=True, verbose_name="Contact E-mail")
    comments = models.TextField(blank=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

    def get_absolute_url(self, request=None):
        return reverse('api:ipam_datacenter-detail', kwargs={'pk': self.pk}, request=request)




@python_2_unicode_compatible
class Aggregate(CreatedUpdatedModel):
    """
    An aggregate exists at the root level of the IP address space hierarchy in NetBox. Aggregates are used to organize
    the hierarchy and track the overall utilization of available address space. Each Aggregate is assigned to a RIR.
    """
    family = models.PositiveSmallIntegerField(choices=AF_CHOICES)
    prefix = IPNetworkField()
    rir = models.ForeignKey('Rir', related_name='aggregates', on_delete=models.PROTECT, verbose_name='RIR')
    date_added = models.DateField(blank=True, null=True)
    description = models.CharField(max_length=100, blank=True)
   
    class Meta:
        ordering = ['family', 'prefix']

    def __str__(self):
        return str(self.prefix)

    def get_absolute_url(self, request=None):
        return reverse('api:ipam_aggregate-detail', kwargs={'pk': self.pk}, request=request)


# @python_2_unicode_compatible
class Prefix(CreatedUpdatedModel):
    """
    A Prefix represents an IPv4 or IPv6 network, including mask length. Prefixes can optionally be assigned to Sites and
    VRFs. A Prefix must be assigned a status and may optionally be assigned a used-define Role. A Prefix can also be
    assigned to a VLAN where appropriate.
    """
    family = models.PositiveSmallIntegerField(choices=AF_CHOICES, default=4 ,editable=True)
    prefix = IPNetworkField(help_text="IPv4 or IPv6 network with mask")
    datacenter = models.ForeignKey('Datacenter', related_name='prefixes', on_delete=models.PROTECT, blank=True, null=True)
    vrf = models.ForeignKey('Vrf', related_name='prefixes', on_delete=models.PROTECT, blank=True, null=True,
                            verbose_name='VRF')
    vlan = models.ForeignKey('Vlan', related_name='prefixes', on_delete=models.PROTECT, blank=True, null=True,
                             verbose_name='VLAN')
    status = models.PositiveSmallIntegerField('Status', choices=PREFIX_STATUS_CHOICES, default=PREFIX_STATUS_ACTIVE,
                                              help_text="Operational status of this prefix")
    is_pool = models.BooleanField(verbose_name='Is a pool', default=False,
                                  help_text="All IP addresses within this prefix are considered usable")
    description = models.CharField(max_length=100, blank=True)


    class Meta:
        ordering = ['vrf', 'family', 'prefix']
        verbose_name_plural = 'prefixes'

    def __str__(self):
        return str(self.prefix)

    def get_absolute_url(self, request=None):
        return reverse('api:ipam_prefix-detail', kwargs={'pk': self.pk}, request=request) 



class IPAddressManager(models.Manager):

    def get_queryset(self):
        """
        By default, PostgreSQL will order INETs with shorter (larger) prefix lengths ahead of those with longer
        (smaller) masks. This makes no sense when ordering IPs, which should be ordered solely by family and host
        address. We can use HOST() to extract just the host portion of the address (ignoring its mask), but we must
        then re-cast this value to INET() so that records will be ordered properly. We are essentially re-casting each
        IP address as a /32 or /128.
        """
        qs = super(IPAddressManager, self).get_queryset()
        return qs.annotate(host=RawSQL('INET(HOST(ipam_ipaddress.address))', [])).order_by('family', 'host')


@python_2_unicode_compatible
class IPAddress(CreatedUpdatedModel):
    """
    An IPAddress represents an individual IPv4 or IPv6 address and its mask. The mask length should match what is
    configured in the real world. (Typically, only loopback interfaces are configured with /32 or /128 masks.) Like
    Prefixes, IPAddresses can optionally be assigned to a VRF. An IPAddress can optionally be assigned to an Interface.
    Interfaces can have zero or more IPAddresses assigned to them.
    An IPAddress can also optionally point to a NAT inside IP, designating itself as a NAT outside IP. This is useful,
    for example, when mapping public addresses to private addresses. When an Interface has been assigned an IPAddress
    which has a NAT outside IP, that Interface's Device can use either the inside or outside IP as its primary IP.
    """
    datacenter = models.ForeignKey('Datacenter', related_name='ip_addresses', on_delete=models.PROTECT, blank=True, null=True)
    family = models.PositiveSmallIntegerField(choices=AF_CHOICES, default=4, editable=True)
    address = IPAddressField(help_text="IPv4 or IPv6 address (with mask)")
    vrf = models.ForeignKey('VRF', related_name='ip_addresses', on_delete=models.PROTECT, blank=True, null=True,
                            verbose_name='VRF')
    status = models.PositiveSmallIntegerField(
        'Status', choices=IPADDRESS_STATUS_CHOICES, default=IPADDRESS_STATUS_ACTIVE,
        help_text='The operational status of this IP'
    )

    description = models.CharField(max_length=100, blank=True)


    class Meta:
        ordering = ['family', 'address']
        verbose_name = 'IP address'
        verbose_name_plural = 'IP addresses'

    def __str__(self):
        return str(self.address)

    def get_absolute_url(self, request=None):
        return reverse('api:ipam_ip_address-detail', kwargs={'pk': self.pk}, request=request)


@python_2_unicode_compatible
class Vlan(CreatedUpdatedModel):
    """
    A VLAN is a distinct layer two forwarding domain identified by a 12-bit integer (1-4094). Each VLAN must be assigned
    to a Site, however VLAN IDs need not be unique within a Site. A VLAN may optionally be assigned to a VLANGroup,
    within which all VLAN IDs and names but be unique.
    Like Prefixes, each VLAN is assigned an operational status and optionally a user-defined Role. A VLAN can have zero
    or more Prefixes assigned to it.
    """
    datacenter = models.ForeignKey('Datacenter', related_name='vlans', on_delete=models.PROTECT, blank=True, null=True)
    vid = models.PositiveSmallIntegerField(verbose_name='ID', validators=[
        MinValueValidator(1),
        MaxValueValidator(4094)
    ])
    name = models.CharField(max_length=64)
    status = models.PositiveSmallIntegerField('Status', choices=VLAN_STATUS_CHOICES, default=1)
    description = models.CharField(max_length=100, blank=True)
 

    class Meta:
        ordering = ['datacenter', 'vid']
        verbose_name = 'VLAN'
        verbose_name_plural = 'VLANs'

    def __str__(self):
        return self.display_name or super(Vlan, self).__str__()


    @property
    def display_name(self):
        if self.vid and self.name:
            return "{} ({})".format(self.vid, self.name)
        return None

    def get_status_class(self):
        return STATUS_CHOICE_CLASSES[self.status]

    def get_absolute_url(self, request=None):
        return reverse('api:ipam_vlan-detail', kwargs={'pk': self.pk}, request=request)




# @python_2_unicode_compatible
class InfrastructureTemplate(CreatedUpdatedModel):
    """
    Template for all infrastructure
    """
    class Meta:
        abstract = True

    name = models.CharField(max_length=100, blank=True)
    description = models.CharField(max_length=100, blank=True)
    url = models.CharField(max_length=200, blank=True)
    token = models.CharField(max_length=200, blank=True)
    username = models.CharField(max_length=200, blank=True)
    password = models.CharField(max_length=200, blank=True)
    hosts = JSONField(
        blank=True,
        default={},
        editable=True,
        null=True,
    )
    artifacts = JSONField(
        blank=True,
        default={},
        editable=True,
        null=True,
    )
    scm_type = models.CharField(
        max_length=8,
        choices=SCM_TYPE_CHOICES,
        blank=True,
        default='',
        verbose_name=_('SCM Type'),
        help_text=_("Specifies the source control system used to store the project."),
    )
    scm_url = models.CharField(
        max_length=1024,
        blank=True,
        default='',
        editable=False,
        verbose_name=_('SCM Source'),
        help_text=_('The SCM Source'),
    )
    scm_branch = models.CharField(
        max_length=1024,
        blank=True,
        default='',
        editable=False,
        verbose_name=_('SCM Branch'),
        help_text=_('The SCM Branch'),
    )
    scm_revision = models.CharField(
        max_length=1024,
        blank=True,
        default='',
        editable=False,
        verbose_name=_('SCM Revision'),
        help_text=_('The SCM Revision'),
    )
    credential = models.ForeignKey(
        'main.Credential',
        related_name='%(class)ss',
        blank=True,
        null=True,
        default=None,
        on_delete=models.SET_NULL,
    )
    datacenter = models.ForeignKey(
    	'Datacenter', 
    	related_name='%(class)ss',
    	on_delete=models.PROTECT, 
    	blank=True, 
    	null=True
    )
    svc_enabled = JSONField(
        blank=True,
        default={},
        editable=True,
        null=True,
    )
    security = JSONField(
        blank=True,
        default={},
        editable=True,
        null=True,
    )
    requirements = JSONField(
        blank=True,
        default={},
        editable=True,
        null=True,
    )
    opts = JSONField(
        blank=True,
        default={},
        editable=True,
        null=True,
    )




class Provider(InfrastructureTemplate):
    """
    Provider
    """
    source = models.CharField(max_length=20, choices=PROVIDER_CHOICES, default=PROVIDER_DEFAULT, editable=True)

    class Meta:
        ordering = ['name',]

    def __str__(self):
        return str(self.name)

    def get_absolute_url(self, request=None):
        return reverse('api:ipam_provider-detail', kwargs={'pk': self.pk}, request=request)


class Storage(InfrastructureTemplate):
    """
    Storage
    """
    source = models.CharField(max_length=20, choices=STORAGE_CHOICES, default=STORAGE_DEFAULT, editable=True)

    path = models.CharField(max_length=100, blank=True)

    class Meta:
        ordering = ['name',]

    def __str__(self):
        return str(self.name)

    def get_absolute_url(self, request=None):
        return reverse('api:ipam_storage-detail', kwargs={'pk': self.pk}, request=request)



class Service(InfrastructureTemplate):
    """
    Service
    """
    source = models.CharField(max_length=20, choices=SERVICE_CHOICES, default=SERVICE_DEFAULT, editable=True)

    class Meta:
        ordering = ['name',]

    def __str__(self):
        return str(self.name)

    def get_absolute_url(self, request=None):
        return reverse('api:ipam_service-detail', kwargs={'pk': self.pk}, request=request)


class Network(InfrastructureTemplate):
    """
    Service
    """
    source = models.CharField(max_length=20, choices=NETWORK_CHOICES, default=NETWORK_DEFAULT, editable=True)

    class Meta:
        ordering = ['name',]

    def __str__(self):
        return str(self.name)

    def get_absolute_url(self, request=None):
        return reverse('api:ipam_network-detail', kwargs={'pk': self.pk}, request=request)



class App(InfrastructureTemplate):
    """
    Application
    """
    source = models.CharField(max_length=20, choices=APP_CHOICES, default=APP_DEFAULT, editable=True)

    class Meta:
        ordering = ['name',]

    def __str__(self):
        return str(self.name)


    def get_absolute_url(self, request=None):
        return reverse('api:ipam_app-detail', kwargs={'pk': self.pk}, request=request)



class Noc(InfrastructureTemplate):
    """
    Network Operation Center
    """
    source = models.CharField(max_length=20, choices=NOC_CHOICES, default=NOC_DEFAULT, editable=True)

    class Meta:
        ordering = ['name',]

    def __str__(self):
        return str(self.name)


    def get_absolute_url(self, request=None):
        return reverse('api:ipam_noc-detail', kwargs={'pk': self.pk}, request=request)



class Backup(InfrastructureTemplate):
    """
    Network Operation Center
    """
    source = models.CharField(max_length=20, choices=BACKUP_CHOICES, default=BACKUP_DEFAULT, editable=True)

    class Meta:
        ordering = ['name',]

    def __str__(self):
        return str(self.name)


    def get_absolute_url(self, request=None):
        return reverse('api:ipam_backup-detail', kwargs={'pk': self.pk}, request=request)



class Documentation(InfrastructureTemplate):
    """
    Network Operation Center
    """
    source = models.CharField(max_length=20, choices=DOCUMENTATION_CHOICES, default=DOCUMENTATION_DEFAULT, editable=True)

    class Meta:
        ordering = ['name',]

    def __str__(self):
        return str(self.name)


    def get_absolute_url(self, request=None):
        return reverse('api:ipam_documentation-detail', kwargs={'pk': self.pk}, request=request)



class Pki(InfrastructureTemplate):
    """
    Network Operation Center
    """
    source = models.CharField(max_length=20, choices=PKI_CHOICES, default=PKI_DEFAULT, editable=True)

    class Meta:
        ordering = ['name',]
        verbose_name = 'PKI'
        verbose_name_plural = 'PKIs'

    def __str__(self):
        return str(self.name)

    # def get_absolute_url(self, request=None):
    #     return reverse('api:ipam_pki-detail', kwargs={'pk': self.pk}, request=request)



class Security(InfrastructureTemplate):
    """
   Security
    """
    source = models.CharField(max_length=20, choices=SECURITY_CHOICES, default=SECURITY_DEFAULT, editable=True)


    class Meta:
        ordering = ['name',]
        verbose_name = 'Security'
        verbose_name_plural = 'Securities'

    def __str__(self):
        return str(self.name)


    # def get_absolute_url(self, request=None):
    #     return reverse('api:ipam_security-detail', kwargs={'pk': self.pk}, request=request)



class DeviceTemplate(CreatedUpdatedModel):
    """
    Template for all devices (physical and virtual)
    """
    class Meta:
        abstract = True

    name = models.CharField(max_length=100, blank=True)
    description = models.CharField(max_length=100, blank=True)
    fqdn = models.CharField(max_length=200, blank=True)
    model = models.CharField(max_length=200, blank=True)
    sn = models.CharField(
    	max_length=200, 
    	blank=True,
    	verbose_name=_('Serial Number'),
    	help_text=_("Specifies the serial number of the device if exist"),
    	)
    hosts = JSONField(
        blank=True,
        default={},
        editable=True,
        null=True,
    )
    artifacts = JSONField(
        blank=True,
        default={},
        editable=True,
        null=True,
    )
    credential = models.ForeignKey(
        'main.Credential',
        related_name='%(class)ss',
        blank=True,
        null=True,
        default=None,
        on_delete=models.SET_NULL,
    )
    datacenter = models.ForeignKey(
    	'Datacenter', 
    	related_name='%(class)ss',
    	on_delete=models.PROTECT, 
    	blank=True, 
    	null=True
    )
    opts = JSONField(
        blank=True,
        default={},
        editable=True,
        null=True,
    )
    primary_ip = models.CharField(max_length=200, blank=True)
    primary_ip6 = models.CharField(max_length=200, blank=True)
    primary_mac = models.CharField(max_length=200, blank=True)
    primary_domain = models.CharField(max_length=200, blank=True)




class BareMetal(DeviceTemplate):
    """
    BareMetal Hosts
    """

    class Meta:
        ordering = ['name',]

    def __str__(self):
        return str(self.name)

    def get_absolute_url(self, request=None):
        return reverse('api:ipam_bare_metal-detail', kwargs={'pk': self.pk}, request=request)



class VirtualHost(DeviceTemplate):
    """
    Virtual Hosts
    """

    provider = models.ForeignKey(
    	'Provider', 
    	related_name='%(class)ss',
    	on_delete=models.PROTECT, 
    	blank=True, 
    	null=True
    )

    class Meta:
        ordering = ['name',]

    def __str__(self):
        return str(self.name)

    def get_absolute_url(self, request=None):
        return reverse('api:ipam_virtual_host-detail', kwargs={'pk': self.pk}, request=request)




class NetworkGear(DeviceTemplate):
    """
    Network Gears
    """


    class Meta:
        ordering = ['name',]

    def __str__(self):
        return str(self.name)


    def get_absolute_url(self, request=None):
        return reverse('api:ipam_network_gear-detail', kwargs={'pk': self.pk}, request=request)



class Registry(DeviceTemplate):
    """
    Registry
    """
    class Meta:
        ordering = ['name',]
        verbose_name = 'Registry'
        verbose_name_plural = 'Registries'

    def __str__(self):
        return str(self.name)


    # def get_absolute_url(self, request=None):
    #     return reverse('api:ipam_registry-detail', kwargs={'pk': self.pk}, request=request)









    # job_template = models.ForeignKey(
    #     'JobTemplate',
    #     related_name='jobs',
    #     blank=True,
    #     null=True,
    #     default=None,
    #     on_delete=models.SET_NULL,
    # )
    # hosts = models.ManyToManyField(
    #     'Host',
    #     related_name='jobs',
    #     editable=False,
    #     through='JobHostSummary',
    # )
    # artifacts = JSONField(
    #     blank=True,
    #     default={},
    #     editable=False,
    # )
    # scm_revision = models.CharField(
    #     max_length=1024,
    #     blank=True,
    #     default='',
    #     editable=False,
    #     verbose_name=_('SCM Revision'),
    #     help_text=_('The SCM Revision from the Project used for this job, if available'),
    # )





    # scm_type = models.CharField(
    #     max_length=8,
    #     choices=SCM_TYPE_CHOICES,
    #     blank=True,
    #     default='',
    #     verbose_name=_('SCM Type'),
    #     help_text=_("Specifies the source control system used to store the project."),
    # )
    # scm_url = models.CharField(
    #     max_length=1024,
    #     blank=True,
    #     default='',
    #     verbose_name=_('SCM URL'),
    #     help_text=_("The location where the project is stored."),
    # )
    # scm_branch = models.CharField(
    #     max_length=256,
    #     blank=True,
    #     default='',
    #     verbose_name=_('SCM Branch'),
    #     help_text=_('Specific branch, tag or commit to checkout.'),
    # )
    # scm_clean = models.BooleanField(
    #     default=False,
    #     help_text=_('Discard any local changes before syncing the project.'),
    # )
    # scm_delete_on_update = models.BooleanField(
    #     default=False,
    #     help_text=_('Delete the project before syncing.'),
    # )
    # credential = models.ForeignKey(
    #     'Credential',
    #     related_name='%(class)ss',
    #     blank=True,
    #     null=True,
    #     default=None,
    #     on_delete=models.SET_NULL,
    # )



