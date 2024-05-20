import random
from datetime import datetime, timedelta

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

# Generate and write SQL dump
sql_statements = []

# Create the tables if they don't exist
sql_statements.append('''CREATE TABLE IF NOT EXISTS Vehicle (
                    number VARCHAR(7) PRIMARY KEY,
                    model VARCHAR(20),
                    brand VARCHAR(20),
                    prodDate DATE);''')

sql_statements.append('''CREATE TABLE IF NOT EXISTS ActivePlates (
                    number VARCHAR(7) PRIMARY KEY,
                    emissionDate DATE,
                    vehicleNumber VARCHAR(7),
                    FOREIGN KEY(vehicleNumber) REFERENCES Vehicle(number));''')

sql_statements.append('''CREATE TABLE IF NOT EXISTS InactivePlates (
                    number VARCHAR(7) PRIMARY KEY,
                    emissionDate DATE,
                    vehicleNumber VARCHAR(7),
                    resDate DATE,
                    FOREIGN KEY(vehicleNumber) REFERENCES Vehicle(number));''')

sql_statements.append('''CREATE TABLE IF NOT EXISTS Plates (
                    number VARCHAR(7) PRIMARY KEY,
                    emissionDate DATE,
                    vehicleNumber VARCHAR(7),
                    active BOOLEAN,
                    FOREIGN KEY(vehicleNumber) REFERENCES Vehicle(number));''')

sql_statements.append('''CREATE TABLE IF NOT EXISTS Revisions (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    plateNumber VARCHAR(7),
                    revisionDate DATE,
                    outcome VARCHAR(10),
                    motivation TEXT,
                    FOREIGN KEY(plateNumber) REFERENCES Plates(number));''')


# Function to generate random vehicle data
def generate_vehicle_data():
    models = ['SUV', 'Sedan', 'Truck', 'Hatchback', 'Convertible', 'Coupe', 'Minivan', 'Crossover', 'Sports Car']
    brands = ['Toyota', 'Ford', 'Honda', 'Chevrolet', 'BMW', 'Audi', 'Mercedes-Benz', 'Volkswagen', 'Nissan', 'Hyundai',
              'Kia', 'Subaru', 'Mazda', 'Volvo', 'Jeep', 'Lexus', 'Tesla', 'Ferrari', 'Porsche', 'Jaguar']
    number = ''.join(random.choices('0123456789', k=7))  # Generating a random 7-digit number
    model = random.choice(models)
    brand = random.choice(brands)
    # vehicles are one to two years old.
    data_prod = datetime.now() - timedelta(days=random.randint(365, 720))
    return (number, model, brand, data_prod)


