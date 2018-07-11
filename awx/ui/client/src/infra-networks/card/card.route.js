/*************************************************
 * Copyright (c) 2015 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import {templateUrl} from '../../shared/template-url/template-url.factory';
import {N_} from "../../i18n";

export default {
    name: 'infraNetworksList',
    route: '/infra_monitorings',
    templateUrl: templateUrl('infra-monitorings/card/card'),
    controller: 'infraNetworksCardController',
    data: {
        activityStream: true,
        activityStreamTarget: 'job'
    },
    ncyBreadcrumb: {
        label: N_('NETWORKS')
    },
};
