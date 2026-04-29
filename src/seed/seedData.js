// feature/seed-data branch - Generates simulation data: 9 provinces, 25 districts, 20 stations, 200 vehicles, 7 days location history
require('dotenv').config();
const mongoose = require('mongoose');

const Province = require('../models/Province');
const District = require('../models/District');
const PoliceStation = require('../models/PoliceStation');
const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');
const LocationPing = require('../models/LocationPing');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

// ─── MASTER DATA ────────────────────────────────────────────────────────────

const provinceData = [
  { name: 'Western',       code: 'WP'  },
  { name: 'Central',       code: 'CP'  },
  { name: 'Southern',      code: 'SP'  },
  { name: 'Northern',      code: 'NP'  },
  { name: 'Eastern',       code: 'EP'  },
  { name: 'North Western', code: 'NWP' },
  { name: 'North Central', code: 'NCP' },
  { name: 'Uva',           code: 'UP'  },
  { name: 'Sabaragamuwa',  code: 'SGP' },
];

const districtData = [
  { name: 'Colombo',        province: 'WP'  },
  { name: 'Gampaha',        province: 'WP'  },
  { name: 'Kalutara',       province: 'WP'  },
  { name: 'Kandy',          province: 'CP'  },
  { name: 'Matale',         province: 'CP'  },
  { name: 'Nuwara Eliya',   province: 'CP'  },
  { name: 'Galle',          province: 'SP'  },
  { name: 'Matara',         province: 'SP'  },
  { name: 'Hambantota',     province: 'SP'  },
  { name: 'Jaffna',         province: 'NP'  },
  { name: 'Kilinochchi',    province: 'NP'  },
  { name: 'Mannar',         province: 'NP'  },
  { name: 'Vavuniya',       province: 'NP'  },
  { name: 'Mullaitivu',     province: 'NP'  },
  { name: 'Batticaloa',     province: 'EP'  },
  { name: 'Ampara',         province: 'EP'  },
  { name: 'Trincomalee',    province: 'EP'  },
  { name: 'Kurunegala',     province: 'NWP' },
  { name: 'Puttalam',       province: 'NWP' },
  { name: 'Anuradhapura',   province: 'NCP' },
  { name: 'Polonnaruwa',    province: 'NCP' },
  { name: 'Badulla',        province: 'UP'  },
  { name: 'Monaragala',     province: 'UP'  },
  { name: 'Ratnapura',      province: 'SGP' },
  { name: 'Kegalle',        province: 'SGP' },
];

const stationData = [
  { name: 'Colombo Fort Police Station',    district: 'Colombo'      },
  { name: 'Wellawatte Police Station',      district: 'Colombo'      },
  { name: 'Negombo Police Station',         district: 'Gampaha'      },
  { name: 'Ja-Ela Police Station',          district: 'Gampaha'      },
  { name: 'Kalutara South Police Station',  district: 'Kalutara'     },
  { name: 'Kandy Central Police Station',   district: 'Kandy'        },
  { name: 'Peradeniya Police Station',      district: 'Kandy'        },
  { name: 'Matale Police Station',          district: 'Matale'       },
  { name: 'Nuwara Eliya Police Station',    district: 'Nuwara Eliya' },
  { name: 'Galle Fort Police Station',      district: 'Galle'        },
  { name: 'Matara Police Station',          district: 'Matara'       },
  { name: 'Hambantota Police Station',      district: 'Hambantota'   },
  { name: 'Jaffna Police Station',          district: 'Jaffna'       },
  { name: 'Point Pedro Police Station',     district: 'Jaffna'       },
  { name: 'Vavuniya Police Station',        district: 'Vavuniya'     },
  { name: 'Batticaloa Police Station',      district: 'Batticaloa'   },
  { name: 'Trincomalee Police Station',     district: 'Trincomalee'  },
  { name: 'Kurunegala Police Station',      district: 'Kurunegala'   },
  { name: 'Anuradhapura Police Station',    district: 'Anuradhapura' },
  { name: 'Ratnapura Police Station',       district: 'Ratnapura'    },
];

