// --- START OF FILE models/Student.js ---
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
    // --- Admission & Course ---
    // Changed: This is now the Manual Roll Number
    admission_number: { type: String, unique: true, required: true, trim: true },
    academic_year: { type: String, trim: true },
    course_type: { type: String, enum: ['GNM', 'Vocational'] },
    course_name: { type: String, enum: ['GNM', 'MPHW', 'MLT'] },
    
    // --- Personal Details ---
    student_name: { type: String, required: true, trim: true },
    father_name: { type: String, trim: true },
    mother_name: { type: String, trim: true },
    dob: { type: Date },
    age: { type: Number },
    gender: { type: String, enum: ['Male', 'Female', 'Transgender'] },
    
    // --- Contact ---
    email: { type: String, trim: true, lowercase: true, sparse: true }, 
    student_mobile: { type: String, trim: true },
    parent_mobile: { type: String, trim: true },

    // --- Address ---
    postal_address: { type: String, trim: true },
    district: { type: String, trim: true },
    mandal: { type: String, trim: true },
    sachivalayam_name: { type: String, trim: true },
    pincode: { type: String, trim: true },
    
    // --- Community ---
    nationality: { type: String, default: 'Indian' },
    religion: { type: String, trim: true },
    caste: { type: String, trim: true },
    sub_caste: { type: String, trim: true },

    // --- Documents & IDs ---
    student_aadhar: { type: String, trim: true, sparse: true },
    mother_aadhar: { type: String, trim: true },
    father_aadhar: { type: String, trim: true },
    mother_bank_acc: { type: String, trim: true },
    bank_ifsc: { type: String, trim: true },
    rice_card_no: { type: String, trim: true },
    caste_cert_no: { type: String, trim: true },
    
    mole_1: { type: String, trim: true },
    mole_2: { type: String, trim: true },

    // --- Education ---
    ssc_hall_ticket: { type: String, trim: true },
    ssc_total_marks: { type: String, trim: true },
    ssc_pass_year: { type: String, trim: true },
    study_cert_ssc: { type: Boolean, default: false },

    inter_hall_ticket: { type: String, trim: true },
    inter_total_marks: { type: String, trim: true },
    inter_pass_year: { type: String, trim: true },
    study_cert_inter: { type: Boolean, default: false },
    transfer_cert_inter: { type: Boolean, default: false },

    // --- File Upload URLs ---
    photo_url: { type: String }, 
    student_aadhar_url: { type: String }, 
    study_cert_ssc_url: { type: String }, 

    // --- Fees ---
    fees: {
        year_1_fee: { type: Number, default: 0 },
        year_2_fee: { type: Number, default: 0 },
        year_3_fee: { type: Number, default: 0 },
        total_fee: { type: Number, default: 0 },
        fee_paid: { type: Number, default: 0 }
    },

    // --- System ---
    password: { type: String, default: 'student123' },
    status: { type: String, enum: ['Active', 'Graduated', 'Dropped Out'], default: 'Active' }

}, { timestamps: true });

// --- HOOKS (Password Hashing Only) ---
studentSchema.pre('save', async function (next) {
    try {
        // REMOVED: Auto-increment logic for admission_number
        
        if (this.isModified('password')) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
        next();
    } catch (err) { next(err); }
});

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);
module.exports = Student;