import mongoose from 'mongoose';
import Race from '../models/race.model.js';
import envsConfig from '../config/envs.config.js';

const races2025 = [
    { round: 1, grandPrix: 'Australian Grand Prix', circuit: 'Albert Park Circuit', location: 'Melbourne', country: 'Australia', startDate: '2025-03-14', endDate: '2025-03-16', image: 'albert-park-circuit.jpg' },
    { round: 2, grandPrix: 'Chinese Grand Prix', circuit: 'Shanghai International Circuit', location: 'Shanghai', country: 'China', startDate: '2025-03-21', endDate: '2025-03-23', image: 'shanghai-international-circuit.jpg' },
    { round: 3, grandPrix: 'Japanese Grand Prix', circuit: 'Suzuka Circuit', location: 'Suzuka', country: 'Japan', startDate: '2025-04-04', endDate: '2025-04-06', image: 'suzuka-circuit.jpg' },
    { round: 4, grandPrix: 'Bahrain Grand Prix', circuit: 'Bahrain International Circuit', location: 'Sakhir', country: 'Bahrain', startDate: '2025-04-11', endDate: '2025-04-13', image: 'bahrain-international-circuit.jpg' },
    { round: 5, grandPrix: 'Saudi Arabian Grand Prix', circuit: 'Jeddah Corniche Circuit', location: 'Jeddah', country: 'Saudi Arabia', startDate: '2025-04-18', endDate: '2025-04-20', image: 'jeddah-corniche-circuit.jpg' },
    { round: 6, grandPrix: 'Miami Grand Prix', circuit: 'Miami International Autodrome', location: 'Miami', country: 'USA', startDate: '2025-05-02', endDate: '2025-05-04', image: 'miami-international-autodrome.jpg' },
    { round: 7, grandPrix: 'Emilia‑Romagna Grand Prix', circuit: 'Autodromo Enzo e Dino Ferrari', location: 'Imola', country: 'Italy', startDate: '2025-05-16', endDate: '2025-05-18', image: 'imola-circuit.jpg' },
    { round: 8, grandPrix: 'Monaco Grand Prix', circuit: 'Circuit de Monaco', location: 'Monte Carlo', country: 'Monaco', startDate: '2025-05-23', endDate: '2025-05-25', image: 'monaco-circuit.jpg' },
    { round: 9, grandPrix: 'Spanish Grand Prix', circuit: 'Circuit de Barcelona‑Catalunya', location: 'Montmeló', country: 'Spain', startDate: '2025-05-30', endDate: '2025-06-01', image: 'barcelona-circuit.jpg' },
    { round: 10, grandPrix: 'Canadian Grand Prix', circuit: 'Circuit Gilles Villeneuve', location: 'Montreal', country: 'Canada', startDate: '2025-06-13', endDate: '2025-06-15', image: 'gilles-villeneuve-circuit.jpg' },
    { round: 11, grandPrix: 'Austrian Grand Prix', circuit: 'Red Bull Ring', location: 'Spielberg', country: 'Austria', startDate: '2025-06-27', endDate: '2025-06-29', image: 'red-bull-ring.jpg' },
    { round: 12, grandPrix: 'British Grand Prix', circuit: 'Silverstone Circuit', location: 'Silverstone', country: 'United Kingdom', startDate: '2025-07-04', endDate: '2025-07-06', image: 'silverstone-circuit.jpg' },
    { round: 13, grandPrix: 'Belgian Grand Prix', circuit: 'Circuit de Spa‑Francorchamps', location: 'Stavelot', country: 'Belgium', startDate: '2025-07-25', endDate: '2025-07-27', image: 'spa-circuit.jpg' },
    { round: 14, grandPrix: 'Hungarian Grand Prix', circuit: 'Hungaroring', location: 'Budapest', country: 'Hungary', startDate: '2025-08-01', endDate: '2025-08-03', image: 'hungaroring.jpg' },
    { round: 15, grandPrix: 'Dutch Grand Prix', circuit: 'Circuit Zandvoort', location: 'Zandvoort', country: 'Netherlands', startDate: '2025-08-29', endDate: '2025-08-31', image: 'zandvoort-circuit.jpg' },
    { round: 16, grandPrix: 'Italian Grand Prix', circuit: 'Autodromo Nazionale Monza', location: 'Monza', country: 'Italy', startDate: '2025-09-05', endDate: '2025-09-07', image: 'monza-circuit.jpg' },
    { round: 17, grandPrix: 'Azerbaijan Grand Prix', circuit: 'Baku City Circuit', location: 'Baku', country: 'Azerbaijan', startDate: '2025-09-19', endDate: '2025-09-21', image: 'baku-circuit.jpg' },
    { round: 18, grandPrix: 'Singapore Grand Prix', circuit: 'Marina Bay Street Circuit', location: 'Singapore', country: 'Singapore', startDate: '2025-10-03', endDate: '2025-10-05', image: 'marina-bay-circuit.jpg' },
    { round: 19, grandPrix: 'United States Grand Prix', circuit: 'Circuit of the Americas', location: 'Austin', country: 'USA', startDate: '2025-10-17', endDate: '2025-10-19', image: 'circuit-of-the-americas.jpg' },
    { round: 20, grandPrix: 'Mexico City Grand Prix', circuit: 'Autódromo Hermanos Rodríguez', location: 'Mexico City', country: 'Mexico', startDate: '2025-10-24', endDate: '2025-10-26', image: 'hermanos-rodriguez-circuit.jpg' },
    { round: 21, grandPrix: 'São Paulo Grand Prix', circuit: 'Autódromo José Carlos Pace', location: 'São Paulo', country: 'Brazil', startDate: '2025-11-07', endDate: '2025-11-09', image: 'interlagos-circuit.jpg' },
    { round: 22, grandPrix: 'Las Vegas Grand Prix', circuit: 'Las Vegas Strip Street Circuit', location: 'Las Vegas', country: 'USA', startDate: '2025-11-20', endDate: '2025-11-22', image: 'las-vegas-circuit.jpg' },
    { round: 23, grandPrix: 'Qatar Grand Prix', circuit: 'Lusail International Circuit', location: 'Lusail', country: 'Qatar', startDate: '2025-11-28', endDate: '2025-11-30', image: 'lusail-circuit.jpg' },
    { round: 24, grandPrix: 'Abu Dhabi Grand Prix', circuit: 'Yas Marina Circuit', location: 'Abu Dhabi', country: 'UAE', startDate: '2025-12-05', endDate: '2025-12-07', image: 'yas-marina-circuit.jpg' },
];

export const seed = async () => {
    try {
        await mongoose.connect(envsConfig.MONGO_URL);
        await Race.deleteMany({});
        await Race.insertMany(races2025);
        console.log(`🏁 Seeded ${races2025.length} races for 2025`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
