/*************************************************
 * Copyright (c) 2015 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import {templateUrl} from '../../shared/template-url/template-url.factory';
import {N_} from "../../i18n";

export default {
    name: 'infraPkiList',
    route: '/infra_pki',
    templateUrl: templateUrl('infra-pki/card/card'),
    controller: 'infraPkiCardController',
    data: {
        activityStream: true,
        activityStreamTarget: 'job'
    },
    ncyBreadcrumb: {
        label: N_('IPAM RIRS')
    },
};
