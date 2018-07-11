/*************************************************
 * Copyright (c) 2015 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import {templateUrl} from '../../shared/template-url/template-url.factory';
import {N_} from "../../i18n";

export default {
    name: 'ipamAggregatesList',
    route: '/ipam_aggregates',
    templateUrl: templateUrl('ipam-aggregates/card/card'),
    controller: 'ipamAggregatesCardController',
    data: {
        activityStream: true,
        activityStreamTarget: 'job'
    },
    ncyBreadcrumb: {
        label: N_('IPAM AGGREGATES')
    },
};
