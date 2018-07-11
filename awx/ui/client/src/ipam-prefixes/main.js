/*************************************************
 * Copyright (c) 2016 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import ipamPrefixesCard from './card/main';

export default
    angular.module('ipamPrefixes', [
        ipamPrefixesCard.name
    ]);
