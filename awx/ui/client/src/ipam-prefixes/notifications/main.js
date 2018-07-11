/*************************************************
 * Copyright (c) 2015 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import route from './notification.route';
import controller from './notification.controller';

export default
    angular.module('ipamPrefixesNotifications', [])
        .controller('ipamPrefixesNotificationsController', controller)
        .run(['$stateExtender', function($stateExtender) {
            $stateExtender.addState(route);
        }]);
