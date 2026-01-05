// src/api/dummyData.js

// This array simulates our MongoDB collection.
// The structure matches your Mongoose schema perfectly.
// We use let instead of const to allow our mock API to modify it (e.g., add new students).
export let dummyStudents = [
  {
    "_id": "66a8b1f8f3c7a4b1a63d8e63",
    "admission_number": "A2024MLT001",
    "first_name": "Priya",
    "middle_name": "Kumari",
    "last_name": "Patel",
    "gender": "Female",
    "dob": "2006-08-22",
    "blood_group": "A+",
    "nationality": "Indian",
    "category": "OBC",
    "aadhar_number": "1111-2222-3333",
    "email": "priya.patel@example.com",
    "phone_number": "+91-9876543211",
    "roll_number": "24MLT01",
    "status": "Active",
    "program": "MLT",
    "admission_year": 2024,
    "addresses": [
      { "type": "Permanent", "address_line1": "H.No 4-5-6", "address_line2": "Gandhi Nagar", "city": "Ahmedabad", "state": "Gujarat", "postal_code": "380001", "country": "India" },
      { "type": "Current", "address_line1": "Flat 101, Sunshine Apts", "address_line2": "Navrangpura", "city": "Ahmedabad", "state": "Gujarat", "postal_code": "380009", "country": "India" }
    ],
    "parents": [
      { "name": "Suresh Patel", "relation": "Father", "phone": "+91-9000000011", "email": "suresh.p@example.com", "address": "Ahmedabad" },
      { "name": "Mina Patel", "relation": "Mother", "phone": "+91-9111111122", "email": "mina.p@example.com", "address": "Ahmedabad" }
    ],
    "academics": { "enrollment_date": "2024-07-15", "current_year": 1, "current_semester": 1, "section": "A", "admission_mode": "Merit", "admission_quota": "Category", "previous_qualification": "12th Science", "expected_passed_out_year": 2026, "actual_passed_out_year": null, "graduation_status": "In Progress" },
    "extras": { "profile_photo_url": "https://i.pravatar.cc/150?u=priya", "signature_url": "/signatures/sig_priya.png", "medical_conditions": "None", "hostel_required": true, "transport_required": false, "scholarship_status": false },
    "emergency_contacts": [{ "name": "Rajesh Patel", "relation": "Uncle", "phone": "+91-9222222233" }],
    "created_at": "2024-07-10T11:00:00Z",
    "updated_at": "2024-07-10T11:00:00Z"
  },
  {
    "_id": "66a8b1f8f3c7a4b1b63d8e64",
    "admission_number": "A2024MPHW001",
    "first_name": "Aarav",
    "middle_name": "",
    "last_name": "Sharma",
    "gender": "Male",
    "dob": "2006-03-10",
    "blood_group": "O+",
    "nationality": "Indian",
    "category": "General",
    "aadhar_number": "2222-3333-4444",
    "email": "aarav.sharma@example.com",
    "phone_number": "+91-9876543210",
    "roll_number": "24MPHW01",
    "status": "Active",
    "program": "MPHW",
    "admission_year": 2024,
    "addresses": [
      { "type": "Permanent", "address_line1": "123, MG Road", "address_line2": "Sector 15", "city": "Gurgaon", "state": "Haryana", "postal_code": "122001", "country": "India" },
      { "type": "Current", "address_line1": "123, MG Road", "address_line2": "Sector 15", "city": "Gurgaon", "state": "Haryana", "postal_code": "122001", "country": "India" }
    ],
    "parents": [
      { "name": "Vikas Sharma", "relation": "Father", "phone": "+91-9000000001", "email": "vikas.s@example.com", "address": "Gurgaon" },
      { "name": "Sunita Sharma", "relation": "Mother", "phone": "+91-9111111112", "email": "sunita.s@example.com", "address": "Gurgaon" }
    ],
    "academics": { "enrollment_date": "2024-07-16", "current_year": 1, "current_semester": 1, "section": "B", "admission_mode": "Entrance Exam", "admission_quota": "Merit", "previous_qualification": "12th Arts", "expected_passed_out_year": 2026, "actual_passed_out_year": null, "graduation_status": "In Progress" },
    "extras": { "profile_photo_url": "https://i.pravatar.cc/150?u=aarav", "signature_url": "/signatures/sig_aarav.png", "medical_conditions": "Allergy to dust", "hostel_required": false, "transport_required": true, "scholarship_status": true },
    "emergency_contacts": [{ "name": "Vikas Sharma", "relation": "Father", "phone": "+91-9000000001" }],
    "created_at": "2024-07-11T09:30:00Z",
    "updated_at": "2024-07-11T09:30:00Z"
  },
  {
    "_id": "66a8b1f8f3c7a4b1c63d8e65",
    "admission_number": "A2023MLT002",
    "first_name": "Rohan",
    "middle_name": "",
    "last_name": "Singh",
    "gender": "Male",
    "dob": "2005-01-15",
    "blood_group": "B+",
    "nationality": "Indian",
    "category": "SC",
    "aadhar_number": "3333-4444-5555",
    "email": "rohan.singh@example.com",
    "phone_number": "+91-9876543212",
    "roll_number": "23MLT02",
    "status": "Active",
    "program": "MLT",
    "admission_year": 2023,
    "educational_history": [
        { "level": "10th Grade", "institution_name": "DPS Gurgaon", "board": "CBSE", "year_of_passing": 2022, "marks": { "type": "Percentage", "value": "88.0" } },
        { "level": "12th Grade", "institution_name": "DPS Gurgaon", "board": "CBSE", "year_of_passing": 2024, "marks": { "type": "Percentage", "value": "82.4" } }
    ],
    "addresses": [
      { "type": "Permanent", "address_line1": "Lane 5, Ashok Nagar", "address_line2": "", "city": "Ranchi", "state": "Jharkhand", "postal_code": "834002", "country": "India" }
    ],
    "parents": [
      { "name": "Anil Singh", "relation": "Father", "phone": "+91-9000000022", "email": "anil.s@example.com", "address": "Ranchi" }
    ],
    "academics": { "enrollment_date": "2023-06-20", "current_year": 2, "current_semester": 3, "section": "A", "admission_mode": "Merit", "admission_quota": "Category", "previous_qualification": "12th Science", "expected_passed_out_year": 2025, "actual_passed_out_year": null, "graduation_status": "In Progress" },
    "extras": { "profile_photo_url": "https://i.pravatar.cc/150?u=rohan", "signature_url": "/signatures/sig_rohan.png", "medical_conditions": "None", "hostel_required": true, "transport_required": false, "scholarship_status": true },
    "emergency_contacts": [{ "name": "Sunil Singh", "relation": "Brother", "phone": "+91-9222222244" }],
    "created_at": "2023-06-15T12:00:00Z",
    "updated_at": "2023-06-15T12:00:00Z"
  },
  {
    "_id": "66a8b1f8f3c7a4b1d63d8e66",
    "admission_number": "A2023MPHW003",
    "first_name": "Anjali",
    "middle_name": "",
    "last_name": "Verma",
    "gender": "Female",
    "dob": "2004-11-30",
    "blood_group": "AB+",
    "nationality": "Indian",
    "category": "ST",
    "aadhar_number": "4444-5555-6666",
    "email": "anjali.verma@example.com",
    "phone_number": "+91-9876543213",
    "roll_number": "23MPHW03",
    "status": "Dropped Out",
    "program": "MPHW",
    "admission_year": 2023,
    "educational_history": [
        { "level": "10th Grade", "institution_name": "DPS Gurgaon", "board": "CBSE", "year_of_passing": 2022, "marks": { "type": "Percentage", "value": "88.0" } },
        { "level": "12th Grade", "institution_name": "DPS Gurgaon", "board": "CBSE", "year_of_passing": 2024, "marks": { "type": "Percentage", "value": "82.4" } }
    ],
    "addresses": [
      { "type": "Permanent", "address_line1": "Village Rampur", "address_line2": "Post Office Khas", "city": "Bhopal", "state": "Madhya Pradesh", "postal_code": "462001", "country": "India" }
    ],
    "parents": [
      { "name": "Mahesh Verma", "relation": "Father", "phone": "+91-9000000033", "email": "mahesh.v@example.com", "address": "Bhopal" }
    ],
    "academics": { "enrollment_date": "2023-06-21", "current_year": 1, "current_semester": 2, "section": "C", "admission_mode": "Merit", "admission_quota": "Category", "previous_qualification": "12th Commerce", "expected_passed_out_year": 2025, "actual_passed_out_year": null, "graduation_status": "Dropped Out" },
    "extras": { "profile_photo_url": "https://i.pravatar.cc/150?u=anjali", "signature_url": "/signatures/sig_anjali.png", "medical_conditions": "None", "hostel_required": false, "transport_required": false, "scholarship_status": false },
    "emergency_contacts": [{ "name": "Mahesh Verma", "relation": "Father", "phone": "+91-9000000033" }],
    "created_at": "2023-06-18T14:00:00Z",
    "updated_at": "2024-01-20T10:00:00Z"
  },
  {
    "_id": "66a8b1f8f3c7a4b1e63d8e67",
    "admission_number": "A2022MLT004",
    "first_name": "Sandeep",
    "middle_name": "Raj",
    "last_name": "Kumar",
    "gender": "Male",
    "dob": "2005-05-05",
    "blood_group": "A-",
    "nationality": "Indian",
    "category": "General",
    "aadhar_number": "5555-6666-7777",
    "email": "sandeep.kumar@example.com",
    "phone_number": "+91-9876543214",
    "roll_number": "22MLT04",
    "status": "Graduated",
    "program": "MLT",
    "admission_year": 2022,
    "educational_history": [
        { "level": "10th Grade", "institution_name": "DPS Gurgaon", "board": "CBSE", "year_of_passing": 2022, "marks": { "type": "Percentage", "value": "88.0" } },
        { "level": "12th Grade", "institution_name": "DPS Gurgaon", "board": "CBSE", "year_of_passing": 2024, "marks": { "type": "Percentage", "value": "82.4" } }
    ],
    "addresses": [
      { "type": "Permanent", "address_line1": "789, Park Street", "address_line2": "", "city": "Kolkata", "state": "West Bengal", "postal_code": "700016", "country": "India" }
    ],
    "parents": [
      { "name": "Deepak Kumar", "relation": "Father", "phone": "+91-9000000044", "email": "deepak.k@example.com", "address": "Kolkata" }
    ],
    "academics": { "enrollment_date": "2022-06-22", "current_year": 2, "current_semester": 4, "section": "B", "admission_mode": "Entrance Exam", "admission_quota": "Merit", "previous_qualification": "12th Science", "expected_passed_out_year": 2024, "actual_passed_out_year": "2024-06-15", "graduation_status": "Completed" },
    "extras": { "profile_photo_url": "https://i.pravatar.cc/150?u=sandeep", "signature_url": "/signatures/sig_sandeep.png", "medical_conditions": "None", "hostel_required": true, "transport_required": true, "scholarship_status": false },
    "emergency_contacts": [{ "name": "Amit Kumar", "relation": "Cousin", "phone": "+91-9222222255" }],
    "created_at": "2022-06-19T16:00:00Z",
    "updated_at": "2024-06-20T11:00:00Z"
  }
];