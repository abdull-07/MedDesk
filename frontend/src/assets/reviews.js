const reviews = [
    {
    id: "rev-001",
    doctor: "Dr. Ayesha Malik",
    patient: "Ali Raza",
    rating: 5,
    comment: "Excellent cardiologist. Very professional and caring.",
    date: "2025-07-01"
    },
    {
    id: "rev-002",
    doctor: "Dr. Kamran Hussain",
    patient: "Fatima Ahmed",
    rating: 4,
    comment: "Helpful advice, but waiting time was long.",
    date: "2025-07-02"
    },
    {
    id: "rev-003",
    doctor: "Dr. Mehwish Iqbal",
    patient: "Hassan Tariq",
    rating: 5,
    comment: "Very knowledgeable and kind doctor.",
    date: "2025-07-03"
    },
    {
    id: "rev-004",
    doctor: "Dr. Osama Javed",
    patient: "Sana Khan",
    rating: 4,
    comment: "Listened patiently and explained everything clearly.",
    date: "2025-07-04"
    },
    {
    id: "rev-005",
    doctor: "Dr. Areeba Zafar",
    patient: "Tahir Mehmood",
    rating: 3,
    comment: "Good but clinic was crowded.",
    date: "2025-07-05"
    },
    {
    id: "rev-006",
    doctor: "Dr. Sana Khalid",
    patient: "Maria Iqbal",
    rating: 5,
    comment: "Great with children, highly recommended!",
    date: "2025-07-06"
    },
    {
    id: "rev-007",
    doctor: "Dr. Salman Rauf",
    patient: "Usman Javed",
    rating: 4,
    comment: "Very thorough eye checkup.",
    date: "2025-07-07"
    },
    {
    id: "rev-008",
    doctor: "Dr. Mahira Shaikh",
    patient: "Zainab Ali",
    rating: 5,
    comment: "Solved my thyroid issue effectively.",
    date: "2025-07-08"
    },
    {
    id: "rev-009",
    doctor: "Dr. Usman Tariq",
    patient: "Bilal Nawaz",
    rating: 4,
    comment: "Helped me with anxiety. Good listener.",
    date: "2025-07-09"
    },
    {
    id: "rev-010",
    doctor: "Dr. Hina Shahid",
    patient: "Kiran Bashir",
    rating: 5,
    comment: "Best gynecologist I've met!",
    date: "2025-07-10"
    },
    {
    id: "rev-011",
    doctor: "Dr. Farooq Ahmed",
    patient: "Noman Anwar",
    rating: 5,
    comment: "Excellent neurologist. Solved a long-term issue.",
    date: "2025-07-11"
    },
    {
    id: "rev-012",
    doctor: "Dr. Zeeshan Latif",
    patient: "Iqra Hanif",
    rating: 3,
    comment: "Average experience. Facility needs improvement.",
    date: "2025-07-12"
    },
    {
    id: "rev-013",
    doctor: "Dr. Nida Yousuf",
    patient: "Ahmad Raza",
    rating: 4,
    comment: "Good service but parking was an issue.",
    date: "2025-07-13"
    },
    {
    id: "rev-014",
    doctor: "Dr. Sobia Hassan",
    patient: "Laiba Fatima",
    rating: 5,
    comment: "Great family doctor. Understands patients well.",
    date: "2025-07-14"
    },
    {
    id: "rev-015",
    doctor: "Dr. Rida Jamil",
    patient: "Rashid Khan",
    rating: 4,
    comment: "Relieved my back pain quickly.",
    date: "2025-07-15"
    },
    {
    id: "rev-016",
    doctor: "Dr. Arsalan Malik",
    patient: "Hiba Noor",
    rating: 5,
    comment: "Very gentle with kids. Highly skilled.",
    date: "2025-07-16"
    },
    {
    id: "rev-017",
    doctor: "Dr. Saima Raza",
    patient: "Taimoor Sultan",
    rating: 3,
    comment: "Had to wait 40 minutes.",
    date: "2025-07-17"
    },
    {
    id: "rev-018",
    doctor: "Dr. Naeem Iqbal",
    patient: "Farah Zafar",
    rating: 4,
    comment: "Nice environment. Doctor was polite.",
    date: "2025-07-18"
    },
    {
    id: "rev-019",
    doctor: "Dr. Asma Khalid",
    patient: "Salman Haider",
    rating: 5,
    comment: "Perfect diagnosis. Very confident doctor.",
    date: "2025-07-19"
    },
    {
    id: "rev-020",
    doctor: "Dr. Bilal Aftab",
    patient: "Amna Yousuf",
    rating: 5,
    comment: "Professional and highly competent.",
    date: "2025-07-20"
    },
    {
    id: "rev-021",
    doctor: "Dr. Ayesha Malik",
    patient: "Shahbaz Ali",
    rating: 4,
    comment: "Follow-up visit went well.",
    date: "2025-07-21"
    },
    {
    id: "rev-022",
    doctor: "Dr. Kamran Hussain",
    patient: "Nida Bukhari",
    rating: 4,
    comment: "Prescribed effective medication.",
    date: "2025-07-22"
    },
    {
    id: "rev-023",
    doctor: "Dr. Mehwish Iqbal",
    patient: "Adnan Sattar",
    rating: 5,
    comment: "Polite, respectful, and clear explanation.",
    date: "2025-07-22"
    },
    {
    id: "rev-024",
    doctor: "Dr. Osama Javed",
    patient: "Lubna Arif",
    rating: 3,
    comment: "Good doctor but rushed consultation.",
    date: "2025-07-22"
    },
    {
    id: "rev-025",
    doctor: "Dr. Areeba Zafar",
    patient: "Usama Talha",
    rating: 4,
    comment: "Eye checkup was smooth.",
    date: "2025-07-22"
    },
    {
    id: "rev-026",
    doctor: "Dr. Sana Khalid",
    patient: "Maira Hassan",
    rating: 5,
    comment: "Extremely good with kids!",
    date: "2025-07-22"
    },
    {
    id: "rev-027",
    doctor: "Dr. Salman Rauf",
    patient: "Noman Farooq",
    rating: 4,
    comment: "Clinic was clean and organized.",
    date: "2025-07-22"
    },
    {
    id: "rev-028",
    doctor: "Dr. Mahira Shaikh",
    patient: "Faiza Tariq",
    rating: 5,
    comment: "Efficient and quick consultation.",
    date: "2025-07-22"
    },
    {
    id: "rev-029",
    doctor: "Dr. Usman Tariq",
    patient: "Hassan Adeel",
    rating: 4,
    comment: "Felt much better after the visit.",
    date: "2025-07-22"
    },
    {
    id: "rev-030",
    doctor: "Dr. Hina Shahid",
    patient: "Sidra Jameel",
    rating: 5,
    comment: "She made me feel comfortable and informed.",
    date: "2025-07-22"
    }
    ];
    
    export default reviews;