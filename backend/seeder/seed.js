const { initializeDB, db } = require("../models");
const bcrypt = require("bcryptjs");
async function seed() {
  await initializeDB();
  const { User, Car, Shop, Service, UserCar, sequelize } = db;

  // Clear DB
  await sequelize.sync({ force: true });

  // Create Users
  try {
    const users = await User.bulkCreate([
      {
        first_name: "Alice",
        last_name: "Smith",
        email: "alice@example.com",
        password: await bcrypt.hash("password123", 10),
        phone_number: "1234567890",
        is_mechanic: false,
      },
      {
        first_name: "Bob",
        last_name: "Johnson",
        email: "mechanic1@something.com",
        password: await bcrypt.hash("password123", 10),
        phone_number: "0987654321",
        is_mechanic: true,
      },
      {
        first_name: "Charlie",
        last_name: "Brown",
        email: "mechanic2@something.com",
        password: await bcrypt.hash("password123", 10),
        phone_number: "1112223333",
        is_mechanic: true,
      },
      {
        first_name: "Dana",
        last_name: "White",
        email: "dana@example.com",
        password: await bcrypt.hash("password123", 10),
        phone_number: "4445556666",
        is_mechanic: false,
      },
    ]);

    // Create Cars
    const cars = await Car.bulkCreate([
      {
        type: "Sedan",
        model: "Toyota Camry",
        year: 2020,
        color: "Red",
      },
      {
        type: "SUV",
        model: "Honda CR-V",
        year: 2022,
        color: "Blue",
      },
      {
        type: "Truck",
        model: "Ford F-150",
        year: 2018,
        color: "Black",
      },
      {
        type: "Coupe",
        model: "BMW 430i",
        year: 2021,
        color: "White",
      },
      {
        type: "Hatchback",
        model: "Volkswagen Golf",
        year: 2019,
        color: "Green",
      },
    ]);

    // Create Shops
    const shops = await Shop.bulkCreate([
      {
        name: "QuickFix Auto",
        location: "Downtown",
        adminId: users[1].id, // mechanic1
      },
      {
        name: "Speedy Repairs",
        location: "Uptown",
        adminId: users[1].id,
      },
      {
        name: "Charlie’s Garage",
        location: "Suburb",
        adminId: users[2].id, // mechanic2
      },
      {
        name: "Brown’s Auto",
        location: "Industrial Park",
        adminId: users[2].id,
      },
    ]);

    // Create Services
    const now = new Date();
    const oldDate = new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000); // 35 days ago
    const services = await Service.bulkCreate([
      // Alice's cars
      {
        type: "Oil Change",
        description: "Standard oil change",
        price: 49.99,
        userId: users[0].id,
        shopId: shops[0].id,
        carId: cars[0].id,
        date: now,
      },
      {
        type: "Brake Repair",
        description: "Replace brake pads",
        price: 199.99,
        userId: users[0].id,
        shopId: shops[1].id,
        carId: cars[1].id,
        date: now,
      },
      // Overdue service for reminders
      {
        type: "Tire Rotation",
        description: "Quarterly tire rotation",
        price: 29.99,
        userId: users[0].id,
        shopId: shops[0].id,
        carId: cars[0].id,
        date: oldDate,
      },
      {
        type: "Battery Check",
        description: "Annual battery check",
        price: 39.99,
        userId: users[0].id,
        shopId: shops[1].id,
        carId: cars[1].id,
        date: oldDate,
      },
      // Dana's cars
      {
        type: "AC Service",
        description: "AC gas refill",
        price: 59.99,
        userId: users[3].id,
        shopId: shops[2].id,
        carId: cars[2].id,
        date: now,
      },
      {
        type: "Engine Check",
        description: "Full engine diagnostics",
        price: 149.99,
        userId: users[3].id,
        shopId: shops[3].id,
        carId: cars[3].id,
        date: oldDate,
      },
      // Charlie's shops
      {
        type: "Transmission Flush",
        description: "Flush and replace transmission fluid",
        price: 89.99,
        userId: users[2].id,
        shopId: shops[2].id,
        carId: cars[4].id,
        date: now,
      },
      {
        type: "Alignment",
        description: "Wheel alignment",
        price: 69.99,
        userId: users[2].id,
        shopId: shops[3].id,
        carId: cars[2].id,
        date: oldDate,
      },
    ]);

    // Create UserCar relationships
    await users[0].addCar(cars[0]);
    await users[0].addCar(cars[1]);
    await users[3].addCar(cars[2]);
    await users[3].addCar(cars[3]);
    await users[1].addCar(cars[1]);
    await users[2].addCar(cars[4]);
    await users[2].addCar(cars[2]);

    console.log("Seeding completed!");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await sequelize.close();
  }
}
seed();
