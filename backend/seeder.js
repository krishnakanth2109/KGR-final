const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course');

dotenv.config();

// Using a placeholder image URL. The real image will be uploaded by you via the admin panel.
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/800x600.png?text=Upload+Image";

const courses = [
  {
    slug: "mphw",
    title: "Multi-Purpose Health Worker (MPHW)",
    description: "The Multi-Purpose Health Worker (MPHW) program at KGR Vocational Junior College is designed to prepare students for essential roles in the healthcare sector. This vocational course focuses on community health, basic medical care, and preventive healthcare practices, enabling students to serve as a vital link between healthcare institutions and society.",
    highlights: [
      "Training in primary healthcare services, maternal and child health, and sanitation.",
      "Knowledge of disease prevention, vaccination, and health awareness programs.",
      "Practical exposure through health camps, clinics, and field training.",
      "Skill-building in first aid, patient care, and community outreach.",
    ],
    duration: "2 Years (Full-time)",
    eligibility: "10th or equivalent qualification",
    careerIntro: "Graduates of the MPHW course can work as health workers, support staff in primary health centers, community clinics, NGOs, and professionals in public health programs, maternal health projects, and rural health services.",
    image: PLACEHOLDER_IMAGE,
  },
  {
    slug: "mlt",
    title: "Medical Laboratory Technology (MLT)",
    description: "The Medical Laboratory Technology (MLT) program at KGR Vocational Junior College equips students with the knowledge and technical skills required to work in diagnostic laboratories and healthcare facilities. This course focuses on clinical testing, laboratory procedures, and modern diagnostic techniques, preparing students for crucial roles in the medical field.",
    highlights: [
      "Training in hematology, microbiology, biochemistry, and pathology.",
      "Hands-on practice with laboratory equipment and diagnostic tools.",
      "Guidance on collecting, analyzing, and interpreting clinical samples.",
      "Emphasis on accuracy, safety protocols, and ethical laboratory practices.",
    ],
    duration: "2 Years (Full-time)",
    eligibility: "10th or equivalent qualification",
    careerIntro: "Graduates of the MLT program can pursue careers as laboratory technicians/assistants, phlebotomists, healthcare support staff in pathology labs, and professionals in public health laboratories and medical research organizations.",
    image: PLACEHOLDER_IMAGE,
  },
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for Seeding...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    // Clear any existing courses to avoid creating duplicates if you run it again
    await Course.deleteMany();
    // Insert the new courses array into the database
    await Course.insertMany(courses);

    console.log('✅ Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error with data import:', error);
    process.exit(1);
  }
};

// This function will run automatically
const runSeeder = async () => {
    await connectDB();
    await importData();
};

// Run the seeder
runSeeder();