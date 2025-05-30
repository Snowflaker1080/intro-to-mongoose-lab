require("dotenv").config(); // Loads environment variables from .env file into process.env.
const mongoose = require("mongoose"); //Imports the Mongoose library to connect and interact with MongoDB.

const prompt = require("prompt-sync")({ sigint: true}); //Loads the prompt-sync package for user input in terminal.
const Customer = require("./models/customer"); // Customer model import from models directory.

mongoose.connect(process.env.MONGODB_URI); // Connects to the MongoDB database using the URI stored in the .env file.

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

async function mainMenu() {
  while (true) {
    console.log("\nWelcome to the CRM\n");
    console.log("What would you like to do?\n");
    console.log("  1. Create a customer");
    console.log("  2. View all customers");
    console.log("  3. Update a customer");
    console.log("  4. Delete a customer");
    console.log("  5. Quit");

    const choice = prompt("\nNumber of action to run: "); // Takes user input to determine which action to perform.
    console.log("User input:", choice);

    switch (choice){ // Starts a switch block based on user input choice.
      case "1":
        await createCustomer();
        break;
      case "2":
        await viewCustomers();
        prompt("\nPress Enter to return to menu..."); // trying to resolve issue knowing database has no customers.
        break;
      case "3":
        await updateCustomer();
        break;
      case "4":
        await deleteCustomer();
        break;
      case "5":
        console.log("Exiting...");
        mongoose.connection.close(); // User inputs 5 to 'Quit', command safely closes the connection to your MongoDB database
        return;
      default:
        console.log("Invalid option Please enter 1-5.");
    }
  }
}

async function createCustomer() {
  const name = prompt("Enter customer name: ");
  const ageInput = Number(prompt("Enter customer age: ")); // Why capital N required for Number? Case sensitive
  const age = Number(ageInput);
  // Number() is capitalised because it’s a built-in JavaScript constructor—functions like Number(), String(), Array() are always case-sensitive.

  if (isNaN(age)) {
    console.log("Please enter a valide number for age.");
    return;
  }
  await Customer.create({ name, age });
  console.log("Customer created successfully."); // Creates a new customer document in MongoDB.
}

async function viewCustomers() {
  // Fetches all custoers from database.
  const customers = await Customer.find();
  console.log("\nCustomer List:\n");

  if (customers.length === 0) {
    console.log("No customers found.\n");
  } else {
    customers.forEach((c) => {
      console.log(`id: ${c._id} -- Name: ${c.name}, Age: ${c.age}`);
    });
  }
}

async function updateCustomer() {
  await viewCustomers();
  const id = prompt("Enter customer id to update: ");
  const name = prompt("New name: ");
  const age = Number(prompt("New age: "));

  if (isNaN(age)) {
    console.log("Please enter a valid number for age.");
    return;
  }
  await Customer.findByIdAndUpdate(id, { name, age });
  console.log("Customer updated.");
}
// Updates the customer record by ID. Customer is capitalised because it’s the name of the Mongoose model, following convention that model names are PascalCase.
async function deleteCustomer() {
  await viewCustomers();
  const id = prompt("Enter customer id to delete: ");
  await Customer.findByIdAndDelete(id);
  console.log("Customer deleted.");
}

(async () => {
  try {
    await mainMenu();
  } catch (err) {
    console.error("An error occurred:", err);
    mongoose.connection.close();
  }
})();

// const username = prompt('What is your name? ');

// console.log(`Your name is ${username}`);
