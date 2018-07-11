/*************************************************
 * Copyright (c) 2015 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import route from './card.route';
import controller from './card.controller';

export default
    angular.module('infraDocumentationsCard', [])
        .controller('infraDocumentationsCardController', controller)
        .run(['$stateExtender', function($stateExtender) {
            $stateExtender.addState(route);
        }]);
