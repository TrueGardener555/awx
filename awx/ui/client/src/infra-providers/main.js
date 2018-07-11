/*************************************************
 * Copyright (c) 2016 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import infraProvidersCard from './card/main';

export default
    angular.module('infraProviders', [
        infraProvidersCard.name
    ]);
