/*************************************************
 * Copyright (c) 2015 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import {templateUrl} from '../../shared/template-url/template-url.factory';
import {N_} from "../../i18n";

export default {
    name: 'infraBackupsList',
    route: '/infra_backups',
    templateUrl: templateUrl('infra-backups/card/card'),
    controller: 'infraBackupsCardController',
    data: {
        activityStream: true,
        activityStreamTarget: 'job'
    },
    ncyBreadcrumb: {
        label: N_('INFRA BACKUPS')
    },
};