// Sri Lanka bounding box per province (lat/lng center + spread)
const provinceBounds = {
  WP:  { lat: 6.9,  lng: 79.9, spread: 0.3 },
  CP:  { lat: 7.3,  lng: 80.6, spread: 0.4 },
  SP:  { lat: 6.1,  lng: 80.5, spread: 0.4 },
  NP:  { lat: 9.4,  lng: 80.2, spread: 0.5 },
  EP:  { lat: 7.8,  lng: 81.5, spread: 0.5 },
  NWP: { lat: 7.8,  lng: 80.0, spread: 0.4 },
  NCP: { lat: 8.3,  lng: 80.4, spread: 0.5 },
  UP:  { lat: 6.9,  lng: 81.0, spread: 0.4 },
  SGP: { lat: 6.7,  lng: 80.4, spread: 0.3 },
};

const firstNames = ['Kamal','Nimal','Sunil','Priya','Chamara','Dilshan','Nuwan','Roshan','Kasun','Saman','Thilak','Ruwan','Malith','Janith','Harsha','Amara','Dilan','Sajith','Lasith','Dimuth','Sachith','Tharaka','Vimukthi','Chathura','Buddhika'];
const lastNames  = ['Perera','Silva','Fernando','Jayasinghe','Gunasekara','Rajapaksa','Dissanayake','Wickramasinghe','Bandara','Herath','Kumara','Madushanka','Pradeep','Liyanage','Senanayake','Pathirana','Mendis','Seneviratne','Gunawardena','Amarasinghe'];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randFloat = (min, max) => Math.random() * (max - min) + min;
const pad = (n, len = 4) => String(n).padStart(len, '0');

// ─── SEED ───────────────────────────────────────────────────────────────────

