const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CMU-SV Housing App API",
      version: "1.0.0",
      description: "API documentation for CMU-SV Housing Application",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Address: {
          type: "object",
          properties: {
            street: { type: "string" },
            city: { type: "string" },
            state: { type: "string" },
            zipCode: { type: "string" },
          },
        },
        Apartment: {
          type: "object",
          properties: {
            _id: { type: "string" },
            landlord: { type: "string" },
            landlordName: { type: "string" },
            address: { $ref: "#/components/schemas/Address" },
            rent: { type: "number" },
            deposit: { type: "number" },
            availableFrom: { type: "string", format: "date" },
            roomType: { type: "string", enum: ["private", "shared"] },
            numberOfRooms: { type: "number" },
            numberOfBathrooms: { type: "number" },
            squareFootage: { type: "number" },
            amenities: { type: "array", items: { type: "string" } },
            petsAllowed: { type: "boolean" },
            smokingAllowed: { type: "boolean" },
            parkingAvailable: { type: "boolean" },
            images: { type: "array", items: { type: "string" } },
            description: { type: "string" },
            isAvailable: { type: "boolean" },
            requiredDocuments: { type: "array", items: { type: "string" } },
            termsAndConditions: { type: "string" },
          },
        },
        Student: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            linkedinUrl: { type: "string" },
            gender: { type: "string", enum: ["male", "female", "other"] },
            programName: { type: "string" },
            homeCity: { type: "string" },
            homeCountry: { type: "string" },
            roomPreference: { type: "string", enum: ["private", "shared"] },
            smokingPreference: {
              type: "string",
              enum: ["noSmoke", "smoke", "noSmokeHouse"],
            },
            alcoholPreference: {
              type: "string",
              enum: ["noDrink", "drink", "noDrinkHouse"],
            },
            petPreference: {
              type: "string",
              enum: ["noPet", "hasPet", "acceptsPet"],
            },
            foodPreference: {
              type: "string",
              enum: ["veg", "nonVeg", "vegHouse"],
            },
            medicalCondition: { type: "string" },
            otherRequirements: { type: "string" },
            isNewStudent: { type: "boolean" },
            savedListings: { type: "array", items: { type: "string" } },
          },
        },
        Landlord: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" },
            properties: { type: "array", items: { type: "string" } },
          },
        },
        Admin: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            role: { type: "string", enum: ["admin"] },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"], // Path to the API routes folder
};

const specs = swaggerJsdoc(options);

module.exports = specs;
