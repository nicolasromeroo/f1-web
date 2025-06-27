import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Race from '../models/race.model.js';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

async function checkRaces() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('Conectado a MongoDB');

        const races = await Race.find().sort({ round: 1 });
        console.log('Carreras disponibles:');
        races.forEach(race => {
            console.log(`Round ${race.round}: ${race.grandPrix} - ${race.country}`);
        });

        if (races.length === 0) {
            console.log('No hay carreras en la base de datos');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.connection.close();
    }
}

checkRaces();
