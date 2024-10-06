import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('../db/comets.db');

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS cometas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            eccentricity REAL,
            semiMajorAxis REAL,
            orbitalPeriod REAL,
            perihelionDistance REAL,
            inclination REAL,
            meanAnomaly REAL,
            sizeEstimate TEXT,
            description TEXT
        )
    `);
});

export async function findCometByName(name) {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM cometas WHERE name = ?", [name], (err, row) => {
            if (err) reject(err);
            resolve(row);
        });
    });
}

export async function saveComet(comet) {
    const { name, eccentricity, semiMajorAxis, orbitalPeriod, perihelionDistance, inclination, meanAnomaly, sizeEstimate, description } = comet;
    
    return new Promise((resolve, reject) => {
        db.run(`
            INSERT INTO cometas (name, eccentricity, semiMajorAxis, orbitalPeriod, perihelionDistance, inclination, meanAnomaly, sizeEstimate, description) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, eccentricity, semiMajorAxis, orbitalPeriod, perihelionDistance, inclination, meanAnomaly, sizeEstimate, description],
            function(err) {
                if (err) reject(err);
                resolve(this.lastID);
            }
        );
    });
}

