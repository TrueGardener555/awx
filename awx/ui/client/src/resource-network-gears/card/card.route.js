/*************************************************
 * Copyright (c) 2015 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import {templateUrl} from '../../shared/template-url/template-url.factory';
import {N_} from "../../i18n";

export default {
    name: 'resourceNetworkGearsList',
    route: '/resource_network_gears',
    templateUrl: templateUrl('resource-network-gears/card/card'),
    controller: 'resourceNetworkGearsCardController',
    data: {
        activityStream: true,
        activityStreamTarget: 'job'
    },
    ncyBreadcrumb: {
        label: N_('NETWORK GEARS')
    },
};
