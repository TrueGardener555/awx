/*************************************************
 * Copyright (c) 2016 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import infraNetworksCard from './card/main';

export default
    angular.module('infraNetworks', [
        infraNetworksCard.name
    ]);
