import sqlite3
import random
from datetime import datetime, timedelta


# Function to generate random vehicle data
def generate_vehicle_data():
    models = ['SUV', 'Sedan', 'Truck', 'Hatchback']
    brands = ['Toyota', 'Ford', 'Honda', 'Chevrolet', 'BMW']
    number = ''.join(random.choices('0123456789',
                                    k=7))  # Generating a random 7-digit number
    model = random.choice(models)
    brand = random.choice(brands)
    data_prod = datetime.now() - timedelta(days=random.randint(365, 720))
    return (number, model, brand, data_prod)


# Function to generate random plate data
def generate_plate_data(emission_date):
    number = ''.join(
        random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
                       k=7))  # Generating a random alphanumeric plate number
    return (number, emission_date)


# Function to generate random inactivation data
def generate_inactive_plate_data(plate_data,
                                 vehicle_number,
                                 next_emission_date=datetime.now()):
    last_vehicle_number = vehicle_number
    print((next_emission_date - plate_data[1]).days)
    while True:
        try:
            print("i'm here")
            rand = random.randint(1, (next_emission_date - plate_data[1]).days - 5)
            restitution_date = next_emission_date - timedelta(
                days=rand) # resitution date at least 5 days after the emission date
            print(rand)
            print(next_emission_date)
            print(plate_data[1])
            print(restitution_date)
            break  # Exit the loop if no ValueError occurs
        except ValueError:
            pass  # If ValueError occurs, continue to the next iteration

    # Random restitution date within 1-3 months before next emission date
    return (plate_data[0], last_vehicle_number, restitution_date)

motivation_list = [
    "Veicolo non superato il test delle emissioni",
    "Scoperte problematiche di sicurezza durante l'ispezione",
    "Violazione delle leggi sul traffico",
    "Targa danneggiata o manomessa",
    "Documentazione errata presentata",
    "Proprietario precedente non ha rivelato problemi",
    "Veicolo coinvolto in incidente",
    "Non conformità alle normative",
    "Falsificazione o contraffazione di documenti",
    "Targa persa o rubata",
    "Violazione delle normative ambientali",
    "Registrazione scaduta",
    "Modifiche improprie apportate al veicolo",
    "Registrazione fraudolenta",
    "Veicolo considerato non sicuro per l'uso su strada",
    "Mancato pagamento di multe o tasse",
    "Mancato pagamento di imposte",
    "Modifiche illegali apportate al veicolo",
    "Veicolo segnalato come rubato",
    "Targa associata ad attività criminali"
]

# Connect to the SQLite database
conn = sqlite3.connect('../db/vehicle_database.db')
cursor = conn.cursor()

# Create the tables if they don't exist
cursor.execute('''CREATE TABLE IF NOT EXISTS Vehicle (
                    number TEXT PRIMARY KEY,
                    model TEXT,
                    brand TEXT,
                    prodDate DATE)''')

cursor.execute('''CREATE TABLE IF NOT EXISTS ActivePlates (
                    number TEXT PRIMARY KEY,
                    emissionDate DATE,
                    vehicleNumber TEXT,
                    FOREIGN KEY(vehicleNumber) REFERENCES Vehicle(number))''')

cursor.execute('''CREATE TABLE IF NOT EXISTS InactivePlates (
                    number TEXT PRIMARY KEY,
                    emissionDate DATE,
                    vehicleNumber TEXT,
                    resDate DATE,
                    FOREIGN KEY(vehicleNumber) REFERENCES Vehicle(number))'''
               )

cursor.execute('''CREATE TABLE IF NOT EXISTS Plates (
                    number TEXT PRIMARY KEY,
                    emissionDate DATE,
                    vehicleNumber TEXT,
                    active BOOLEAN,
                    FOREIGN KEY(vehicleNumber) REFERENCES Vehicle(number))''')

cursor.execute('''CREATE TABLE IF NOT EXISTS Revisions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    plateNumber TEXT,
                    revisionDate DATE,
                    outcome TEXT,
                    motivation TEXT,
                    FOREIGN KEY(plateNumber) REFERENCES Plates(number))'''
               )
