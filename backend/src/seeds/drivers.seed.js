import mongoose from 'mongoose';
import Driver from '../models/driver.model.js';
import envsConfig from '../config/envs.config.js';

const drivers = [
    { name: 'Lando Norris', team: 'McLaren', number: 4, country: 'GBR', wins: 4, podiums: 26, poles: 10, image: 'lando-norris.jpg' },
    { name: 'Oscar Piastri', team: 'McLaren', number: 81, country: 'AUS', wins: 6, podiums: 17, poles: 3, image: 'oscar-piastri.jpg' },

    { name: 'Charles Leclerc', team: 'Ferrari', number: 16, country: 'MON', wins: 7, podiums: 39, poles: 26, image: 'charles-leclerc.jpg' },
    { name: 'Lewis Hamilton', team: 'Ferrari', number: 44, country: 'GBR', wins: 105, podiums: 202, poles: 104, image: 'lewis-hamilton.jpg' },

    { name: 'Max Verstappen', team: 'Red Bull Racing', number: 1, country: 'NED', wins: 65, podiums: 116, poles: 43, image: 'max-verstappen.jpg' },
    { name: 'Yuki Tsunoda', team: 'Red Bull Racing', number: 22, country: 'JPN', wins: 0, podiums: 0, poles: 0, image: 'yuki-tsunoda.jpg' },

    { name: 'George Russell', team: 'Mercedes', number: 63, country: 'GBR', wins: 3, podiums: 19, poles: 5, image: 'george-russell.jpg' },
    { name: 'Kimi Antonelli', team: 'Mercedes', number: 12, country: 'ITA', wins: 0, podiums: 0, poles: 0, image: 'kimi-antonelli.jpg' },

    { name: 'Fernando Alonso', team: 'Aston Martin', number: 14, country: 'ESP', wins: 32, podiums: 106, poles: 22, image: 'fernando-alonso.jpg' },
    { name: 'Lance Stroll', team: 'Aston Martin', number: 18, country: 'CAN', wins: 0, podiums: 3, poles: 1, image: 'lance-stroll.jpg' },

    { name: 'Pierre Gasly', team: 'Alpine', number: 10, country: 'FRA', wins: 1, podiums: 5, poles: 0, image: 'pierre-gasly.jpg' },
    { name: 'Franco Colapinto', team: 'Alpine', number: 7, country: 'ARG', wins: 0, podiums: 0, poles: 0, image: 'franco-colapinto.jpg' },

    { name: 'Oliver Bearman', team: 'Haas', number: 87, country: 'GBR', wins: 0, podiums: 0, poles: 0, image: 'oliver-bearman.jpg' },
    { name: 'Esteban Ocon', team: 'Haas', number: 31, country: 'FRA', wins: 1, podiums: 4, poles: 0, image: 'esteban-ocon.jpg' },

    { name: 'Liam Lawson', team: 'Racing Bulls', number: 30, country: 'NZL', wins: 0, podiums: 0, poles: 0, image: 'liam-lawson.jpg' },
    { name: 'Isack Hadjar', team: 'Racing Bulls', number: 6, country: 'FRA', wins: 0, podiums: 0, poles: 0, image: 'isack-hadjar.jpg' },

    { name: 'Alexander Albon', team: 'Williams', number: 23, country: 'THA', wins: 0, podiums: 2, poles: 0, image: 'alexander-albon.jpg' },
    { name: 'Carlos Sainz', team: 'Williams', number: 55, country: 'ESP', wins: 4, podiums: 27, poles: 6, image: 'carlos-sainz.jpg' },

    { name: 'Nico Hulkenberg', team: 'Sauber', number: 27, country: 'GER', wins: 0, podiums: 0, poles: 1, image: 'nico-hulkenberg.jpg' },
    { name: 'Gabriel Bortoleto', team: 'Sauber', number: 5, country: 'BRA', wins: 0, podiums: 0, poles: 0, image: 'gabriel-bortoleto.jpg' }
];

(async () => {
    try {
        await mongoose.connect(envsConfig.MONGO_URL);
        await Driver.deleteMany({});
        await Driver.insertMany(drivers);
        console.log(`✅ Seeded ${drivers.length} drivers with stats`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
