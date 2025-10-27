const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {

    const existingLoads = await prisma.load.count();

    if(existingLoads > 0) {
        console.log('Existing loads found, skipping...');
        return;
    }

    const existingCallRecords = await prisma.callRecord.count();
    
    if(existingCallRecords > 0) {
        console.log('Existing call records found, skipping...');
        return;
    }

    console.log('Tables empty, seeding database...');

    const loads = [
        {
            load_id: 'LD-2025-001',
            origin: 'Chicago, IL',
            destination: 'Dallas, TX',
            pickup_datetime: new Date('2025-10-22T08:00:00'),
            delivery_datetime: new Date('2025-10-23T17:00:00'),
            equipment_type: 'Dry Van',
            loadboard_rate: 2400,
            notes: 'Tail-gate delivery required',
            weight: 42000,
            commodity_type: 'Electronics',
            num_of_pieces: 18,
            miles: 967,
            dimensions: '48x40x72'
        },
        {
            load_id: 'LD-2025-002',
            origin: 'Los Angeles, CA',
            destination: 'New York, NY',
            pickup_datetime: new Date('2025-10-23T06:00:00'),
            delivery_datetime: new Date('2025-10-26T18:00:00'),
            equipment_type: 'Reefer',
            loadboard_rate: 5800,
            notes: 'Temperature controlled at 35°F',
            weight: 38000,
            commodity_type: 'Pharmaceuticals',
            num_of_pieces: 24,
            miles: 2789,
            dimensions: '48x40x60'
        },
        {
            load_id: 'LD-2025-003',
            origin: 'Atlanta, GA',
            destination: 'Miami, FL',
            pickup_datetime: new Date('2025-10-21T14:00:00'),
            delivery_datetime: new Date('2025-10-22T10:00:00'),
            equipment_type: 'Flatbed',
            loadboard_rate: 1200,
            notes: 'Tarping required, heavy machinery',
            weight: 45000,
            commodity_type: 'Construction Equipment',
            num_of_pieces: 3,
            miles: 663,
            dimensions: '96x48x72'
        },
        {
            load_id: 'LD-2025-004',
            origin: 'Seattle, WA',
            destination: 'Portland, OR',
            pickup_datetime: new Date('2025-10-24T09:00:00'),
            delivery_datetime: new Date('2025-10-24T16:00:00'),
            equipment_type: 'Dry Van',
            loadboard_rate: 450,
            notes: 'Easy load, dock-to-dock',
            weight: 22000,
            commodity_type: 'Retail Goods',
            num_of_pieces: 32,
            miles: 173,
            dimensions: '48x40x48'
        },
        {
            load_id: 'LD-2025-005',
            origin: 'Houston, TX',
            destination: 'Phoenix, AZ',
            pickup_datetime: new Date('2025-10-25T07:00:00'),
            delivery_datetime: new Date('2025-10-26T20:00:00'),
            equipment_type: 'Reefer',
            loadboard_rate: 3200,
            notes: 'Keep at 28°F, frozen food',
            weight: 40000,
            commodity_type: 'Frozen Food',
            num_of_pieces: 28,
            miles: 1177,
            dimensions: '48x40x54'
        },
        {
            load_id: 'LD-2025-006',
            origin: 'Denver, CO',
            destination: 'Salt Lake City, UT',
            pickup_datetime: new Date('2025-10-22T11:00:00'),
            delivery_datetime: new Date('2025-10-23T08:00:00'),
            equipment_type: 'Dry Van',
            loadboard_rate: 950,
            notes: 'Standard load',
            weight: 35000,
            commodity_type: 'Furniture',
            num_of_pieces: 15,
            miles: 525,
            dimensions: '48x40x84'
        },
        {
            load_id: 'LD-2025-007',
            origin: 'Boston, MA',
            destination: 'Washington, DC',
            pickup_datetime: new Date('2025-10-26T10:00:00'),
            delivery_datetime: new Date('2025-10-27T14:00:00'),
            equipment_type: 'Dry Van',
            loadboard_rate: 1100,
            notes: 'Appointment required for delivery',
            weight: 28000,
            commodity_type: 'Paper Products',
            num_of_pieces: 40,
            miles: 442,
            dimensions: '48x40x42'
        },
        {
            load_id: 'LD-2025-008',
            origin: 'Memphis, TN',
            destination: 'Kansas City, MO',
            pickup_datetime: new Date('2025-10-23T13:00:00'),
            delivery_datetime: new Date('2025-10-24T11:00:00'),
            equipment_type: 'Flatbed',
            loadboard_rate: 1400,
            notes: 'Oversized load, permits included',
            weight: 47000,
            commodity_type: 'Steel Beams',
            num_of_pieces: 8,
            miles: 451,
            dimensions: '120x48x60'
        },
        {
            load_id: 'LD-2025-009',
            origin: 'San Francisco, CA',
            destination: 'Las Vegas, NV',
            pickup_datetime: new Date('2025-10-27T08:00:00'),
            delivery_datetime: new Date('2025-10-28T12:00:00'),
            equipment_type: 'Reefer',
            loadboard_rate: 1800,
            notes: 'Temperature sensitive, 40°F',
            weight: 30000,
            commodity_type: 'Fresh Produce',
            num_of_pieces: 20,
            miles: 569,
            dimensions: '48x40x48'
        },
        {
            load_id: 'LD-2025-010',
            origin: 'Philadelphia, PA',
            destination: 'Charlotte, NC',
            pickup_datetime: new Date('2025-10-24T07:00:00'),
            delivery_datetime: new Date('2025-10-25T15:00:00'),
            equipment_type: 'Dry Van',
            loadboard_rate: 1350,
            notes: 'Multiple stops possible',
            weight: 32000,
            commodity_type: 'Automotive Parts',
            num_of_pieces: 22,
            miles: 544,
            dimensions: '48x40x60'
        },
        {
            load_id: 'LD-2025-011',
            origin: 'Minneapolis, MN',
            destination: 'Chicago, IL',
            pickup_datetime: new Date('2025-10-21T12:00:00'),
            delivery_datetime: new Date('2025-10-22T09:00:00'),
            equipment_type: 'Dry Van',
            loadboard_rate: 850,
            notes: 'Expedited delivery',
            weight: 26000,
            commodity_type: 'Medical Supplies',
            num_of_pieces: 30,
            miles: 409,
            dimensions: '48x40x36'
        },
        {
            load_id: 'LD-2025-012',
            origin: 'Detroit, MI',
            destination: 'Indianapolis, IN',
            pickup_datetime: new Date('2025-10-28T10:00:00'),
            delivery_datetime: new Date('2025-10-28T18:00:00'),
            equipment_type: 'Flatbed',
            loadboard_rate: 750,
            notes: 'Same-day delivery',
            weight: 39000,
            commodity_type: 'Metal Parts',
            num_of_pieces: 12,
            miles: 290,
            dimensions: '96x48x48'
        },
        {
            load_id: 'LD-2025-013',
            origin: 'Nashville, TN',
            destination: 'St. Louis, MO',
            pickup_datetime: new Date('2025-10-25T09:00:00'),
            delivery_datetime: new Date('2025-10-26T14:00:00'),
            equipment_type: 'Dry Van',
            loadboard_rate: 950,
            notes: 'Standard freight',
            weight: 31000,
            commodity_type: 'Consumer Goods',
            num_of_pieces: 26,
            miles: 309,
            dimensions: '48x40x54'
        },
        {
            load_id: 'LD-2025-014',
            origin: 'San Diego, CA',
            destination: 'Albuquerque, NM',
            pickup_datetime: new Date('2025-10-26T06:00:00'),
            delivery_datetime: new Date('2025-10-27T19:00:00'),
            equipment_type: 'Reefer',
            loadboard_rate: 2100,
            notes: 'Maintain 33°F throughout',
            weight: 36000,
            commodity_type: 'Dairy Products',
            num_of_pieces: 25,
            miles: 814,
            dimensions: '48x40x60'
        },
        {
            load_id: 'LD-2025-015',
            origin: 'Tampa, FL',
            destination: 'New Orleans, LA',
            pickup_datetime: new Date('2025-10-29T11:00:00'),
            delivery_datetime: new Date('2025-10-30T16:00:00'),
            equipment_type: 'Dry Van',
            loadboard_rate: 1500,
            notes: 'Hazmat certified driver required',
            weight: 34000,
            commodity_type: 'Chemicals',
            num_of_pieces: 16,
            miles: 575,
            dimensions: '48x40x48'
        }
    ];

    // Insert all loads
    for (const load of loads) {
        await prisma.load.create({
            data: load
        });
    }

}

main()
    .catch((e) => {
        console.error('Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });