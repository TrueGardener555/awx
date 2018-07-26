/*************************************************
 * Copyright (c) 2015 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import {templateUrl} from '../../shared/template-url/template-url.factory';
import {N_} from "../../i18n";

export default {
    name: 'ipamRirsList',
    route: '/ipam_rirs',
    templateUrl: templateUrl('ipam-rirs/card/card'),
    controller: 'ipamRirsCardController',
    data: {
        activityStream: true,
        activityStreamTarget: 'rir'
    },
    ncyBreadcrumb: {
        label: N_('IPAM RIRS')
    },
};
