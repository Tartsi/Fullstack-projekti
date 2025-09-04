// Language translations for the application
export const translations = {
  fi: {
    // Hero
    hero: {
      headline: "Siivoamme Autosi Työpäivän Aikana",
      subheading:
        "Ammattitaitoinen auton sisäsiivous samalla, kun keskityt työhösi. Palaat kotiin puhtaalla autolla.",
      cta: "Varaa Siivous",
      scrollText: "Lue Lisää",
      userProfile: "Käyttäjätiedot",
      login: "Kirjaudu Sisään",
      logout: "Kirjaudu Ulos",
    },
    // Header
    nav: {
      services: "Palvelut",
      process: "Prosessi",
      about: "Tietoa",
      order: "Tilaa",
      contact: "Yhteystiedot",
      login: "Kirjaudu sisään",
    },
    // Auth Modal
    auth: {
      login: "KIRJAUTUMINEN",
      createAccount: "LUO TILI",
      signIn: "Kirjaudu",
      signingIn: "Kirjaudutaan...",
      backToLogin: "<- Takaisin",
      sending: "Lähetetään...",
      createNewUser: "Luo uusi käyttäjä",
      fullName: "Koko Nimi",
      email: "Sähköposti",
      password: "Salasana",
      confirmPassword: "Vahvista Salasana",
      cancel: "Peruuta",
      creating: "Luodaan...",
      registrationSuccess: "Rekisteröinti onnistui!",
      loginSuccess: "Kirjautuminen onnistui!",
      forgotPassword: "Unohditko salasanasi?",
      resetPassword: "PALAUTA SALASANA",
      sendReset: "Lähetä",
      passwordResetSuccess: "Palautusviesti lähetetty!",
      successIcon: "Onnistui",
      errorIcon: "Virhe",
      errors: {
        fullNameRequired: "Koko nimi vaaditaan",
        fullNameShort: "Nimi oltava vähintään 4 kirjainta",
        fullNameTooLong: "Koko nimi on liian pitkä",
        fullNameInvalid: "Sisältää virheellisiä merkkejä",
        emailRequired: "Sähköposti vaaditaan",
        emailInvalid: "Sähköpostiosoite on virheellinen",
        emailTooLong: "Sähköpostiosoite on liian pitkä",
        passwordRequired: "Salasana vaaditaan",
        passwordMinLength: "Tarvitaan vähintään 6 merkkiä",
        passwordTooLong: "Salasana on liian pitkä",
        passwordLowercase: "Tarvitaan vähintään yksi pieni kirjain",
        passwordUppercase: "Tarvitaan vähintään yksi iso kirjain",
        passwordNumber: "Tarvitaan vähintään yksi numero",
        passwordSpaces: "Salasana ei voi sisältää välilyöntejä",
        passwordMismatch: "Salasanat eivät täsmää",
        registrationFailed: "Rekisteröinti epäonnistui.",
        loginFailed: "Kirjautuminen epäonnistui.",
        networkError: "Verkkovirhe.",
      },
    },
    // User Profile
    userProfile: {
      title: "KÄYTTÄJÄSI",
      basicInfo: "PERUSTIEDOT",
      loadingState: "Ladataan käyttäjätietoja...",
      fullName: "KOKO NIMI",
      email: "SÄHKÖPOSTI",
      role: "ROOLI",
      memberSince: "JÄSEN ALKAEN",
      bookings: "VARAUKSENI",
      noBookings: "Sinulla ei ole aktiivisia varauksia.",
      bookingStatus: {
        confirmed: "Vahvistettu",
        draft: "Luonnos",
        cancelled: "Peruttu",
      },
      bookingLocation: "Varauksen sijainti: ",
      loadingBookings: "Ladataan varauksia...",
      deleteAccount: "POISTA TILI",
      deleteConfirm: "VAHVISTA TILIN POISTO",
      deleteWarning:
        "Tämä toiminto poistaa tilisi ja kaikki varauksesi pysyvästi. Syötä salasanasi vahvistaaksesi.",
      enterPassword: "SYÖTÄ SALASANASI",
      confirmDelete: "Vahvista Poisto",
      cancel: "Peruuta",
      deleting: "Poistetaan...",
      accountDeleted: "Tili poistettu onnistuneesti",
      deleteError: "Tilin poistaminen epäonnistui",
      close: "Sulje",
    },
    // Footer
    footer: {
      contact: "Yhteystiedot",
      email: "info@workday-siivouspalvelut.fi",
      phone: "+358 40 123 4567",
      address: "Siivoustie 123, 00100 Helsinki",
      followUs: "Seuraa Meitä Sosiaalisessa Mediassa!",
      socialMedia: {
        twitter: "Twitter",
        linkedin: "LinkedIn",
        github: "GitHub",
        instagram: "Instagram",
        tiktok: "TikTok",
      },
      contactUs: {
        title: "Anna palautetta",
        placeholder: "Kirjoita viestisi tähän (max 150 merkkiä)",
        submit: "Lähetä",
        success: "Viesti lähetetty onnistuneesti!",
        error: "Viestin lähetys epäonnistui. Yritä uudelleen.",
      },
      copyright: "Workday-Vacuumers. Kaikki oikeudet pidätetään.",
    },
    // About section
    about: {
      title: "Mitä on WOCUUMING?",
      descriptionFirst:
        "Nopea ja tehokas palvelu, joka siivoaa autosi sisätilat työpäivän aikana! Kun keskityt työhösi toimistossa, siivouspalvelumme huolehtii autosi puhtaudesta parkkipaikalla.",
      descriptionSecond:
        "Palaat raikkaaseen ja puhtaaseen autoon – eikä sinun tarvitse uhrata viikonloppujasi autosi putsaamiseen. Toimimme Helsinki-Vantaa-Espoo alueella hintaan 49€ (sis. ALV 25,5%).",
      valueProposition:
        "Siivoamme autosi sisätilat työpäivän aikana – jotta voit ajaa kotiin puhtaalla autolla.",
      imagePlaceholder: "Siivouspalvelu työssä",
    },
    // Services section
    services: {
      title: "Palvelut",
      comingSoon: "TULOSSA PIAN!",
    },
    // Explanation/Process section
    explanation: {
      title: "Näin WOCUUMING Toimii",
      subtitle: "Yksinkertainen 6-vaiheinen prosessi puhtaaseen autoon",
      steps: {
        step1: {
          title: "Varaa Aika",
          description: "Varaa kalenterista sinulle sopiva aika ja tee tilaus.",
        },
        step2: {
          title: "Ilmoita Osoite",
          description: "Ilmoita, missä osoitteessa tapaamme sinut ja autosi.",
        },
        step3: {
          title: "Avaa Auto",
          description: "Avaa auto siivoustamme varten.",
        },
        step4: {
          title: "Siivous Käynnissä",
          description: "Siivouksemme kestää 1 tunnin ajan.",
        },
        step5: {
          title: "Siivous Valmis",
          description: "Ilmoitamme sinulle, kun siivous on valmis.",
        },
        step6: {
          title: "Nauti Puhtaudesta",
          description:
            "Lukitse autosi loppupäiväksi ja nauti kotimatkallasi puhtaasta sisätilasta!",
        },
      },
      cta: "Varaa aika nyt!",
    },
    // Pricing Calendar
    pricing: {
      title: "Wocuuming",
      price: "49€",
      vatIncluded: "(ALV sisältyy)",
      perCleaning: "per siivous",
      explanation: "Hintaan sisältyy:",
      services: {
        vacuuming: "Imurointi",
        wiping: "Pintojen pyyhintä",
        windowCleaning: "Ikkunoiden sisäpesu",
        seatCleaning: "Penkkien kuivapesu",
      },
      features: {
        professional: "Ammattitaitoinen siivouspalvelu.",
        convenient: "Aikataulutus miellyttävästi.",
        ecoFriendly: "Ympäristöystävällisiä siivoustuotteita.",
      },
      calendar: {
        bookingInstructions:
          "Varaa sinulle sopiva päivämäärä ja 2 tunnin kellonaika kello 9–17 väliltä, milloin siivous tapahtuu.",
        bookingNote:
          "Huom! Aikaisin varaus on mahdollista kahden päivän päästä tästä päivästä.",
        selectDate: "Valitse päivämäärä",
        selectTimeSlot: "Valitse aika",
        legend: {
          fourSlots: "4 aikaa",
          threeSlots: "3 aikaa",
          twoSlots: "2 aikaa",
          oneSlot: "1 aika",
          none: "ei vapaita",
        },
        weekDays: {
          sun: "Su",
          mon: "Ma",
          tue: "Ti",
          wed: "Ke",
          thu: "To",
          fri: "Pe",
          sat: "La",
        },
        months: {
          january: "Tammikuu",
          february: "Helmikuu",
          march: "Maaliskuu",
          april: "Huhtikuu",
          may: "Toukokuu",
          june: "Kesäkuu",
          july: "Heinäkuu",
          august: "Elokuu",
          september: "Syyskuu",
          october: "Lokakuu",
          november: "Marraskuu",
          december: "Joulukuu",
        },
        week: "Viikko",
        pleaseSelectDate: "Valitse ensin päivämäärä",
        selectDateTime: "Valitse Päivä ja Aika",
        confirmBooking: "Vahvista Varaus",
        bookingConfirmation:
          "Varaus vahvistettu ajalle {date} kello {start} - {end}",
      },
      payment: {
        title: "Maksu",
        subtitle: "Valitse maksutapa varauksen viimeistelemiseksi",
        methods: {
          card: "Kortti",
          mobilepay: "MobilePay",
          bank: "Pankki",
          cash: "Käteinen",
        },
        helpTooltip: "Maksuehdot",
        helpContent:
          "• Varaus maksetaan etukäteen valitsemallasi maksutavalla.\n• Voit peruuttaa varauksen veloituksetta 12h varauksen jälkeen.\n• Yli 12h peruutuksista palautamme maksun, mutta pidätämme 10 € käyttämättömän varauksen käsittelymaksuna.\n• Palautus hyvitetään alkuperäiselle maksutavalle 3–5 arkipäivän kuluessa.\n• No-show (ei peruutusta) → maksua ei palauteta.\n• Kaikki hinnat sisältävät ALV:n.",
        location: {
          title: "Sijainti",
          subtitle: "Valitse kaupunki ja anna osoite",
          cities: {
            helsinki: "Helsinki",
            vantaa: "Vantaa",
            espoo: "Espoo",
          },
          addressPlaceholder: 'Muoto: "Esimerkkitie 14 A, 00750"',
        },
        confirmPayment: "Vahvista Maksu",
        selectDateTime: "Valitse Päivä ja Aika",
      },
    },
    // Reviews section
    reviews: {
      headline: "Wocuuming pelasti päiväni!",
      overall: "Kokonaisarvosana",
    },
    // Main content
    content: {
      welcome: "Tervetuloa",
      description: "Ammattitaitoista siivouspalvelua työpaikallesi",
      getStarted: "Aloita tästä",
    },
  },
  en: {
    // Hero
    hero: {
      headline: "We Clean Your Car During Your Workday",
      subheading:
        "Professional car interior cleaning while you focus on work. Return home with a clean car.",
      cta: "Book Cleaning",
      scrollText: "Learn More",
      userProfile: "Profile",
      login: "Log In",
      logout: "Log Out",
    },
    // Header
    nav: {
      services: "Services",
      process: "Process",
      about: "About",
      order: "Order",
      contact: "Contact",
      login: "Log in",
    },
    // Auth Modal
    auth: {
      login: "LOGIN",
      createAccount: "CREATE ACCOUNT",
      signIn: "Sign In",
      signingIn: "Signing In...",
      backToLogin: "<- Back",
      sending: "Sending...",
      createNewUser: "Create new user",
      fullName: "Full Name",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      cancel: "Cancel",
      creating: "Creating...",
      registrationSuccess: "Registration successful!",
      loginSuccess: "Login successful!",
      forgotPassword: "Forgot your password?",
      resetPassword: "RESET PASSWORD",
      sendReset: "Send",
      passwordResetSuccess: "Email sent successfully!",
      successIcon: "Success",
      errorIcon: "Error",
      errors: {
        fullNameRequired: "Full name is required",
        fullNameShort: "Must have at least 4 characters",
        fullNameTooLong: "Full name is too long",
        fullNameInvalid: "Contains invalid characters",
        emailRequired: "Email is required",
        emailInvalid: "Email address is invalid",
        emailTooLong: "Email address is too long",
        passwordRequired: "Password is required",
        passwordMinLength: "Must have at least 6 characters",
        passwordTooLong: "Password is too long",
        passwordLowercase: "At least one lowercase letter required",
        passwordUppercase: "At least one uppercase letter required",
        passwordNumber: "Must contain at least one number",
        passwordSpaces: "Cannot contain spaces",
        passwordMismatch: "Passwords do not match",
        registrationFailed: "Registration failed.",
        loginFailed: "Login failed.",
        networkError: "Network error.",
      },
    },
    // User Profile
    userProfile: {
      title: "YOUR PROFILE",
      basicInfo: "BASIC INFO",
      loadingState: "Loading user details...",
      fullName: "FULL NAME",
      email: "EMAIL",
      role: "ROLE",
      memberSince: "MEMBER SINCE",
      bookings: "My Bookings",
      noBookings: "You have no active bookings.",
      bookingStatus: {
        confirmed: "Confirmed",
        draft: "Draft",
        cancelled: "Cancelled",
      },
      loadingBookings: "Loading bookings...",
      bookingLocation: "Booking location: ",
      deleteAccount: "DELETE ACCOUNT",
      deleteConfirm: "CONFIRM ACCOUNT DELETION",
      deleteWarning:
        "This action will permanently delete your account and all your bookings. Enter your password to confirm.",
      enterPassword: "ENTER YOUR PASSWORD",
      confirmDelete: "Confirm Deletion",
      cancel: "Cancel",
      deleting: "Deleting...",
      accountDeleted: "Account deleted successfully",
      deleteError: "Failed to delete account",
      close: "Close",
    },
    // Footer
    footer: {
      contact: "Contact",
      email: "info@workday-vacuumers.com",
      phone: "+358 40 123 4567",
      address: "123 Clean Street, 00100 Helsinki",
      followUs: "Follow Us On Social Media!",
      socialMedia: {
        twitter: "Twitter",
        linkedin: "LinkedIn",
        github: "GitHub",
        instagram: "Instagram",
        tiktok: "TikTok",
      },
      contactUs: {
        title: "Feedback",
        placeholder: "Write your message here (max 150 characters)",
        submit: "Send",
        success: "Message sent successfully!",
        error: "Failed to send message. Please try again.",
      },
      copyright: "Workday-Vacuumers. All rights reserved.",
    },
    // About section
    about: {
      title: "What is WOCUUMING?",
      descriptionFirst:
        "WOCUUMING, short for Workday-Vacuuming, is a fast and efficient service that cleans your car interior during your workday! While you focus on your work, our cleaning service takes care of your car's interior in the parking lot.",
      descriptionSecond:
        "Return from work to a fresh and clean car – no need to sacrifice your weekends cleaning your car. We operate in the Helsinki-Vantaa-Espoo area for 49€ (VAT 25,5% included).",
      valueProposition:
        "We clean your car interior during your workday – so you can drive home in a clean car.",
      imagePlaceholder: "Cleaning service at work",
    },
    // Services section
    services: {
      title: "Services",
      comingSoon: "COMING SOON!",
    },
    // Explanation/Process section
    explanation: {
      title: "How WOCUUMING Works",
      subtitle: "Simple 6-step process to a clean car",
      steps: {
        step1: {
          title: "Book Time",
          description:
            "Book a suitable time from the calendar and place your order.",
        },
        step2: {
          title: "Provide Address",
          description: "Tell us where we can meet you and your car.",
        },
        step3: {
          title: "Open Car",
          description: "Open your car for our cleaning service.",
        },
        step4: {
          title: "Cleaning in Progress",
          description: "Our cleaning takes 1 hour.",
        },
        step5: {
          title: "Cleaning Complete",
          description: "We notify you when the cleaning is finished.",
        },
        step6: {
          title: "Enjoy Cleanliness",
          description:
            "Lock your car for the work day and enjoy the clean interior on your ride home!",
        },
      },
      cta: "Reserve a time now!",
    },
    // Pricing Calendar
    pricing: {
      title: "Wocuuming",
      price: "49€",
      vatIncluded: "(VAT included)",
      perCleaning: "per cleaning",
      explanation: "Included:",
      services: {
        vacuuming: "Vacuuming",
        wiping: "Surface wiping",
        windowCleaning: "Interior window cleaning",
        seatCleaning: "Dry seat cleaning",
      },
      features: {
        professional: "Professional cleaning service.",
        convenient: "Scheduled at your convenience.",
        ecoFriendly: "Eco-friendly cleaning products.",
      },
      calendar: {
        bookingInstructions:
          "Book a suitable date and 2-hour time slot between 9AM–5PM during which the cleaning will take place.",
        bookingNote:
          "Note! The earliest booking is possible two days from today!",
        selectDate: "Select date",
        selectTimeSlot: "Select time",
        legend: {
          fourSlots: "4 slots",
          threeSlots: "3 slots",
          twoSlots: "2 slots",
          oneSlot: "1 slot",
          none: "none",
        },
        weekDays: {
          sun: "Sun",
          mon: "Mon",
          tue: "Tue",
          wed: "Wed",
          thu: "Thu",
          fri: "Fri",
          sat: "Sat",
        },
        months: {
          january: "January",
          february: "February",
          march: "March",
          april: "April",
          may: "May",
          june: "June",
          july: "July",
          august: "August",
          september: "September",
          october: "October",
          november: "November",
          december: "December",
        },
        week: "Week",
        pleaseSelectDate: "Please select a date first",
        selectDateTime: "Select Date and Time",
        confirmBooking: "Confirm Booking",
        bookingConfirmation:
          "Booking confirmed for {date} from {start} to {end}",
      },
      payment: {
        title: "Payment",
        subtitle: "Select payment method to complete your booking",
        methods: {
          card: "Card",
          mobilepay: "MobilePay",
          bank: "Bank",
          cash: "Cash",
        },
        helpTooltip: "Payment Terms",
        helpContent:
          "• Booking is paid in advance using your chosen payment method.\n• You can cancel the booking free of charge for up to 12h after reservation.\n• For cancellations over 12 hours from booking, we refund the payment but retain €10 as a processing fee for unused bookings.\n• Refunds are credited to the original payment method within 3–5 business days.\n• No-show (no cancellation) → no refund.\n• All prices include VAT.",
        location: {
          title: "Location",
          subtitle: "Select city and exact address",
          cities: {
            helsinki: "Helsinki",
            vantaa: "Vantaa",
            espoo: "Espoo",
          },
          addressPlaceholder: 'Format: "Example Street 14 A, 00750"',
        },
        confirmPayment: "Confirm Payment",
        selectDateTime: "Select Date and Time",
      },
    },
    // Reviews section
    reviews: {
      headline: "Wocuuming polished my day!",
      overall: "Overall Rating",
    },
    // Main content
    content: {
      welcome: "Welcome",
      description: "Professional cleaning service for your workplace",
      getStarted: "Get Started",
    },
  },
};
