/*************************************************
 * Copyright (c) 2015 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import {templateUrl} from '../../shared/template-url/template-url.factory';
import {N_} from "../../i18n";

export default {
    name: 'infraDocumentationsList',
    route: '/infra_documentations',
    templateUrl: templateUrl('infra-documentations/card/card'),
    controller: 'infraDocumentationsCardController',
    data: {
        activityStream: true,
        activityStreamTarget: 'job'
    },
    ncyBreadcrumb: {
        label: N_('INFRA DOCUMENTATIONS')
    },
};
