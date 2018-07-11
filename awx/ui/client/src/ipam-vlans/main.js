/*************************************************
 * Copyright (c) 2016 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import ipamVlansCard from './card/main';

export default
    angular.module('ipamVlans', [
        ipamVlansCard.name
    ]);
