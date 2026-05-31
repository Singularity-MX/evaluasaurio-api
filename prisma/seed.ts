import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {

  // =========================
  // ROLES
  // =========================

  const adminRole = await prisma.role.upsert({
    where: {
      name: 'ADMIN',
    },
    update: {},
    create: {
      name: 'ADMIN',
      description: 'Administrador del sistema',
    },
  });

  const moderatorRole = await prisma.role.upsert({
    where: {
      name: 'MODERATOR',
    },
    update: {},
    create: {
      name: 'MODERATOR',
      description: 'Moderador del sistema',
    },
  });

  const publicRole = await prisma.role.upsert({
    where: {
      name: 'PUBLIC',
    },
    update: {},
    create: {
      name: 'PUBLIC',
      description: 'Usuario público',
    },
  });

  // =========================
  // PERMISSIONS
  // =========================

  const viewReports = await prisma.permission.upsert({
    where: {
      permissionKey: 'VIEW_REPORTS',
    },
    update: {},
    create: {
      permissionKey: 'VIEW_REPORTS',
      description: 'Ver reportes',
    },
  });

  const manageUsers = await prisma.permission.upsert({
    where: {
      permissionKey: 'MANAGE_USERS',
    },
    update: {},
    create: {
      permissionKey: 'MANAGE_USERS',
      description: 'Administrar usuarios',
    },
  });

  const manageEvaluations = await prisma.permission.upsert({
    where: {
      permissionKey: 'MANAGE_EVALUATIONS',
    },
    update: {},
    create: {
      permissionKey: 'MANAGE_EVALUATIONS',
      description: 'Administrar evaluaciones',
    },
  });

  // =========================
  // ROLE PERMISSIONS
  // =========================

  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: adminRole.id,
        permissionId: viewReports.id,
      },
    },
    update: {},
    create: {
      roleId: adminRole.id,
      permissionId: viewReports.id,
    },
  });

  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: adminRole.id,
        permissionId: manageUsers.id,
      },
    },
    update: {},
    create: {
      roleId: adminRole.id,
      permissionId: manageUsers.id,
    },
  });

  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: adminRole.id,
        permissionId: manageEvaluations.id,
      },
    },
    update: {},
    create: {
      roleId: adminRole.id,
      permissionId: manageEvaluations.id,
    },
  });

  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: moderatorRole.id,
        permissionId: viewReports.id,
      },
    },
    update: {},
    create: {
      roleId: moderatorRole.id,
      permissionId: viewReports.id,
    },
  });

  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: moderatorRole.id,
        permissionId: manageEvaluations.id,
      },
    },
    update: {},
    create: {
      roleId: moderatorRole.id,
      permissionId: manageEvaluations.id,
    },
  });

  // =========================
  // SUPERADMIN
  // =========================

  const passwordHash = await bcrypt.hash(
    process.env.SUPERADMIN_PASSWORD!,
    10,
  );

  await prisma.user.upsert({
    where: {
      email: process.env.SUPERADMIN_EMAIL!,
    },
    update: {},
    create: {
      email: process.env.SUPERADMIN_EMAIL!,
      passwordHash,
      roleId: adminRole.id,
      active: true,
    },
  });

  console.log('Seed ejecutado correctamente');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });