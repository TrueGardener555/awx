/*************************************************
 * Copyright (c) 2015 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import {templateUrl} from '../../shared/template-url/template-url.factory';
import {N_} from "../../i18n";

export default {
    name: 'resourcePhysicalHostsList',
    route: '/resource_physical_hosts',
    templateUrl: templateUrl('resource-physical-hosts/card/card'),
    controller: 'resourcePhysicalHostsCardController',
    data: {
        activityStream: true,
        activityStreamTarget: 'job'
    },
    ncyBreadcrumb: {
        label: N_('PHYSICAL HOSTS')
    },
};
