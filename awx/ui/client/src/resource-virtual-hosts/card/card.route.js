/*************************************************
 * Copyright (c) 2015 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import {templateUrl} from '../../shared/template-url/template-url.factory';
import {N_} from "../../i18n";

export default {
    name: 'resourceVirtualHostsList',
    route: '/resource_virtual_hosts',
    templateUrl: templateUrl('resource-virtual-hosts/card/card'),
    controller: 'resourceVirtualHostsCardController',
    data: {
        activityStream: true,
        activityStreamTarget: 'job'
    },
    ncyBreadcrumb: {
        label: N_('VIRTUAL HOSTS')
    },
};
