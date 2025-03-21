const translations = {
  common: {
    loading: 'Yükleniyor...',
    error: 'Bir hata oluştu',
    success: 'İşlem başarıyla tamamlandı',
    save: 'Kaydet',
    cancel: 'İptal',
    delete: 'Sil',
    edit: 'Düzenle',
    create: 'Oluştur',
    search: 'Ara',
    filter: 'Filtrele',
    sort: 'Sırala',
    next: 'İleri',
    previous: 'Geri',
    submit: 'Gönder',
    reset: 'Sıfırla',
    noResults: 'Sonuç bulunamadı',
  },
  auth: {
    login: 'Giriş Yap',
    logout: 'Çıkış Yap',
    register: 'Kayıt Ol',
    forgotPassword: 'Şifremi Unuttum?',
    noAccount: 'Hesabınız yok mu?',
    haveAccount: 'Zaten hesabınız var mı?',
    resetPassword: 'Şifre Sıfırla',
    email: 'E-posta',
    password: 'Şifre',
    confirmPassword: 'Şifre Tekrar',
    rememberMe: 'Beni Hatırla',
    firstName: 'Ad',
    lastName: 'Soyad',
    invalidCredentials: 'Geçersiz e-posta veya şifre',
    accountCreated: 'Hesap başarıyla oluşturuldu',
    passwordResetSent: 'Şifre sıfırlama talimatları e-posta adresinize gönderildi',
    passwordResetSuccess: 'Şifre başarıyla sıfırlandı',
    registrationError: 'Kayıt işlemi başarısız oldu. Lütfen tekrar deneyin.',
    emailExists: 'Bu e-posta adresi zaten kullanımda',
    weakPassword: 'Şifre çok zayıf',
    resetPasswordDescription: 'E-posta adresinizi girin, şifrenizi sıfırlamak için talimatları size gönderelim.',
    sendResetLink: 'Sıfırlama Bağlantısı Gönder',
    backToLogin: 'Girişe Dön',
    resetPasswordError: 'Sıfırlama talimatları gönderilemedi. Lütfen tekrar deneyin.',
    invalidResetToken: 'Geçersiz veya süresi dolmuş sıfırlama bağlantısı',
    newPassword: 'Yeni Şifre',
    confirmNewPassword: 'Yeni Şifre Tekrar',
    requestNewResetLink: 'Yeni sıfırlama bağlantısı iste',
    passwordResetSuccessMessage: 'Şifreniz başarıyla sıfırlandı. Artık yeni şifrenizle giriş yapabilirsiniz.',
  },
  validation: {
    required: 'Bu alan zorunludur',
    email: 'Geçersiz e-posta adresi',
    minLength: 'En az {{min}} karakter olmalıdır',
    maxLength: 'En fazla {{max}} karakter olmalıdır',
    passwordMatch: 'Şifreler eşleşmelidir',
  },
  errors: {
    generic: 'Bir şeyler yanlış gitti',
    network: 'Ağ hatası',
    unauthorized: 'Yetkisiz erişim',
    forbidden: 'Erişim engellendi',
    notFound: 'Bulunamadı',
  },
  navigation: {
    home: 'Ana Sayfa',
    profile: 'Profil',
    settings: 'Ayarlar',
    dashboard: 'Kontrol Paneli',
    courses: 'Dersler',
    assignments: 'Ödevler',
    calendar: 'Takvim',
  },
  dashboard: {
    welcomeMessage: 'Hoş geldiniz! İşte öğrenme yolculuğunuzun genel bakışı.',
    totalCourses: 'Toplam Ders',
    pendingAssignments: 'Bekleyen Ödevler',
    upcomingEvents: 'Yaklaşan Etkinlikler',
    progress: 'Genel İlerleme',
    learningProgress: 'Öğrenme İlerlemesi',
  },
  admin: {
    title: 'Yönetici Paneli',
    welcomeMessage: 'Yönetici paneline hoş geldiniz. Burada kullanıcıları, dersleri ve sistem ayarlarını yönetebilirsiniz.',
    users: {
      title: 'Kullanıcı Yönetimi',
      addUser: 'Kullanıcı Ekle',
      editUser: 'Kullanıcı Düzenle',
      deleteUser: 'Kullanıcı Sil',
      role: 'Rol',
      status: 'Durum',
      actions: 'İşlemler',
    },
    courses: {
      title: 'Ders Yönetimi',
      addCourse: 'Ders Ekle',
      editCourse: 'Ders Düzenle',
      deleteCourse: 'Ders Sil',
      status: 'Durum',
      instructor: 'Eğitmen',
      students: 'Öğrenciler',
      actions: 'İşlemler',
    },
    settings: {
      title: 'Sistem Ayarları',
      general: 'Genel Ayarlar',
      email: 'E-posta Ayarları',
      security: 'Güvenlik Ayarları',
      save: 'Ayarları Kaydet',
    },
  },
};

export default translations; 