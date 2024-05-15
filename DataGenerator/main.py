import sqlite3
import random
import string
from datetime import datetime, timedelta

# Predefined sets of vehicle models and brands
vehicle_models = ['Sedan', 'SUV', 'Truck']
vehicle_brands = ['Toyota', 'Honda', 'Ford']

# Function to generate random plate numbers
def generate_plate_number():
    letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    numbers = '0123456789'
    return ''.join(random.choice(letters) for _ in range(3)) + ''.join(random.choice(numbers) for _ in range(3))

# Function to generate artificial vehicle numbers
def generate_vehicle_number():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

# Function to generate random dates
def generate_random_date(start_date, end_date):
    delta = end_date - start_date
    random_days = random.randint(0, delta.days)
    return start_date + timedelta(days=random_days)

# Connect to SQLite database
conn = sqlite3.connect('your_database.db')
c = conn.cursor()

# Create tables if they don't exist
c.execute('''CREATE TABLE IF NOT EXISTS Vehicle (
                number TEXT PRIMARY KEY,
                model TEXT,
                brand TEXT
            )''')

c.execute('''CREATE TABLE IF NOT EXISTS Plate (
                number TEXT PRIMARY KEY,
                emissionDate DATE
            )''')

c.execute('''CREATE TABLE IF NOT EXISTS ActivePlates (
                number TEXT PRIMARY KEY,
                vehicle_number TEXT,
                FOREIGN KEY (vehicle_number) REFERENCES Vehicle(number)
            )''')

c.execute('''CREATE TABLE IF NOT EXISTS InactivePlates (
                number TEXT PRIMARY KEY,
                last_vehicle_number TEXT,
                restitutionDate DATE,
                FOREIGN KEY (last_vehicle_number) REFERENCES Vehicle(number)
            )''')

# Generate artificial data and populate tables
vehicle_data = [(generate_vehicle_number(), random.choice(vehicle_models), random.choice(vehicle_brands)) for _ in range(10)]

plate_data = [(generate_plate_number(), generate_random_date(datetime(2020, 1, 1), datetime.now())) for _ in range(10)]

c.executemany('INSERT INTO Vehicle (number, model, brand) VALUES (?, ?, ?)', vehicle_data)
c.executemany('INSERT INTO Plate (number, emissionDate) VALUES (?, ?)', plate_data)

# Assign random plates to vehicles (make them active)
active_plates_data = [(plate[0], random.choice([vehicle[0] for vehicle in vehicle_data])) for plate in plate_data[:3]]
c.executemany('INSERT INTO ActivePlates (number, vehicle_number) VALUES (?, ?)', active_plates_data)

# Make some plates inactive
inactive_plates_data = [(plate[0], random.choice([vehicle[0] for vehicle in vehicle_data]), generate_random_date(datetime.now() - timedelta(days=365), datetime.now())) for plate in plate_data[3:6]]
c.executemany('INSERT INTO InactivePlates (number, last_vehicle_number, restitutionDate) VALUES (?, ?, ?)', inactive_plates_data)

# Commit changes and close connection
conn.commit()
conn.close()

print("Data populated successfully!")
