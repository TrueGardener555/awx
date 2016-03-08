import pytest

from awx.main.migrations import _rbac as rbac
from awx.main.access import TeamAccess
from django.apps import apps

@pytest.mark.django_db
def test_team_migration_user(team, user, permissions):
    u = user('user', False)
    team.users.add(u)
    team.save()

    # This gets setup by a signal handler, but we want to test the migration, so remove the user
    team.member_role.members.remove(u)

    assert not team.accessible_by(u, permissions['auditor'])

    migrated = rbac.migrate_team(apps, None)

    assert len(migrated) == 1
    assert team.accessible_by(u, permissions['auditor'])

@pytest.mark.django_db
def test_team_access_superuser(team, user):
    team.member_role.members.add(user('member', False))

    access = TeamAccess(user('admin', True))

    assert access.can_add(None)
    assert access.can_change(team, None)
    assert access.can_delete(team)

    t = access.get_queryset()[0]
    assert len(t.member_role.members.all()) == 1
    assert len(t.organization.admin_role.members.all()) == 0

@pytest.mark.django_db
def test_team_access_org_admin(organization, team, user):
    a = user('admin', False)
    organization.admin_role.members.add(a)
    team.organization = organization
    team.save()

    access = TeamAccess(a)
    assert access.can_add({'organization': organization.pk})
    assert access.can_change(team, None)
    assert access.can_delete(team)

    t = access.get_queryset()[0]
    assert len(t.member_role.members.all()) == 0
    assert len(t.organization.admin_role.members.all()) == 1

@pytest.mark.django_db
def test_team_access_member(organization, team, user):
    u = user('member', False)
    team.member_role.members.add(u)
    team.organization = organization
    team.save()

    access = TeamAccess(u)
    assert not access.can_add({'organization': organization.pk})
    assert not access.can_change(team, None)
    assert not access.can_delete(team)

    t = access.get_queryset()[0]
    assert len(t.member_role.members.all()) == 1
    assert len(t.organization.admin_role.members.all()) == 0

