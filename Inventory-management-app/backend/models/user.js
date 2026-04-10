const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    mobile: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^01[3-9]\d{8}$/, 'দয়া করে সঠিক বাংলাদেশি মোবাইল নম্বর দিন'] 
    },
    email: { type: String, lowercase: true, trim: true, required: true },
    nid: { type: String, unique: true },
    dateOfBirth: { type: Date, required: true },
  
    // ২. পারিবারিক তথ্য (Family Details)
    fatherName: { type: String },
    motherName: { type: String},
    spouseName: { type: String },
    occupation: { type: String },
    monthlyIncome: { type: Number },

    // ৩. ঠিকানা (Address)
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },

    // ৪. নমিনি সংক্রান্ত তথ্য (Nominee Details)
    nomineeName: { type: String, required: true },
    relation: { type: String, required: true },
    nomineeMobile: { type: String },

    // ৫. এডমিশন ও রোল (Admission & Roles)
    admissionDate: { type: Date, default: Date.now },
    role: { type: String, enum: ['member', 'admin', 'boardMember'], default: 'member' },
    admissionFee: { type: Number, required: true },
  
    // ৬. সিকিউরিটি (Security)
    password: { type: String, required: true, minlength: 6 },

    // ৭. ফাইল ও ছবি (Files - সাধারণত Cloudinary বা S3 এর URL এখানে থাকে)
    memberPhoto: { type: String }, // ইমেজ URL
    nidCopy: { type: String },      // ডকুমেন্ট URL
    signature: { type: String },    // সিগনেচার ইমেজ URL

    remarks: { type: String }
},{timestamps: true})


const User = mongoose.model('User', userSchema);

module.exports = User;