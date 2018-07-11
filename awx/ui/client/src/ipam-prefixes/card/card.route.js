/*************************************************
 * Copyright (c) 2015 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import {templateUrl} from '../../shared/template-url/template-url.factory';
import {N_} from "../../i18n";

export default {
    name: 'ipamPrefixesList',
    route: '/ipam_prefixes',
    templateUrl: templateUrl('ipam-prefixes/card/card'),
    controller: 'ipamPrefixesCardController',
    data: {
        activityStream: true,
        activityStreamTarget: 'job'
    },
    ncyBreadcrumb: {
        label: N_('IPAM PREFIXES')
    },
};
