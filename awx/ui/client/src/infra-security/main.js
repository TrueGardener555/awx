/*************************************************
 * Copyright (c) 2016 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import infraSecurityCard from './card/main';

export default
    angular.module('infraSecurity', [
        infraSecurityCard.name
    ]);