# Generate and insert fake data
# Generate and insert fake data
for j in range(100):
    print("new vehicle " + str(j))
    # Generate vehicle data
    vehicle_data = generate_vehicle_data()
    # vehicle prod is at least one year from now
    cursor.execute('INSERT INTO Vehicle VALUES (?, ?, ?, ?)', (*vehicle_data[0:3], vehicle_data[3].strftime('%Y-%m-%d')))

    vehicle_number = vehicle_data[0]

    # Generate plate data
    plates = []

    # Generate the first emission date from 10 to 30 days after the vehicle prod
    emission_date = vehicle_data[3] + timedelta(days=random.randint(10, 30))

    plates.append(generate_plate_data(emission_date))

    # Generate additional emission dates ensuring they are at least 30 days apart
    for _ in range(0, random.randint(0, 2)):
        while True:
            # second plate is 30 to 50 days later than the first one, meaning that the first must be returned in this interval
            new_emission_date = plates[-1][1] + timedelta(days=random.randint(30, 100))
            print(new_emission_date)
            if (new_emission_date - plates[-1][1]).days >= 30:
                plates.append(generate_plate_data(new_emission_date))
                break
        print("i'm done")
    print("numero targhe: " + str(len(plates)))

    # Sort plates by emission date
    plates.sort(key=lambda x: x[1], reverse=True)
    print("lista targhe: " + str(plates))
    # Set the active plate if there is one
    if random.choice([True, False]):
        print("vehicle will have an active plate")
        active_plate_data = plates[0]
        cursor.execute(
            'INSERT INTO ActivePlates VALUES (?, ?, ?)',
            (active_plate_data[0], active_plate_data[1].strftime('%Y-%m-%d'), vehicle_number))
        cursor.execute('INSERT INTO Plates VALUES (?, ?, ?, ?)',
                       (active_plate_data[0], active_plate_data[1].strftime('%Y-%m-%d'), vehicle_number, True))

        for _ in range(0, random.randint(0,3)): # 0 to 3 revision
            if random.choice([True, False]): # assign a revisione to the active_plate
                revision_date = active_plate_data[1] + timedelta(
                    days=random.randint(1, (datetime.now() - active_plate_data[1]).days))
                outcome = random.choice(['positive', 'negative'])
                if outcome == 'negative':
                    motivation = random.choice(motivation_list)
                else:
                    motivation = None
                cursor.execute('INSERT INTO Revisions (plateNumber, revisionDate, outcome, motivation) VALUES (?, ?, ?, ?)',
                               (active_plate_data[0], revision_date.strftime('%Y-%m-%d'), outcome, motivation))
        # Generate and insert inactive plate data
        for i in range(1, len(plates)):
            print("generating inactive plates")
            if i == 0:
                previous_emission_date = plates[i][1]
            else:
                previous_emission_date = plates[i - 1][1]
            inactive_plate_data = generate_inactive_plate_data(
                plates[i], vehicle_number, previous_emission_date)
            cursor.execute(
                'INSERT INTO InactivePlates VALUES (?, ?, ?, ?)',
                (plates[i][0], plates[i][1].strftime('%Y-%m-%d'), vehicle_number, inactive_plate_data[2].strftime('%Y-%m-%d')))

            cursor.execute('INSERT INTO Plates VALUES (?, ?, ?, ?)',
                           (plates[i][0], plates[i][1].strftime('%Y-%m-%d'), vehicle_number, False))

            for _ in range(0, random.randint(0, 3)):
                if random.choice([True, False]):
                    while True:
                        try:
                            revision_date = plates[i][1] + timedelta(
                            days=random.randint(1, (inactive_plate_data[2] - plates[i][1]).days))
                            break
                        except ValueError:
                            #print((inactive_plate_data[2]-plates[i][1]).days)
                            pass
                    outcome = random.choice(['positive', 'negative'])
                    if outcome == 'negative':
                        motivation = random.choice(motivation_list)
                    else:
                        motivation = None
                    cursor.execute('INSERT INTO Revisions (plateNumber, revisionDate, outcome, motivation) VALUES (?, ?, ?, ?)',
                                   (plates[i][0], revision_date.strftime('%Y-%m-%d'), outcome, motivation))
    else:
        if random.choice([True, False]):
            print("vehicle will have only inactive plates")
            # Only inactive plates
            for i in range(0, len(plates)):
                if i == 0:
                    previous_emission_date = datetime.now()
                else:
                    previous_emission_date = plates[i - 1][1]
                inactive_plate_data = generate_inactive_plate_data(
                    plates[i], vehicle_number, previous_emission_date)
                cursor.execute(
                    'INSERT INTO InactivePlates VALUES (?, ?, ?, ?)',
                    (plates[i][0], plates[i][1].strftime('%Y-%m-%d'), vehicle_number, inactive_plate_data[2].strftime('%Y-%m-%d')))

                cursor.execute('INSERT INTO Plates VALUES (?, ?, ?, ?)',
                               (plates[i][0], plates[i][1].strftime('%Y-%m-%d'), vehicle_number, False))

                while True:
                    try:
                        revision_date = plates[i][1] + timedelta(
                            days=random.randint(1, (inactive_plate_data[2] - plates[i][1]).days))
                        break
                    except ValueError:
                        pass
                outcome = random.choice(['positive', 'negative'])
                if outcome == 'negative':
                    motivation = random.choice(motivation_list)
                else:
                    motivation = None
                cursor.execute(
                    'INSERT INTO Revisions (plateNumber, revisionDate, outcome, motivation) VALUES (?, ?, ?, ?)',
                    (plates[i][0], revision_date.strftime('%Y-%m-%d'), outcome, motivation))
        # If no plates generated, set the vehicle to have no active plates
        else:
            print("vehicle will have never been plated")
            pass  # No plates for this vehicle

# Commit the changes and close the connection
conn.commit()
conn.close()

print("Data successfully generated and inserted into the database.")
