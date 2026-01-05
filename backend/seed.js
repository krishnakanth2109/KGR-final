// --- START OF FILE backend/seed.js ---

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('./models/Student'); 

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected for Seeding'))
.catch(err => {
    console.error('❌ DB Connection Error:', err);
    process.exit(1);
});

const seedData = async () => {
    try {
        // --- STEP 1: FIX THE ZOMBIE INDEX ---
        // We try to drop the old index that is causing the crash.
        // We wrap it in try/catch in case the index is already gone.
        try {
            await Student.collection.dropIndex('rollNo_1');
            console.log("🔧 Fixed: Old 'rollNo' index dropped.");
        } catch (e) {
            // Ignore error if index doesn't exist
            if (e.codeName !== 'IndexNotFound') {
                console.log("ℹ️  Note: No old 'rollNo' index found (this is good).");
            }
        }

        // --- STEP 2: DEFINE DATA ---
        const testStudent = {
            admission_number: "STD-DEMO-001",
            roll_number: "101",
            first_name: "Demo",
            last_name: "Student",
            email: "student@demo.com",
            password: "password123", // Will be hashed by pre-save hook
            phone_number: "9876543210",
            gender: "Male",
            dob: new Date("2000-01-01"),
            program: "MPHW",
            admission_year: 2024,
            status: "Active",
            category: "General",
            addresses: [
                {
                    type: "Permanent",
                    address_line1: "123 Demo Lane",
                    city: "Tech City",
                    state: "AP",
                    postal_code: "533003"
                }
            ],
            parents: [
                {
                    relation: "Father",
                    name: "Demo Parent",
                    phone: "9876543210"
                }
            ]
        };

        // --- STEP 3: CLEANUP OLD DATA ---
        // Remove any existing student with this email OR admission number to prevent duplicates
        await Student.deleteMany({ 
            $or: [
                { email: testStudent.email }, 
                { admission_number: testStudent.admission_number }
            ] 
        });
        console.log("🗑️  Cleared existing demo student data.");

        // --- STEP 4: CREATE NEW STUDENT ---
        const newStudent = new Student(testStudent);
        await newStudent.save();

        console.log("------------------------------------------------");
        console.log("✅ Student Seeded Successfully!");
        console.log("------------------------------------------------");
        console.log("You can now login with:");
        console.log("📧 Email:      student@demo.com");
        console.log("🆔 Admission:  STD-DEMO-001");
        console.log("🔑 Password:   password123");
        console.log("------------------------------------------------");

        process.exit();

    } catch (error) {
        console.error("❌ Seeding Error Details:", error);
        process.exit(1);
    }
};

seedData();