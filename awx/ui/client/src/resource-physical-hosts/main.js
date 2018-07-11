/*************************************************
 * Copyright (c) 2016 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import resourcePhysicalHostsCard from './card/main';

export default
    angular.module('resourcePhysicalHosts', [
        resourcePhysicalHostsCard.name
    ]);
