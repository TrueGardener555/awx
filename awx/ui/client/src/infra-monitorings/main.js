/*************************************************
 * Copyright (c) 2016 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import infraMonitoringsCard from './card/main';

export default
    angular.module('infraMonitorings', [
        infraMonitoringsCard.name
    ]);
