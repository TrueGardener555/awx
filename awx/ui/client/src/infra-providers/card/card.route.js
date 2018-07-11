/*************************************************
 * Copyright (c) 2015 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import {templateUrl} from '../../shared/template-url/template-url.factory';
import {N_} from "../../i18n";

export default {
    name: 'infraProvidersList',
    route: '/infra_providers',
    templateUrl: templateUrl('infra-providers/card/card'),
    controller: 'infraProvidersCardController',
    data: {
        activityStream: true,
        activityStreamTarget: 'job'
    },
    ncyBreadcrumb: {
        label: N_('PROVIDERS')
    },
};
