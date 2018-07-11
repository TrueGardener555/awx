/*************************************************
 * Copyright (c) 2015 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import {templateUrl} from '../../shared/template-url/template-url.factory';
import {N_} from "../../i18n";

export default {
    name: 'infraStoragesList',
    route: '/infra_storages',
    templateUrl: templateUrl('infra-storages/card/card'),
    controller: 'infraStoragesCardController',
    data: {
        activityStream: true,
        activityStreamTarget: 'job'
    },
    ncyBreadcrumb: {
        label: N_('IPAM RIRS')
    },
};
