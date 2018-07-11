/*************************************************
 * Copyright (c) 2015 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import {templateUrl} from '../../shared/template-url/template-url.factory';
import {N_} from "../../i18n";

export default {
    name: 'ipamIpAddressesList',
    route: '/ipam_ip_addresses',
    templateUrl: templateUrl('ipam-ip-addresses/card/card'),
    controller: 'ipamIpAddressesCardController',
    data: {
        activityStream: true,
        activityStreamTarget: 'job'
    },
    ncyBreadcrumb: {
        label: N_('IPAM IP ADDRESSES')
    },
};
