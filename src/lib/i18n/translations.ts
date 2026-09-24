const translations = {
  en: {
    // Home
    'app_title': 'Memory Care',
    'select_role': 'Select your role to continue.',
    'role_caregiver': 'Caregiver / Doctor',
    'role_patient': 'Patient',

    // Settings
    'settings': 'Settings',
    'settings_title': 'Settings',
    'language': 'Language',
    'language_english': 'English',
    'language_thai': 'Thai',
    'save_settings': 'Save Settings',
    'settings_saved': 'Settings saved!',

    // Navigation
    'back': 'Back',
    'exit': 'Exit',
    'home': 'Home',
    'next': 'Next',
    'finish': 'Finish',
    'cancel': 'Cancel',
    'save': 'Save',
    'back_to_profile': 'Back to profile',
    'back_to_games': 'Back to Games',
    'back_to_profile_btn': 'Back to Profile',
    'go_back': 'Go Back',

    // Caregiver
    'new_patient': '＋ New Patient',
    'search_patients': 'Search patients…',
    'no_patients': 'No patients yet. Add one to get started.',
    'no_patients_match': 'No patients match your search.',

    // Patient List
    'your_patients': 'Your Patients',
    'select_patient_continue': 'Select your name to continue.',
    'no_patients_registered': 'No patients registered yet.',
    'create_patient_account': '＋ Create Patient Account',

    // Patient Profile (caregiver view)
    'patient_profile': 'Patient Profile',
    'start_patient_mode': '▶ Start Patient Mode',
    'history': '📊 History',
    'profile_picture': 'Profile Picture',
    'upload_photo': '📷 Upload Photo',
    'change_photo': '🔄 Change Photo',
    'remove': 'Remove',
    'game_photos': 'Game Photos',
    'upload': '📷 Upload',
    'delete': '🗑 Delete',
    'tap_to_select_delete': 'Tap photos to select for deletion.',
    'no_photos_upload': 'No photos yet. Upload photos to use in games.',
    'start_games': '▶ Start Games',
    'change': 'Change',

    // Patient Info
    'chart_no': 'Chart No.',
    'age': 'Age',
    'yrs': 'yrs',
    'gender': 'Gender',
    'male': 'Male',
    'female': 'Female',
    'other': 'Other',
    'phone': 'Phone',
    'country_of_birth': 'Country of Birth',
    'address': 'Address',
    'date_of_birth': 'Date of Birth',
    'height': 'Height',
    'weight': 'Weight',
    'medical_conditions': 'Medical Conditions',
    'dementia_level': 'Dementia Level',
    'mild': 'mild',
    'moderate': 'moderate',
    'severe': 'severe',
    'dementia': 'dementia',

    // Create / Edit Patient
    'create_patient_account_title': 'Create Patient Account',
    'new_patient_title': 'New Patient',
    'edit_profile': 'Edit Profile',
    'full_name': 'Full Name',
    'required': '*',
    'patient_name': 'Patient Name',
    'phone_number': 'Phone Number',
    'address_label': 'Address',
    'height_cm': 'Height (cm)',
    'weight_kg': 'Weight (kg)',
    'patient_photo_optional': 'Patient Photo (Optional)',
    'patient_photo': 'Patient Photo',
    'uploading': 'Creating Account…',
    'create_account': 'Create Account',
    'saving': 'Saving…',
    'save_patient': 'Save Patient',
    'save_changes': 'Save Changes',
    'account_limit_reached': 'Account limit reached',
    'max_3_patients': 'Maximum of 3 patient accounts allowed on this device.',
    'placeholder_name': 'Full name',
    'placeholder_phone': 'e.g. +1 555 000 0000',
    'placeholder_country': 'e.g. United States',
    'placeholder_address': 'Full residential address…',
    'placeholder_height': 'e.g. 165',
    'placeholder_weight': 'e.g. 70',
    'placeholder_medical': 'List any relevant medical conditions…',
    'select_level': 'Select level…',
    'select_gender': 'Select…',
    'new_photo_preview': 'New photo preview',

    // Games
    'games_select_title': 'Games',
    'red_dot_memory': 'Red Dot Memory',
    'connect_wires': 'Connect the Wires',
    'picture_sequence': 'Picture Sequence',
    'matching_picture': 'Matching Picture',
    'shopping_basket': 'Shopping Basket',

    // Red Dot Memory
    'tap_red_dot': 'Tap the red dot',
    'exit_session': 'Exit session',
    'add_photos_before_session': 'Add photos to this patient\'s profile before starting a session.',
    'no_photos_yet': 'No photos uploaded yet.',
    'start_another_session': '▶ Start Another Session',

    // Connect the Wires
    'wires_instruction': 'Match the colors by dragging a wire from left to right.',

    // Picture Sequence
    'drag_arrange_order': 'Drag to arrange in the correct order.',
    'check': 'Check ✓',
    'try_again': 'Try Again',

    // Matching Picture (flip card)
    'matching_picture_instruction': 'Tap cards to find matching pairs.',

    // Shopping Basket
    'basket_instruction': 'Put all fruits into the basket.',
    'banana': 'Banana',
    'strawberry': 'Strawberry',
    'orange': 'Orange',
    'well_done': 'Well done!',
    'great_job': 'Great Job!',
    'exit_game': 'Exit game',

    // Match Picture
    'match_right_picture': 'Match the Right Picture',
    'remember_photo': 'Remember this photo.',
    'continue': 'Continue →',
    'which_photo': 'Which photo was it?',
    'great_job_plain': 'Great Job!',

    // Memory Flip
    'memory_flip': 'Memory Flip Match',
    'min_2_photos': 'Please upload at least 2 photos to play.',

    // Summary
    'session_complete': 'Session Complete',
    'session_summary': 'Session Summary',
    'great_work': 'Great work! Here\'s how the session went.',
    'photos_shown': 'Photos Shown',
    'duration': 'Duration',
    'start_another': '▶ Start Another Session',

    // History
    'patient_history': 'Patient History',
    'overview': 'Overview',
    'total_games': 'Total Games',
    'avg_completion': 'Avg Completion',
    'overall_accuracy': 'Overall Accuracy',
    'active_weeks': 'Active Weeks',
    'mini_game_performance': 'Mini-Game Performance',
    'game': 'Game',
    'games_played': 'Games Played',
    'avg_time': 'Avg Time',
    'accuracy': 'Accuracy',
    'trend': 'Trend',
    'recent_sessions': 'Recent Sessions',
    'date': 'Date',
    'status': 'Status',
    'completed': 'Completed',
    'weekly_progress': 'Weekly Progress',
    'avg_completion_time': 'Avg Completion Time (min)',
    'accuracy_chart': 'Accuracy (%)',
    'games_played_week': 'Games Played per Week',
    'doctor_notes': 'Doctor Notes',
    'not_provided': 'Not provided',

    // Theme
    'theme': 'Theme',
    'light': 'Light',
    'dark': 'Dark',
  },

  th: {
    // Home
    'app_title': 'Memory Care',
    'select_role': 'เลือกบทบาทของคุณเพื่อดำเนินการต่อ',
    'role_caregiver': 'ผู้ดูแล / แพทย์',
    'role_patient': 'ผู้ป่วย',

    // Settings
    'settings': 'ตั้งค่า',
    'settings_title': 'ตั้งค่า',
    'language': 'ภาษา',
    'language_english': 'English',
    'language_thai': 'ไทย',
    'save_settings': 'บันทึกการตั้งค่า',
    'settings_saved': 'บันทึกการตั้งค่าแล้ว!',

    // Navigation
    'back': 'กลับ',
    'exit': 'ออก',
    'home': 'หน้าหลัก',
    'next': 'ถัดไป',
    'finish': 'เสร็จ',
    'cancel': 'ยกเลิก',
    'save': 'บันทึก',
    'back_to_profile': 'กลับไปที่โปรไฟล์',
    'back_to_games': 'กลับไปที่เกม',
    'back_to_profile_btn': 'กลับไปที่โปรไฟล์',
    'go_back': 'กลับ',

    // Caregiver
    'new_patient': '＋ ผู้ป่วยใหม่',
    'search_patients': 'ค้นหาผู้ป่วย…',
    'no_patients': 'ยังไม่มีผู้ป่วย เพิ่มผู้ป่วยใหม่เพื่อเริ่มต้น',
    'no_patients_match': 'ไม่พบผู้ป่วยที่ตรงกับการค้นหา',

    // Patient List
    'your_patients': 'ผู้ป่วยของคุณ',
    'select_patient_continue': 'เลือกชื่อของคุณเพื่อดำเนินการต่อ',
    'no_patients_registered': 'ยังไม่มีผู้ป่วยที่ลงทะเบียน',
    'create_patient_account': '＋ สร้างบัญชีผู้ป่วย',

    // Patient Profile
    'patient_profile': 'โปรไฟล์ผู้ป่วย',
    'start_patient_mode': '▶ เริ่มทำการฝึก',
    'Home':'🏠 หน้าเเรก',
    'history': '📊 ประวัติ',
    'profile_picture': 'รูปโปรไฟล์',
    'upload_photo': '📷 อัพโหลดรูป',
    'change_photo': '🔄 เปลี่ยนรูป',
    'remove': 'ลบ',
    'game_photos': 'รูปภาพเกม',
    'upload': '📷 อัพโหลด',
    'delete': '🗑 ลบ',
    'tap_to_select_delete': 'แตะรูปเพื่อเลือกลบ',
    'no_photos_upload': 'ยังไม่มีรูป อัพโหลดรูปเพื่อใช้ในเกม',
    'start_games': '▶ เริ่มเกม',
    'change': 'เปลี่ยน',

    // Patient Info
    'chart_no': 'หมายเลขผู้ป่วย',
    'age': 'อายุ',
    'yrs': 'ปี',
    'gender': 'เพศ',
    'male': 'ชาย',
    'female': 'หญิง',
    'other': 'อื่นๆ',
    'phone': 'โทรศัพท์',
    'country_of_birth': 'ประเทศเกิด',
    'address': 'ที่อยู่',
    'date_of_birth': 'วันเกิด',
    'height': 'ส่วนสูง',
    'weight': 'น้ำหนัก',
    'medical_conditions': 'โรคประจำตัว',
    'dementia_level': 'ระดับภาวะสมองเสื่อม',
    'mild': 'เล็กน้อย',
    'moderate': 'ปานกลาง',
    'severe': 'รุนแรง',
    'dementia': 'ภาวะสมองเสื่อม',

    // Create / Edit Patient
    'create_patient_account_title': 'สร้างบัญชีผู้ป่วย',
    'new_patient_title': 'ผู้ป่วยใหม่',
    'edit_profile': 'แก้ไขโปรไฟล์',
    'full_name': 'ชื่อ-นามสกุล',
    'required': '*',
    'patient_name': 'ชื่อผู้ป่วย',
    'phone_number': 'หมายเลขโทรศัพท์',
    'address_label': 'ที่อยู่',
    'height_cm': 'ส่วนสูง (ซม.)',
    'weight_kg': 'น้ำหนัก (กก.)',
    'patient_photo_optional': 'รูปผู้ป่วย (ไม่บังคับ)',
    'patient_photo': 'รูปผู้ป่วย',
    'uploading': 'กำลังสร้างบัญชี…',
    'create_account': 'สร้างบัญชี',
    'saving': 'กำลังบันทึก…',
    'save_patient': 'บันทึกผู้ป่วย',
    'save_changes': 'บันทึกการแก้ไข',
    'account_limit_reached': 'ถึงขีดจำกัดบัญชี',
    'max_3_patients': 'อนุญาตให้มีบัญชีผู้ป่วยสูงสุด 3 บัญชีบนอุปกรณ์นี้',
    'placeholder_name': 'ชื่อ-นามสกุล',
    'placeholder_phone': 'เช่น +66 89 000 0000',
    'placeholder_country': 'เช่น ประเทศไทย',
    'placeholder_address': 'ที่อยู่ปัจจุบัน…',
    'placeholder_height': 'เช่น 165',
    'placeholder_weight': 'เช่น 70',
    'placeholder_medical': 'กรุณาระบุโรคประจำตัว…',
    'select_level': 'เลือกระดับ…',
    'select_gender': 'เลือก…',
    'new_photo_preview': 'ตัวอย่างรูปใหม่',

    // Games
    'games_select_title': 'เกม',
    'red_dot_memory': 'จุดแดงจำลอง',
    'connect_wires': 'เชื่อมสายไฟ',
    'picture_sequence': 'เรียงรูปภาพ',
    'matching_picture': 'จับคู่รูปภาพ',
    'shopping_basket': 'ตะกร้าสินค้า',

    // Red Dot Memory
    'tap_red_dot': 'แตะจุดแดง',
    'exit_session': 'ออกจากเซสชัน',
    'add_photos_before_session': 'กรุณาอัพโหลดรูปภาพให้กับผู้ป่วยก่อนเริ่มเซสชัน',
    'no_photos_yet': 'ยังไม่มีรูปภาพ',
    'start_another_session': '▶ เริ่มเซสชันใหม่',

    // Connect the Wires
    'wires_instruction': 'จับคู่สีโดยลากสายไฟจากซ้ายไปขวา',

    // Picture Sequence
    'drag_arrange_order': 'ลากเพื่อเรียงลำดับที่ถูกต้อง',
    'check': 'ตรวจสอบ ✓',
    'try_again': 'ลองอีกครั้ง',

    // Matching Picture
    'matching_picture_instruction': 'แตะการ์ดเพื่อค้นหาคู่ที่ตรงกัน',

    // Shopping Basket
    'basket_instruction': 'ใส่ผลไม้ทั้งหมดลงในตะกร้า',
    'banana': 'กล้วย',
    'strawberry': 'สตรอว์เบอร์รี่',
    'orange': 'ส้ม',
    'well_done': 'ทำได้ดีมาก!',
    'great_job': 'เก่งมาก!',
    'exit_game': 'ออกจากเกม',

    // Match Picture
    'match_right_picture': 'จับคู่รูปภาพที่ถูกต้อง',
    'remember_photo': 'จดจำรูปนี้ไว้',
    'continue': 'ดำเนินการต่อ →',
    'which_photo': 'เป็นรูปไหน?',
    'great_job_plain': 'เก่งมาก!',

    // Memory Flip
    'memory_flip': 'เกมจับคู่พลิกการ์ด',
    'min_2_photos': 'กรุณาอัพโหลดรูปอย่างน้อย 2 รูปเพื่อเล่น',

    // Summary
    'session_complete': 'เซสชันเสร็จสิ้น',
    'session_summary': 'สรุปเซสชัน',
    'great_work': 'ยอดเยี่ยม! นี่คือผลลัพธ์จากเซสชัน',
    'photos_shown': 'รูปที่แสดง',
    'duration': 'ระยะเวลา',
    'start_another': '▶ เริ่มเซสชันใหม่',

    // History
    'patient_history': 'ประวัติผู้ป่วย',
    'overview': 'ภาพรวม',
    'total_games': 'เกมทั้งหมด',
    'avg_completion': 'เวลาเฉลี่ย',
    'overall_accuracy': 'ความแม่นยำโดยรวม',
    'active_weeks': 'สัปดาห์ที่ใช้งาน',
    'mini_game_performance': 'ผลงานเกม',
    'game': 'เกม',
    'games_played': 'จำนวนเกม',
    'avg_time': 'เวลาเฉลี่ย',
    'accuracy': 'ความแม่นยำ',
    'trend': 'แนวโน้ม',
    'recent_sessions': 'เซสชันล่าสุด',
    'date': 'วันที่',
    'status': 'สถานะ',
    'completed': 'เสร็จสิ้น',
    'weekly_progress': 'ความคืบหน้ารายสัปดาห์',
    'avg_completion_time': 'เวลาเฉลี่ย (นาที)',
    'accuracy_chart': 'ความแม่นยำ (%)',
    'games_played_week': 'จำนวนเกมต่อสัปดาห์',
    'doctor_notes': 'บันทึกแพทย์',
    'not_provided': 'ไม่ได้ระบุ',

    // Theme
    'theme': 'ธีม',
    'light': 'สว่าง',
    'dark': 'มืด',
  },
} as const

export type Lang = keyof typeof translations
export type TranslationKey = keyof (typeof translations)['en']

export default translations
