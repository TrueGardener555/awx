/*************************************************
 * Copyright (c) 2015 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import {templateUrl} from '../../shared/template-url/template-url.factory';
import {N_} from "../../i18n";

export default {
    name: 'ipamDatacentersList',
    route: '/ipam_datacenters',
    templateUrl: templateUrl('ipam-datacenters/card/card'),
    controller: 'ipamDatacentersCardController',
    data: {
        activityStream: true,
        activityStreamTarget: 'datacenter'
    },
    ncyBreadcrumb: {
        label: N_('IPAM Datacenters')
    },
};