# Function to generate random plate data
def generate_plate_data(emission_date):
    plate_number = ''.join(random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ', k=2) +
                           random.choices('0123456789', k=3) +
                           random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ', k=2))
    return (plate_number, emission_date)


# Function to generate random inactivation data
def generate_inactive_plate_data(plate_data, vehicle_number, next_emission_date=datetime.now()):
    # restitution_date must be before the next_emission_date.
    # plate_data[1] is the current plate's emission_date
    while True:
        try:
            restitution_date = next_emission_date - timedelta(
                days=random.randint(1, (next_emission_date - plate_data[1]).days - 5))
            break  # Exit the loop if no ValueError occurs
        except ValueError:
            print("ciao");
            pass  # If ValueError occurs, continue to the next iteration

    return (plate_data[0], vehicle_number, restitution_date)


# Generate and insert fake data
# Generating 100 vehicles data. Each vehicle can have form 0 to 3 plates. Each plate can have 0 to 3 revision.
for j in range(100):
    # Generate vehicle data
    vehicle_data = generate_vehicle_data()
    # I have to format the date to the ISO standard.
    sql_statements.append(
        f"INSERT INTO Vehicle VALUES ('{vehicle_data[0]}', '{vehicle_data[1]}', '{vehicle_data[2]}', '{vehicle_data[3].strftime('%Y-%m-%d')}');")
    vehicle_number = vehicle_data[0]

    # Generate plate data
    plates = []  # (plate_number, emission_date)

    # Generate the first emission date from 10 to 30 days after the vehicle production date
    emission_date = vehicle_data[3] + timedelta(days=random.randint(10, 30))
    plates.append(generate_plate_data(emission_date))

    # Generate two additional emission dates ensuring they are at least 30 days apart
    for _ in range(0, random.randint(0, 2)):
        # new emission date is 30 to 50 days after the previous one. plates[-1] pick the last item in the list.
        # the number are picked so i can be sure that they don't overlap
        new_emission_date = plates[-1][1] + timedelta(days=random.randint(30, 50))
        plates.append(generate_plate_data(new_emission_date))

    # Sort plates by emission date, descrecent order
    plates.sort(key=lambda x: x[1], reverse=True)

    # Set the active plate if there is one
    if random.choice([True, False]):
        # set the active_plate as the first one
        active_plate_data = plates[0]
        sql_statements.append(
            f"INSERT INTO ActivePlates VALUES ('{active_plate_data[0]}', '{active_plate_data[1].strftime('%Y-%m-%d')}', '{vehicle_number}');")
        sql_statements.append(
            f"INSERT INTO Plates VALUES ('{active_plate_data[0]}', '{active_plate_data[1].strftime('%Y-%m-%d')}', '{vehicle_number}', 1);")

        # add the revisions for the active plate
        for _ in range(0, random.randint(0, 3)):
            if random.choice([True, False]):
                # revision_date can be from the emission_date to now
                revision_date = active_plate_data[1] + timedelta(
                    days=random.randint(1, (datetime.now() - active_plate_data[1]).days))
                outcome = random.choice(['positive', 'negative'])
                motivation = random.choice(motivation_list) if outcome == 'negative' else None
                sql_statements.append(
                    f"INSERT INTO Revisions (plateNumber, revisionDate, outcome, motivation) VALUES ('{active_plate_data[0]}', '{revision_date.strftime('%Y-%m-%d')}', '{outcome}', {'NULL' if motivation is None else repr(motivation)});")

        # The other plates will be inactive
        for i in range(1, len(plates)):
            # here is a bit difficult because names. The previous_emission_date is in fact the next_emission_date
            # because the most recent is at index 0 of the plates list
            previous_emission_date = plates[i - 1][1] if i > 0 else plates[i][1]
            inactive_plate_data = generate_inactive_plate_data(plates[i], vehicle_number, previous_emission_date)
            sql_statements.append(
                f"INSERT INTO InactivePlates VALUES ('{plates[i][0]}', '{plates[i][1].strftime('%Y-%m-%d')}', '{vehicle_number}', '{inactive_plate_data[2].strftime('%Y-%m-%d')}');")
            sql_statements.append(
                f"INSERT INTO Plates VALUES ('{plates[i][0]}', '{plates[i][1].strftime('%Y-%m-%d')}', '{vehicle_number}', 0);")

            # set the revisions
            for _ in range(0, random.randint(0, 3)):
                if random.choice([True, False]):
                    while True:
                        try:
                            revision_date = plates[i][1] + timedelta(
                                days=random.randint(1, (inactive_plate_data[2] - plates[i][1]).days))
                            break
                        except ValueError:
                            print("ciao")
                            pass
                    outcome = random.choice(['positive', 'negative'])
                    motivation = random.choice(motivation_list) if outcome == 'negative' else None
                    sql_statements.append(
                        f"INSERT INTO Revisions (plateNumber, revisionDate, outcome, motivation) VALUES ('{plates[i][0]}', '{revision_date.strftime('%Y-%m-%d')}', '{outcome}', {'NULL' if motivation is None else repr(motivation)});")
    # the vehicle will not have an active plate
    else:
        if random.choice([True, False]):
            # Only inactive plates
            for i in range(0, len(plates)):
                previous_emission_date = datetime.now() if i == 0 else plates[i - 1][1]
                inactive_plate_data = generate_inactive_plate_data(plates[i], vehicle_number, previous_emission_date)
                sql_statements.append(
                    f"INSERT INTO InactivePlates VALUES ('{plates[i][0]}', '{plates[i][1].strftime('%Y-%m-%d')}', '{vehicle_number}', '{inactive_plate_data[2].strftime('%Y-%m-%d')}');")
                sql_statements.append(
                    f"INSERT INTO Plates VALUES ('{plates[i][0]}', '{plates[i][1].strftime('%Y-%m-%d')}', '{vehicle_number}', 0);")

                while True:
                    try:
                        revision_date = plates[i][1] + timedelta(
                            days=random.randint(1, (inactive_plate_data[2] - plates[i][1]).days))
                        break
                    except ValueError:
                        print("ciao");
                        pass
                outcome = random.choice(['positive', 'negative'])
                motivation = random.choice(motivation_list) if outcome == 'negative' else None
                sql_statements.append(
                    f"INSERT INTO Revisions (plateNumber, revisionDate, outcome, motivation) VALUES ('{plates[i][0]}', '{revision_date.strftime('%Y-%m-%d')}', '{outcome}', {'NULL' if motivation is None else repr(motivation)});")

        else:
            pass  # No plates for this vehicle

# Write SQL statements to a file
with open('../db/vehicle_database.sql', 'w') as f:
    for statement in sql_statements:
        f.write(statement + '\n')

print("SQL dump successfully generated and saved to vehicle_database.sql.")
