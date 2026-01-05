// src/api/facultyDummyData.js

// This array simulates our MongoDB collection for faculty members.
// We use `let` to allow our mock API to modify it in memory if needed.
export let dummyFaculty = [
  {
    "_id": "FAC1001",
    "faculty_id": "FAC2020MLT01",
    "first_name": "Prakash",
    "last_name": "Rao",
    "gender": "Male",
    "dob": "1985-04-12",
    "email": "prakash.rao@example.com",
    "phone_number": "+91-9876543210",
    "status": "Active", // Active, On Leave, Resigned
    "date_of_joining": "2020-08-01",
    "department": "MLT", // Medical Laboratory Technology
    "designation": "Head of Department",
    "qualifications": [
      { "degree": "M.Sc. in Medical Laboratory Technology", "institution": "University of Health Sciences", "year": 2010 },
      { "degree": "Ph.D. in Microbiology", "institution": "Indian Institute of Science", "year": 2015 }
    ],
    "address": {
      "address_line1": "Flat 301, Scholars Apartments",
      "city": "Hyderabad",
      "state": "Telangana",
      "postal_code": "500082"
    },
    "extras": { "profile_photo_url": "https://i.pravatar.cc/150?u=prakash" },
    "createdAt": "2020-08-01T09:00:00Z",
    "updatedAt": "2023-05-10T14:30:00Z"
  },
  {
    "_id": "FAC1002",
    "faculty_id": "FAC2021MPHW01",
    "first_name": "Sunita",
    "last_name": "Reddy",
    "gender": "Female",
    "dob": "1990-07-25",
    "email": "sunita.reddy@example.com",
    "phone_number": "+91-9123456789",
    "status": "Active",
    "date_of_joining": "2021-06-15",
    "department": "MPHW", // Multi-Purpose Health Worker
    "designation": "Senior Lecturer",
    "qualifications": [
      { "degree": "M.Sc. in Community Health", "institution": "Apollo Institute", "year": 2014 }
    ],
    "address": {
      "address_line1": "Plot 78, Jubilee Hills",
      "city": "Hyderabad",
      "state": "Telangana",
      "postal_code": "500033"
    },
    "extras": { "profile_photo_url": "https://i.pravatar.cc/150?u=sunita" },
    "createdAt": "2021-06-15T09:00:00Z",
    "updatedAt": "2022-08-20T11:00:00Z"
  },
  {
    "_id": "FAC1003",
    "faculty_id": "FAC2022MLT02",
    "first_name": "Anil",
    "last_name": "Kumar",
    "gender": "Male",
    "dob": "1992-01-30",
    "email": "anil.kumar@example.com",
    "phone_number": "+91-9988776655",
    "status": "Active",
    "date_of_joining": "2022-09-01",
    "department": "MLT",
    "designation": "Lecturer",
    "qualifications": [
      { "degree": "B.Sc. in Medical Laboratory Technology", "institution": "Osmania University", "year": 2016 },
      { "degree": "M.Sc. in Hematology", "institution": "NIMS", "year": 2018 }
    ],
    "address": {
      "address_line1": "H.No 1-1-23, Gachibowli",
      "city": "Hyderabad",
      "state": "Telangana",
      "postal_code": "500032"
    },
    "extras": { "profile_photo_url": "https://i.pravatar.cc/150?u=anil" },
    "createdAt": "2022-09-01T09:00:00Z",
    "updatedAt": "2022-09-01T09:00:00Z"
  },
  {
    "_id": "FAC1004",
    "faculty_id": "FAC2019MPHW02",
    "first_name": "Meena",
    "last_name": "Gupta",
    "gender": "Female",
    "dob": "1988-11-05",
    "email": "meena.gupta@example.com",
    "phone_number": "+91-9555511111",
    "status": "On Leave",
    "date_of_joining": "2019-07-20",
    "department": "MPHW",
    "designation": "Senior Lecturer",
    "qualifications": [
      { "degree": "Master of Public Health (MPH)", "institution": "JIPMER", "year": 2012 }
    ],
    "address": {
      "address_line1": "8-2-293, Road No. 14",
      "city": "Hyderabad",
      "state": "Telangana",
      "postal_code": "500034"
    },
    "extras": { "profile_photo_url": "https://i.pravatar.cc/150?u=meena" },
    "createdAt": "2019-07-20T09:00:00Z",
    "updatedAt": "2024-06-01T10:00:00Z"
  }
];