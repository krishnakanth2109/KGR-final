const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Admin = require('./models/admin'); // Make sure path to your model is correct

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for Admin Seeding...');
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};

const createAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.Admin_mail_Id;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('❌ Please set Admin_mail_Id and ADMIN_PASSWORD in your .env file.');
      process.exit(1);
    }

    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('ℹ️ Admin user already exists. Seeder will not run.');
      process.exit();
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const admin = new Admin({
      email: adminEmail,
      password: hashedPassword,
    });

    await admin.save();
    console.log(`✅ Admin User '${adminEmail}' Created Successfully!`);
    process.exit();
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();