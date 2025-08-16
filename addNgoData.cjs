process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1); // Exit with a failure code
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1); // Exit with a failure code
});

const admin = require('firebase-admin');

// IMPORTANT: Replace './serviceAccountKey.json' with the actual path to your downloaded service account key file.
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// --- START: Paste the 10 NGO data objects here ---
const ngoData = [
  {
    organizationName: "Asha Kiran Foundation",
    organizationType: "Charitable Trust",
    contactPerson: "Rajesh Kumar",
    phoneNumber: "+91-9876543210",
    streetAddress: "12, Gandhi Nagar",
    city: "Coimbatore",
    state: "Tamil Nadu",
    website: "https://www.ashakiran.org",
    organizationDescription: "Dedicated to providing education and healthcare to underprivileged children in Coimbatore.",
    email: "info@ashakiran.org",
    registrationDate: new Date()
  },
  {
    organizationName: "Green Earth Guardians",
    organizationType: "Non-Profit Organization",
    contactPerson: "Priya Murugan",
    phoneNumber: "+91-8765432109",
    streetAddress: "25, Valparai Road",
    city: "Coimbatore",
    state: "Tamil Nadu",
    website: "https://www.greenearthguardians.org",
    organizationDescription: "Working towards environmental conservation and sustainable living practices.",
    email: "contact@greenearthguardians.org",
    registrationDate: new Date()
  },
  {
    organizationName: "Elderly Care Coimbatore",
    organizationType: "Community Group",
    contactPerson: "Santhi Devi",
    phoneNumber: "+91-9988776655",
    streetAddress: "50, RS Puram",
    city: "Coimbatore",
    state: "Tamil Nadu",
    website: "", // Optional, so leaving it empty sometimes
    organizationDescription: "Providing support and companionship to senior citizens in the community.",
    email: "elderlycare.cbe@email.com",
    registrationDate: new Date()
  },
  {
    organizationName: "Skill Up Coimbatore",
    organizationType: "Association",
    contactPerson: "Arun Prakash",
    phoneNumber: "+91-7788990011",
    streetAddress: "30, Gandhipuram Main Rd",
    city: "Coimbatore",
    state: "Tamil Nadu",
    website: "https://www.skillupcbe.in",
    organizationDescription: "Offering vocational training and skill development programs for youth.",
    email: "info@skillupcbe.in",
    registrationDate: new Date()
  },
  {
    organizationName: "Animal Welfare Trust CBE",
    organizationType: "Charitable Trust",
    contactPerson: "Meena Lakshmi",
    phoneNumber: "+91-6677889900",
    streetAddress: "15, Race Course Road",
    city: "Coimbatore",
    state: "Tamil Nadu",
    website: "",
    organizationDescription: "Rescuing and rehabilitating stray and abandoned animals.",
    email: "animalwelfare.cbe@email.com",
    registrationDate: new Date()
  },
  {
    organizationName: "Rural Development Initiative",
    organizationType: "Non-Profit Organization",
    contactPerson: "Kumaravelu S.",
    phoneNumber: "+91-5566778899",
    streetAddress: "8, Thudiyalur Bypass",
    city: "Coimbatore",
    state: "Tamil Nadu",
    website: "https://www.ruraldevinit.org",
    organizationDescription: "Focusing on sustainable development projects in rural areas surrounding Coimbatore.",
    email: "contact@ruraldevinit.org",
    registrationDate: new Date()
  },
  {
    organizationName: "Art & Culture Promotion",
    organizationType: "Cultural Society",
    contactPerson: "Divya Reddy",
    phoneNumber: "+91-4455667788",
    streetAddress: "40, DB Road",
    city: "Coimbatore",
    state: "Tamil Nadu",
    website: "https://www.artculturecbe.com",
    organizationDescription: "Promoting local art forms and cultural heritage through workshops and events.",
    email: "support@artculturecbe.com",
    registrationDate: new Date()
  },
  {
    organizationName: "Health for All",
    organizationType: "Foundation",
    contactPerson: "Dr. Anand Singh",
    phoneNumber: "+91-3344556677",
    streetAddress: "22, Trichy Road",
    city: "Coimbatore",
    state: "Tamil Nadu",
    website: "",
    organizationDescription: "Providing accessible healthcare services to marginalized communities.",
    email: "healthforall.cbe@email.com",
    registrationDate: new Date()
  },
  {
    organizationName: "Children's Future Trust",
    organizationType: "Charitable Trust",
    contactPerson: "Shalini Sharma",
    phoneNumber: "+91-2233445566",
    streetAddress: "10, Race Course Annex",
    city: "Coimbatore",
    state: "Tamil Nadu",
    website: "https://www.childrenfuturetrust.org",
    organizationDescription: "Securing a brighter future for children through holistic development programs.",
    email: "admin@childrenfuturetrust.org",
    registrationDate: new Date()
  },
  {
    organizationName: "Women Empowerment Network",
    organizationType: "Non-Governmental Organization",
    contactPerson: "Kavitha Menon",
    phoneNumber: "+91-1122334455",
    streetAddress: "5, Cross Cut Road",
    city: "Coimbatore",
    state: "Tamil Nadu",
    website: "",
    organizationDescription: "Empowering women through livelihood training and awareness campaigns.",
    email: "info@womenempowerment.org",
    registrationDate: new Date()
  }
];
// --- END: Paste the 10 NGO data objects here ---

async function addNgoDataToFirestore() {
  console.log('Starting NGO data import...');
  const collectionName = 'ngos'; // Define the collection name for NGOs

  try {
    const batch = db.batch();
    const collectionRef = db.collection(collectionName);

    console.log(`Adding documents to collection: ${collectionName}`);

    ngoData.forEach(docData => {
      // For NGO registration, you might want to use the email or organization name as a custom ID,
      // or still use Auto-ID. For simplicity and uniqueness, Auto-ID is used here.
      const docRef = collectionRef.doc(); // Generates an Auto-ID
      batch.set(docRef, docData);
    });

    await batch.commit();
    console.log(`Successfully added ${ngoData.length} documents to '${collectionName}'.`);
    console.log('NGO data imported successfully! ✨');
  } catch (error) {
    console.error('Error importing NGO data:', error);
  }
}

addNgoDataToFirestore();
