import bcrypt from 'bcrypt';
import { PrismaClient as AuthPrisma } from '../services/auth-service/src/generated/client/index.js';
import { PrismaClient as UserPrisma } from '../services/user-management-service/src/generated/client/index.js';
import { PrismaClient as ExtPrisma } from '../services/extinguisher-service/src/generated/client/index.js';
import { PrismaClient as InspPrisma } from '../services/inspection-service/src/generated/client/index.js';
import { PrismaClient as NotifPrisma } from '../services/notification-service/src/generated/client/index.js';

const SALT_ROUNDS = 12;

// Override database URLs
const dbUrls = {
  auth: 'postgresql://postgres:kk123%2C4@localhost:5432/tzw_auth_db',
  user: 'postgresql://postgres:kk123%2C4@localhost:5432/tzw_user_db',
  ext: 'postgresql://postgres:kk123%2C4@localhost:5432/tzw_ext_db',
  insp: 'postgresql://postgres:kk123%2C4@localhost:5432/tzw_insp_db',
  notif: 'postgresql://postgres:kk123%2C4@localhost:5432/tzw_notif_db'
};

async function main() {
  console.log('Starting database seeding...');

  const auth = new AuthPrisma({ datasources: { db: { url: dbUrls.auth } } });
  const user = new UserPrisma({ datasources: { db: { url: dbUrls.user } } });
  const ext = new ExtPrisma({ datasources: { db: { url: dbUrls.ext } } });
  const insp = new InspPrisma({ datasources: { db: { url: dbUrls.insp } } });
  const notif = new NotifPrisma({ datasources: { db: { url: dbUrls.notif } } });

  try {
    // 1. Clear existing data
    console.log('Cleaning up existing data...');
    await auth.refreshToken.deleteMany({});
    await auth.user.deleteMany({});
    await user.passwordReset.deleteMany({});
    await user.userProfile.deleteMany({});
    await ext.fireExtinguisher.deleteMany({});
    await insp.maintenanceLog.deleteMany({});
    await insp.inspection.deleteMany({});
    await notif.notification.deleteMany({});

    // 2. Create Users
    console.log('Seeding Users in Auth Service...');
    const adminHash = await bcrypt.hash('Admin1234!', SALT_ROUNDS);
    const inspHash = await bcrypt.hash('Insp1234!', SALT_ROUNDS);
    const userHash = await bcrypt.hash('User1234!', SALT_ROUNDS);

    const adminUser = await auth.user.create({
      data: { email: 'admin@tzw.com', passwordHash: adminHash, role: 'ADMIN' }
    });
    const inspector1 = await auth.user.create({
      data: { email: 'inspector1@tzw.com', passwordHash: inspHash, role: 'INSPECTOR' }
    });
    const inspector2 = await auth.user.create({
      data: { email: 'inspector2@tzw.com', passwordHash: inspHash, role: 'INSPECTOR' }
    });
    const normalUser1 = await auth.user.create({
      data: { email: 'user1@tzw.com', passwordHash: userHash, role: 'USER' }
    });
    const normalUser2 = await auth.user.create({
      data: { email: 'user2@tzw.com', passwordHash: userHash, role: 'USER' }
    });

    // 3. Create Profiles
    console.log('Seeding User Profiles...');
    await user.userProfile.createMany({
      data: [
        { userId: adminUser.id, firstName: 'Admin', lastName: 'Safety' },
        { userId: inspector1.id, firstName: 'Bob', lastName: 'Inspector' },
        { userId: inspector2.id, firstName: 'Alice', lastName: 'Inspector' },
        { userId: normalUser1.id, firstName: 'John', lastName: 'Facilities' },
        { userId: normalUser2.id, firstName: 'Jane', lastName: 'Facilities' }
      ]
    });

    // 4. Create Fire Extinguishers
    console.log('Seeding Fire Extinguishers...');
    const today = new Date();

    // Expired dates
    const expiredDate1 = new Date();
    expiredDate1.setFullYear(today.getFullYear() - 2);
    const expiredDate2 = new Date();
    expiredDate2.setFullYear(today.getFullYear() - 1);

    // Expiring soon dates (within 30 days)
    const expiringSoon1 = new Date();
    expiringSoon1.setDate(today.getDate() + 15);
    const expiringSoon2 = new Date();
    expiringSoon2.setDate(today.getDate() + 25);

    // Active future expiries
    const futureExpiry1 = new Date();
    futureExpiry1.setFullYear(today.getFullYear() + 2);
    const futureExpiry2 = new Date();
    futureExpiry2.setFullYear(today.getFullYear() + 3);

    const extinguishers = [];
    const extData = [
      { serialNumber: 'SN-EXP01', location: 'Building A, Basement', building: 'Building A', floor: '0', type: 'CO2', size: 'LB_5', installationDate: expiredDate1, expiryDate: expiredDate1, status: 'EXPIRED' },
      { serialNumber: 'SN-EXP02', location: 'Building B, Floor 1 Kitchen', building: 'Building B', floor: '1', type: 'FOAM', size: 'LB_9', installationDate: expiredDate2, expiryDate: expiredDate2, status: 'EXPIRED' },
      { serialNumber: 'SN-SOON01', location: 'Building A, Floor 1 West Wing', building: 'Building A', floor: '1', type: 'WATER', size: 'LB_12', installationDate: expiredDate2, expiryDate: expiringSoon1, status: 'ACTIVE' },
      { serialNumber: 'SN-SOON02', location: 'Building B, Floor 2 Elevator Lobby', building: 'Building B', floor: '2', type: 'DRY_CHEMICAL', size: 'LB_1_5', installationDate: expiredDate2, expiryDate: expiringSoon2, status: 'ACTIVE' },
      { serialNumber: 'SN-ACT01', location: 'Building A, Floor 2 Breakroom', building: 'Building A', floor: '2', type: 'CO2', size: 'LB_5', installationDate: today, expiryDate: futureExpiry1, status: 'ACTIVE' },
      { serialNumber: 'SN-ACT02', location: 'Building A, Floor 3 Conference Room', building: 'Building A', floor: '3', type: 'DRY_CHEMICAL', size: 'LB_12', installationDate: today, expiryDate: futureExpiry2, status: 'ACTIVE' },
      { serialNumber: 'SN-ACT03', location: 'Building B, Floor 1 Server Room', building: 'Building B', floor: '1', type: 'CO2', size: 'LB_12', installationDate: today, expiryDate: futureExpiry1, status: 'ACTIVE' },
      { serialNumber: 'SN-ACT04', location: 'Building B, Floor 2 Warehousing', building: 'Building B', floor: '2', type: 'FOAM', size: 'LB_9', installationDate: today, expiryDate: futureExpiry2, status: 'ACTIVE' },
      { serialNumber: 'SN-ACT05', location: 'Building A, Reception', building: 'Building A', floor: '1', type: 'WATER', size: 'LB_5', installationDate: today, expiryDate: futureExpiry1, status: 'ACTIVE' },
      { serialNumber: 'SN-ACT06', location: 'Building B, Loading Bay', building: 'Building B', floor: '1', type: 'DRY_CHEMICAL', size: 'LB_9', installationDate: today, expiryDate: futureExpiry2, status: 'ACTIVE' }
    ];

    for (const data of extData) {
      const created = await ext.fireExtinguisher.create({
        data: {
          ...data,
          registeredBy: adminUser.id
        }
      });
      extinguishers.push(created);
    }

    // 5. Create Inspections & Maintenance Logs
    console.log('Seeding Inspections and Maintenance Logs...');
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 10);

    const futureDate1 = new Date();
    futureDate1.setDate(today.getDate() + 10);
    const futureDate2 = new Date();
    futureDate2.setDate(today.getDate() + 20);

    // Inspection 1: Completed with maintenance log
    const insp1 = await insp.inspection.create({
      data: {
        extinguisherId: extinguishers[4].id, // SN-ACT01
        inspectorId: inspector1.id,
        scheduledBy: adminUser.id,
        scheduledDate: pastDate,
        scheduledTime: '09:00',
        status: 'COMPLETED',
        result: 'NEEDS_MAINTENANCE',
        completedAt: pastDate
      }
    });
    await insp.maintenanceLog.create({
      data: {
        extinguisherId: extinguishers[4].id,
        inspectorId: inspector1.id,
        inspectionId: insp1.id,
        actionTaken: 'Replaced discharge hose and recharged CO2 canister.',
        issuesIdentified: 'Cracked hose, low pressure',
        recommendations: 'Schedule re-inspection in 6 months',
        maintenanceDate: pastDate
      }
    });

    // Inspection 2: Completed - Pass
    await insp.inspection.create({
      data: {
        extinguisherId: extinguishers[5].id, // SN-ACT02
        inspectorId: inspector2.id,
        scheduledBy: adminUser.id,
        scheduledDate: pastDate,
        scheduledTime: '11:00',
        status: 'COMPLETED',
        result: 'PASS',
        completedAt: pastDate
      }
    });

    // Inspection 3: Pending (upcoming)
    await insp.inspection.create({
      data: {
        extinguisherId: extinguishers[6].id, // SN-ACT03
        inspectorId: inspector1.id,
        scheduledBy: adminUser.id,
        scheduledDate: futureDate1,
        scheduledTime: '09:00',
        status: 'PENDING'
      }
    });

    // Inspection 4: Pending (upcoming)
    await insp.inspection.create({
      data: {
        extinguisherId: extinguishers[7].id, // SN-ACT04
        inspectorId: inspector2.id,
        scheduledBy: adminUser.id,
        scheduledDate: futureDate2,
        scheduledTime: '13:00',
        status: 'PENDING'
      }
    });

    // Inspection 5: Overdue
    const overdueDate = new Date();
    overdueDate.setDate(today.getDate() - 5);
    await insp.inspection.create({
      data: {
        extinguisherId: extinguishers[0].id, // SN-EXP01
        inspectorId: inspector1.id,
        scheduledBy: adminUser.id,
        scheduledDate: overdueDate,
        scheduledTime: '10:00',
        status: 'OVERDUE'
      }
    });

    // 6. Create Notifications
    console.log('Seeding Notifications...');
    await notif.notification.createMany({
      data: [
        { recipientId: inspector1.id, type: 'INSPECTION_SCHEDULED', title: 'Inspection Assigned', body: `Inspection scheduled for SN-ACT04 on ${futureDate1.toDateString()} at 09:00.`, isRead: false },
        { recipientId: inspector2.id, type: 'INSPECTION_SCHEDULED', title: 'Inspection Assigned', body: `Inspection scheduled for SN-ACT05 on ${futureDate2.toDateString()} at 13:00.`, isRead: false },
        { recipientId: adminUser.id, type: 'MAINTENANCE_COMPLETED', title: 'Maintenance Logged', body: `Maintenance completed for SN-ACT01 by Bob Inspector. Status restored to ACTIVE.`, isRead: true, readAt: pastDate },
        { recipientId: adminUser.id, type: 'EXPIRY_ALERT', title: 'Extinguisher Expired Alert', body: `Fire extinguisher SN-EXP01 has passed its expiration date. Please service immediately.`, isRead: true, readAt: pastDate },
        { recipientId: inspector1.id, type: 'GENERAL', title: 'Welcome to TZW FEMS', body: 'Welcome to the new Fire Extinguisher Management System.', isRead: true, readAt: pastDate }
      ]
    });

    console.log('Database seeding completed successfully!');
  } catch (err) {
    console.error('Error seeding databases:', err);
    process.exit(1);
  } finally {
    await auth.$disconnect();
    await user.$disconnect();
    await ext.$disconnect();
    await insp.$disconnect();
    await notif.$disconnect();
  }
}

main();
