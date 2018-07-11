/*************************************************
 * Copyright (c) 2016 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import ipamIpAddressesCard from './card/main';

export default
    angular.module('ipamIpAddresses', [
        ipamIpAddressesCard.name
    ]);
