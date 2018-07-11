/*************************************************
 * Copyright (c) 2015 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import {templateUrl} from '../../shared/template-url/template-url.factory';
import {N_} from "../../i18n";

export default {
    name: 'resourceRegistriesList',
    route: '/resource_registries',
    templateUrl: templateUrl('resource-registries/card/card'),
    controller: 'resourceRegistriesCardController',
    data: {
        activityStream: true,
        activityStreamTarget: 'job'
    },
    ncyBreadcrumb: {
        label: N_('REGISTRIES')
    },
};
