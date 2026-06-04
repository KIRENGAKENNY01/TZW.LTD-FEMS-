import axios from 'axios';

const GATEWAY_URL = 'http://localhost:5000';

async function testFlow() {
  try {
    console.log('--- STARTING END-TO-END FLOW TEST ---');

    // 1. Login as User
    console.log('\n[1] Logging in as user1@tzw.com...');
    const userLogin = await axios.post(`${GATEWAY_URL}/api/auth/login`, {
      email: 'user1@tzw.com',
      password: 'User1234!'
    });
    const userToken = userLogin.data.data.accessToken;
    const userHeaders = { Authorization: `Bearer ${userToken}` };
    console.log('User logged in successfully.');

    // Login as Admin to get an extinguisher
    console.log('\n[2] Logging in as admin@tzw.com to fetch extinguishers...');
    const adminLoginFetch = await axios.post(`${GATEWAY_URL}/api/auth/login`, {
      email: 'admin@tzw.com',
      password: 'Admin1234!'
    });
    const adminFetchToken = adminLoginFetch.data.data.accessToken;
    const adminFetchHeaders = { Authorization: `Bearer ${adminFetchToken}` };

    console.log('Fetching active extinguishers...');
    const extRes = await axios.get(`${GATEWAY_URL}/api/extinguishers?status=ACTIVE&limit=5`, { headers: adminFetchHeaders });
    const extinguisher = extRes.data.data[0];
    if (!extinguisher) {
      throw new Error('No active extinguishers found for testing.');
    }
    console.log(`Using extinguisher: Serial Number = ${extinguisher.serialNumber}, ID = ${extinguisher.id}`);

    // Request inspection
    console.log('\n[3] Submitting inspection request as User...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const schedulePayload = {
      extinguisherId: extinguisher.id,
      inspectorId: null,
      scheduledDate: tomorrow.toISOString().slice(0, 10),
      scheduledTime: '10:00',
      notes: 'Requesting maintenance check'
    };
    const requestRes = await axios.post(`${GATEWAY_URL}/api/inspections`, schedulePayload, { headers: userHeaders });
    const inspection = requestRes.data.data;
    console.log(`Inspection requested successfully. ID = ${inspection.id}, Status = ${inspection.status}, Inspector ID = ${inspection.inspectorId}`);

    if (inspection.status !== 'REQUESTED') {
      throw new Error(`Expected status 'REQUESTED', got '${inspection.status}'`);
    }

    // 2. Login as Admin
    console.log('\n[4] Logging in as admin@tzw.com...');
    const adminLogin = await axios.post(`${GATEWAY_URL}/api/auth/login`, {
      email: 'admin@tzw.com',
      password: 'Admin1234!'
    });
    const adminToken = adminLogin.data.data.accessToken;
    const adminHeaders = { Authorization: `Bearer ${adminToken}` };
    console.log('Admin logged in successfully.');

    // Fetch inspectors to assign one
    console.log('\n[5] Fetching inspectors list...');
    const usersRes = await axios.get(`${GATEWAY_URL}/api/auth/inspectors`, { headers: adminHeaders });
    const inspector = usersRes.data.data.find(u => u.email === 'inspector1@tzw.com');
    if (!inspector) {
      throw new Error('Inspector inspector1@tzw.com not found.');
    }
    console.log(`Assigning to Inspector: ID = ${inspector.id}, Email = ${inspector.email}`);

    // Approve and assign inspection
    console.log('\n[6] Admin approving & assigning inspection...');
    const approveRes = await axios.patch(`${GATEWAY_URL}/api/inspections/${inspection.id}/approve`, {
      inspectorId: inspector.id
    }, { headers: adminHeaders });
    const approvedInspection = approveRes.data.data;
    console.log(`Inspection approved & assigned. Status = ${approvedInspection.status}, Inspector ID = ${approvedInspection.inspectorId}`);

    if (approvedInspection.status !== 'PENDING' || approvedInspection.inspectorId !== inspector.id) {
      throw new Error(`Approval failed: expected status 'PENDING' and inspectorId '${inspector.id}'`);
    }

    // 3. Login as Inspector
    console.log('\n[7] Logging in as inspector1@tzw.com...');
    const inspLogin = await axios.post(`${GATEWAY_URL}/api/auth/login`, {
      email: 'inspector1@tzw.com',
      password: 'Insp1234!'
    });
    const inspToken = inspLogin.data.data.accessToken;
    const inspHeaders = { Authorization: `Bearer ${inspToken}` };
    console.log('Inspector logged in successfully.');

    // Complete inspection
    console.log('\n[8] Inspector completing inspection...');
    const completeRes = await axios.patch(`${GATEWAY_URL}/api/inspections/${inspection.id}/complete`, {
      result: 'NEEDS_MAINTENANCE',
      notes: 'Pressure below green line'
    }, { headers: inspHeaders });
    const completedInspection = completeRes.data.data;
    console.log(`Inspection completed. Status = ${completedInspection.status}, Result = ${completedInspection.result}`);

    if (completedInspection.status !== 'COMPLETED') {
      throw new Error(`Expected status 'COMPLETED', got '${completedInspection.status}'`);
    }

    // Log Maintenance
    console.log('\n[9] Inspector logging maintenance activity...');
    const maintenancePayload = {
      actionTaken: 'Recharged nitrogen propellent and checked valves',
      issuesIdentified: 'Pressure drop',
      recommendations: 'Check gauge weekly',
      conditionsNoted: 'Canister dusty',
      maintenanceDate: new Date().toISOString().slice(0, 10)
    };
    const maintRes = await axios.post(`${GATEWAY_URL}/api/inspections/${inspection.id}/maintenance`, maintenancePayload, { headers: inspHeaders });
    const maintLog = maintRes.data.data;
    console.log(`Maintenance logged successfully. ID = ${maintLog.id}, Action = ${maintLog.actionTaken}`);

    // 4. Fetch reports as Admin to check if stats and history updated
    console.log('\n[10] Admin fetching reports...');
    
    console.log('Fetching inventory report (All-Time)...');
    const invRes = await axios.get(`${GATEWAY_URL}/api/reports/inventory`, { headers: adminHeaders });
    console.log(`All-Time Total Extinguishers: ${invRes.data.data.total}`);

    console.log('Fetching inventory report (Daily)...');
    const invDailyRes = await axios.get(`${GATEWAY_URL}/api/reports/inventory?period=DAILY`, { headers: adminHeaders });
    console.log(`Today's Installed Extinguishers: ${invDailyRes.data.data.total}`);

    console.log('Fetching inspections report...');
    const inspReportRes = await axios.get(`${GATEWAY_URL}/api/reports/inspections`, { headers: adminHeaders });
    console.log(`Inspection Report: Pending = ${inspReportRes.data.data.pending}, Completed = ${inspReportRes.data.data.completed}`);

    console.log('Fetching maintenance report...');
    const maintReportRes = await axios.get(`${GATEWAY_URL}/api/reports/maintenance`, { headers: adminHeaders });
    console.log(`Maintenance Activities: Total = ${maintReportRes.data.data.totalActivities}`);
    console.log('Recent Maintenance Logs list:');
    maintReportRes.data.data.recentActivities.slice(0, 5).forEach(act => {
      console.log(`  - [${act.maintenanceDate}] Extinguisher Serial: ${act.extinguisherSerial} | Action: ${act.actionTaken}`);
    });

    // Check if our test log is there
    const foundLog = maintReportRes.data.data.recentActivities.find(act => act.actionTaken === maintenancePayload.actionTaken);
    if (!foundLog) {
      throw new Error('Our logged maintenance action was not found in the maintenance report!');
    }
    console.log(`SUCCESS: Found our logged maintenance log with extinguisher serial: ${foundLog.extinguisherSerial}`);

    // Trigger exports
    console.log('\n[11] Testing report exports...');
    const exportMaint = await axios.post(`${GATEWAY_URL}/api/reports/maintenance/export`, { format: 'PDF' }, { headers: adminHeaders });
    console.log(`Export job triggered. Job ID = ${exportMaint.data.data.id}, Status = ${exportMaint.data.data.status}`);

    console.log('\n--- ALL E2E API FLOW TESTS PASSED SUCCESSFULLY! ---');
  } catch (error) {
    console.error('\n*** TEST FAILED ***');
    if (error.response) {
      console.error('Response Error:', error.response.status, error.response.data);
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

testFlow();
