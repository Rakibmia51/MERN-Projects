const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
require('dotenv').config()
const User = require('./models/user')


const seedAdmin = async ()=>{
    try {
        await mongoose.connect(process.env.DBURL);
        console.log('Database Connected')

        const password = await bcrypt.hash("123456", 10)

        await User.create({
            fullName: "Rakibul Hasan",
            mobile: "01859740867", // Matches your BD regex
            email: "rakib.it.ergon@gmail.com",
            nid: "1234567890123",
            dateOfBirth: new Date("1997-04-12"),

            // Family Details
            fatherName: "Jahangir Alam",
            motherName: "Ayesha Begum",
            spouseName: "Nafisa Akter",
            occupation: "Private Service",
            monthlyIncome: 35000,

            // Address
            presentAddress: "House 12, Road 5, Dhanmondi, Dhaka",
            permanentAddress: "Village: Sonapur, P.O: Ramganj, Lakshmipur",

            // Nominee Details
            nomineeName: "Nafisa Akter",
            relation: "Wife",
            nomineeMobile: "01771091032",

            // Admission & Roles
            admissionDate: new Date(),
            role: "admin",
            admissionFee: 500,

            // Security
            password: password, // Remember to hash this before saving!

            // Files (URLs)
            memberPhoto: "",
            nidCopy: "",
            signature: "",

            remarks: "Verified by local board member."
        })

        console.log("Admin User Created")
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

seedAdmin()