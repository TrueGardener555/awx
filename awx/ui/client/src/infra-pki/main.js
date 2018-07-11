/*************************************************
 * Copyright (c) 2016 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import infraPkiCard from './card/main';

export default
    angular.module('infraPki', [
        infraPkiCard.name
    ]);
