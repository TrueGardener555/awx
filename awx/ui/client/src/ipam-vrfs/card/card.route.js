/*************************************************
 * Copyright (c) 2015 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import {templateUrl} from '../../shared/template-url/template-url.factory';
import {N_} from "../../i18n";

export default {
    name: 'ipamVrfsList',
    route: '/ipam_vrfs',
    templateUrl: templateUrl('ipam-vrfs/card/card'),
    controller: 'ipamVrfsCardController',
    data: {
        activityStream: true,
        activityStreamTarget: 'job'
    },
    ncyBreadcrumb: {
        label: N_('IPAM VRFS')
    },
};