const seed = async () => {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected!');

  // Clear all collections
  console.log('Clearing old data...');
  await Promise.all([
    Province.deleteMany(),
    District.deleteMany(),
    PoliceStation.deleteMany(),
    Driver.deleteMany(),
    Vehicle.deleteMany(),
    LocationPing.deleteMany(),
    User.deleteMany(),
  ]);

  // ── Provinces ──
  console.log('Seeding provinces...');
  const provinces = await Province.insertMany(provinceData);
  const provinceMap = {}; // code -> _id
  provinces.forEach(p => { provinceMap[p.code] = p._id; });
  console.log(`  ${provinces.length} provinces inserted`);

  // ── Districts ──
  console.log('Seeding districts...');
  const districts = await District.insertMany(
    districtData.map(d => ({ name: d.name, province: provinceMap[d.province] }))
  );
  const districtMap = {}; // name -> { _id, provinceCode }
  districts.forEach((d, i) => {
    districtMap[districtData[i].name] = { _id: d._id, provinceCode: districtData[i].province };
  });
  console.log(`  ${districts.length} districts inserted`);

  // ── Police Stations ──
  console.log('Seeding police stations...');
  await PoliceStation.insertMany(
    stationData.map(s => ({ name: s.name, district: districtMap[s.district]._id }))
  );
  console.log(`  ${stationData.length} stations inserted`);

  // ── Users (admin + 2 officers) ──
  console.log('Seeding users...');
  const adminPass = await bcrypt.hash('admin123', 10);
  const officerPass = await bcrypt.hash('officer123', 10);
  await User.insertMany([
    {
      name: 'Admin HQ',
      email: 'admin@police.lk',
      password: adminPass,
      role: 'admin',
    },
    {
      name: 'Officer Colombo',
      email: 'officer.colombo@police.lk',
      password: officerPass,
      role: 'officer',
      province: provinceMap['WP'],
      district: districtMap['Colombo']._id,
    },
    {
      name: 'Officer Kandy',
      email: 'officer.kandy@police.lk',
      password: officerPass,
      role: 'officer',
      province: provinceMap['CP'],
      district: districtMap['Kandy']._id,
    },
  ]);
  console.log('  3 users inserted (admin@police.lk / admin123)');

  // ── Drivers & Vehicles (200) ──
  console.log('Seeding 200 drivers and vehicles...');
  const districtList = Object.entries(districtMap); // [[name, {_id, provinceCode}]]

  const vehicleDocs = [];
  const driverDocs  = [];

  for (let i = 1; i <= 200; i++) {
    const [dName, dInfo] = rand(districtList);
    const firstName = rand(firstNames);
    const lastName  = rand(lastNames);
    const nic = `${Math.floor(randFloat(700000000, 999999999))}V`;
    const licNum = `B${pad(Math.floor(randFloat(1000, 9999)), 4)}${pad(i, 4)}`;
    const phone = `07${Math.floor(randFloat(10000000, 99999999))}`;

    driverDocs.push({ name: `${firstName} ${lastName}`, nic, licenseNumber: licNum, phone });

    const pCode = dInfo.provinceCode;
    const regNum = `${pCode}-TUK-${pad(i, 4)}`;
    const plate  = `${pCode} ${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i+3) % 26))}-${pad(i % 9999, 4)}`;

    vehicleDocs.push({
      registrationNumber: regNum,
      licensePlate: plate,
      province: provinceMap[pCode],
      district: dInfo._id,
      status: 'active',
      _districtName: dName,
      _provinceCode: pCode,
    });
  }

  const drivers  = await Driver.insertMany(driverDocs);
  // Attach driver references + generate device tokens
  const vehicleInsert = vehicleDocs.map((v, i) => ({
    registrationNumber: v.registrationNumber,
    licensePlate: v.licensePlate,
    province: v.province,
    district: v.district,
    status: v.status,
    driver: drivers[i]._id,
    deviceToken: `dev_token_${pad(i+1, 4)}_${Math.random().toString(36).slice(2, 10)}`,
    _provinceCode: v._provinceCode,
  }));

  const vehicles = await Vehicle.insertMany(vehicleInsert);
  console.log(`  ${vehicles.length} vehicles inserted`);

  // ── Location Pings (7 days, every 15 min per vehicle) ──
  console.log('Seeding location history (7 days x 200 vehicles)... this may take a minute...');

  const now     = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const INTERVAL_MS = 15 * 60 * 1000; // 15 minutes

  const BATCH_SIZE = 5000;
  let pingBuffer = [];
  let totalPings = 0;

  for (const vehicle of vehicles) {
    const bounds = provinceBounds[vehicle._provinceCode] || { lat: 7.0, lng: 80.5, spread: 0.3 };
    // Starting point for this vehicle
    let lat = bounds.lat + randFloat(-bounds.spread, bounds.spread);
    let lng = bounds.lng + randFloat(-bounds.spread, bounds.spread);

    let t = new Date(weekAgo.getTime());
    while (t <= now) {
      // Small random walk to simulate movement
      lat += randFloat(-0.005, 0.005);
      lng += randFloat(-0.005, 0.005);
      // Keep within Sri Lanka bounds
      lat = Math.max(5.9, Math.min(9.8, lat));
      lng = Math.max(79.6, Math.min(81.9, lng));

      pingBuffer.push({
        vehicle: vehicle._id,
        location: { type: 'Point', coordinates: [lng, lat] },
        speed: Math.round(randFloat(0, 60)),
        heading: Math.round(randFloat(0, 359)),
        timestamp: new Date(t),
      });

      t = new Date(t.getTime() + INTERVAL_MS);

      if (pingBuffer.length >= BATCH_SIZE) {
        await LocationPing.insertMany(pingBuffer);
        totalPings += pingBuffer.length;
        process.stdout.write(`\r  ${totalPings} pings inserted...`);
        pingBuffer = [];
      }
    }
  }

  // Insert remaining
  if (pingBuffer.length > 0) {
    await LocationPing.insertMany(pingBuffer);
    totalPings += pingBuffer.length;
  }

  console.log(`\n  ${totalPings} location pings inserted`);
  console.log('\n✅ Seed complete!');
  console.log('─────────────────────────────');
  console.log('Login credentials:');
  console.log('  Admin   → admin@police.lk     / admin123');
  console.log('  Officer → officer.colombo@police.lk / officer123');
  console.log('  Officer → officer.kandy@police.lk   / officer123');
  console.log('─────────────────────────────');

  await mongoose.disconnect();
};

seed().catch(err => {
  console.error('Seed failed:', err);
  mongoose.disconnect();
  process.exit(1);
});