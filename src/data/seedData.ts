import { Category, Question, Lesson, User, QuizResult, LeaderboardEntry } from '../types/quiz';

export const SEED_CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Phishing',
    shortLetter: 'P',
    description: 'Spot deceptive emails, spear phishing, smishing, vishing, and malicious links designed to steal your credentials.',
    iconName: 'FishHook',
    accentColor: 'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30',
  },
  {
    id: 2,
    name: 'Malware',
    shortLetter: 'M',
    description: 'Understand viruses, ransomware, trojans, worms, spyware, botnets, and how to protect devices with clean backups.',
    iconName: 'Bug',
    accentColor: 'from-rose-500/20 to-red-500/10 text-rose-400 border-rose-500/30',
  },
  {
    id: 3,
    name: 'Password Security',
    shortLetter: 'K',
    description: 'Master impenetrable passphrases, credential stuffing defense, password managers, and multi-factor authentication.',
    iconName: 'KeyRound',
    accentColor: 'from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/30',
  },
  {
    id: 4,
    name: 'Online Safety',
    shortLetter: 'S',
    description: 'Safe browsing on public Wi-Fi, VPNs, digital footprints, social engineering awareness, and photo privacy.',
    iconName: 'ShieldCheck',
    accentColor: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30',
  },
];

export const RAW_QUESTIONS_DATA: Array<{
  category: 'Phishing' | 'Malware' | 'Password Security' | 'Online Safety';
  text: string;
  correct: string;
  wrong: [string, string, string];
  explanation: string;
}> = [
  // ---------------------------------------------------------------- Phishing (15)
  {
    category: 'Phishing',
    text: 'Which of these is a common sign of a phishing email?',
    correct: 'Urgent threat to close your account unless you click a link',
    wrong: [
      'A message from a colleague you were expecting',
      'An email with your correct name and no links',
      'A newsletter you subscribed to',
    ],
    explanation: 'Phishing emails create urgency and fear so that people click without thinking.',
  },
  {
    category: 'Phishing',
    text: 'What should you do before clicking a link in an unexpected email?',
    correct: 'Hover over the link to check the real address',
    wrong: [
      'Click quickly before it expires',
      'Forward it to friends',
      'Reply with your password',
    ],
    explanation: 'Hovering shows the real destination, which often differs from the text displayed.',
  },
  {
    category: 'Phishing',
    text: 'A bank SMS asks you to confirm your PIN through a link. What is this?',
    correct: 'Smishing, a phishing attack by SMS',
    wrong: [
      'A normal security check',
      'A reward from the bank',
      'A software update',
    ],
    explanation: 'Banks never ask for your PIN or OTP through a message.',
  },
  {
    category: 'Phishing',
    text: 'Which of these is the safest way to check a bank message?',
    correct: 'Call the number printed on your card',
    wrong: [
      'Click the link in the SMS',
      'Reply with your OTP',
      'Ignore all bank messages',
    ],
    explanation: 'Contact the bank using details from your card or official app.',
  },
  {
    category: 'Phishing',
    text: 'What is spear phishing?',
    correct: 'A phishing attack aimed at a specific person or organisation',
    wrong: [
      'Phishing sent only through voice calls',
      'A virus that spreads by USB drives',
      'A fake antivirus pop-up',
    ],
    explanation: 'Spear phishing uses personal details to look convincing to a chosen target.',
  },
  {
    category: 'Phishing',
    text: 'What is vishing?',
    correct: 'Phishing carried out through phone calls',
    wrong: [
      'Phishing through video games',
      'A virus hidden in videos',
      'Phishing by postal mail',
    ],
    explanation: 'Vishing is voice phishing: callers pretend to be banks or support staff.',
  },
  {
    category: 'Phishing',
    text: 'Which sender address is the most suspicious?',
    correct: 'support@paypa1-security.com',
    wrong: [
      'support@paypal.com',
      'no-reply@paypal.com',
      'help@paypal.com',
    ],
    explanation: 'Look-alike domains swap letters for numbers (paypa1) to fool readers.',
  },
  {
    category: 'Phishing',
    text: 'An attachment named invoice.pdf.exe arrives from an unknown sender. What should you do?',
    correct: 'Delete it and report it',
    wrong: [
      'Open it to check what it is',
      'Save it to the desktop',
      'Forward it to your team',
    ],
    explanation: 'A double extension hides a program that can install malware.',
  },
  {
    category: 'Phishing',
    text: 'What does the padlock in the browser address bar prove?',
    correct: 'The connection is encrypted, not that the site is trustworthy',
    wrong: [
      'The site is safe from all fraud',
      'The site is owned by a bank',
      'The site has no advertisements',
    ],
    explanation: 'Criminals can also get HTTPS certificates, so always check the domain name too.',
  },
  {
    category: 'Phishing',
    text: "A 'CEO' emails asking you to buy gift cards urgently and keep it secret. This is most likely:",
    correct: 'Business email compromise (CEO fraud)',
    wrong: [
      'A genuine team reward',
      'A system update',
      'A tax refund',
    ],
    explanation: 'Urgency and secrecy are classic signs of CEO fraud.',
  },
  {
    category: 'Phishing',
    text: 'What is the best way to report a phishing email at work?',
    correct: 'Use the report-phishing button or inform the IT security team',
    wrong: [
      'Reply and ask the sender if it is real',
      'Forward it to all colleagues as a warning',
      'Ignore it',
    ],
    explanation: 'Reporting helps the security team block the sender for everyone.',
  },
  {
    category: 'Phishing',
    text: 'You entered your password on a fake page. What should you do first?',
    correct: 'Change the password immediately and enable MFA',
    wrong: [
      'Wait to see if anything happens',
      'Delete the email only',
      'Restart the computer',
    ],
    explanation: 'Quick action limits the damage; also change any other account that used the same password.',
  },
  {
    category: 'Phishing',
    text: 'Phishing emails often contain:',
    correct: "Generic greetings such as 'Dear customer'",
    wrong: [
      'Your full account number written correctly',
      'A signed message from your IT team',
      'No links or attachments at all',
    ],
    explanation: 'Attackers send the same message to many people, so they rarely know your name.',
  },
  {
    category: 'Phishing',
    text: 'What is a QR-code phishing attack called?',
    correct: 'Quishing',
    wrong: [
      'Pharming',
      'Sniffing',
      'Tailgating',
    ],
    explanation: 'Quishing hides a malicious link in a QR code. Scan only codes from trusted sources.',
  },
  {
    category: 'Phishing',
    text: 'Why do attackers use shortened links in phishing messages?',
    correct: 'They hide the real destination address',
    wrong: [
      'They make websites faster',
      'They improve email security',
      'Email providers require them',
    ],
    explanation: 'A short link hides where it leads, so check it with a link-preview tool before opening.',
  },

  // ----------------------------------------------------------------- Malware (15)
  {
    category: 'Malware',
    text: 'Which malware locks your files and demands money?',
    correct: 'Ransomware',
    wrong: ['Adware', 'Spyware', 'A harmless cookie'],
    explanation: 'Ransomware encrypts files and demands payment for the key.',
  },
  {
    category: 'Malware',
    text: 'The safest place to download software from is:',
    correct: 'The official website or app store',
    wrong: ['A link in a pop-up advertisement', 'A file-sharing site', 'An email attachment'],
    explanation: 'Official sources check their software; cracked or random downloads often carry malware.',
  },
  {
    category: 'Malware',
    text: 'What is a trojan?',
    correct: 'Malware disguised as useful software',
    wrong: ['A self-copying network worm', 'A hardware fault', 'A type of firewall'],
    explanation: 'Like the wooden horse, a trojan looks harmless but carries a hidden payload.',
  },
  {
    category: 'Malware',
    text: 'How is a worm different from a virus?',
    correct: 'It spreads by itself across networks without needing a host file',
    wrong: ['It only infects printers', 'It needs the user to run it every time', 'It is always harmless'],
    explanation: 'Worms self-replicate and travel across networks on their own.',
  },
  {
    category: 'Malware',
    text: 'What does spyware do?',
    correct: 'Secretly collects information about your activity',
    wrong: ['Speeds up your computer', 'Blocks pop-up advertisements', 'Backs up your files'],
    explanation: 'Spyware watches what you do and sends the data to the attacker.',
  },
  {
    category: 'Malware',
    text: 'What is the best protection against losing data to ransomware?',
    correct: 'Regular offline backups',
    wrong: ['Paying the ransom quickly', 'Disabling the antivirus', 'Using one password everywhere'],
    explanation: 'With a clean backup you can restore files without paying criminals.',
  },
  {
    category: 'Malware',
    text: 'A keylogger records:',
    correct: 'The keys you type, such as passwords',
    wrong: ['Only websites you bookmark', 'Your screen brightness', 'Your battery usage'],
    explanation: 'Keyloggers capture keystrokes to steal passwords and messages.',
  },
  {
    category: 'Malware',
    text: 'Why should you keep software updated?',
    correct: 'Updates fix security holes that malware exploits',
    wrong: ['Updates make malware faster', 'Updates remove the need for passwords', 'Updates only change colours'],
    explanation: 'Many attacks use known bugs that updates have already fixed.',
  },
  {
    category: 'Malware',
    text: "A pop-up says 'Your PC is infected! Call this number.' What should you do?",
    correct: 'Close the page and run a scan with trusted antivirus',
    wrong: ['Call the number', 'Download the suggested cleaner', 'Enter your card details'],
    explanation: 'This is a scareware scam. Real security software never asks you to call a number.',
  },
  {
    category: 'Malware',
    text: 'What is adware?',
    correct: 'Software that shows unwanted advertisements, often bundled with free apps',
    wrong: ['A secure ad blocker', 'A password manager', 'A backup tool'],
    explanation: 'Adware earns money from ads and can slow your device or track you.',
  },
  {
    category: 'Malware',
    text: 'What is a botnet?',
    correct: 'A network of infected devices controlled by an attacker',
    wrong: ['A group of friendly chat programs', 'A fast home network', 'A cloud backup service'],
    explanation: 'Botnets are used for spam, DDoS attacks and spreading more malware.',
  },
  {
    category: 'Malware',
    text: 'Which action is risky?',
    correct: 'Plugging in a USB drive you found in the car park',
    wrong: ['Ejecting a USB drive safely', 'Scanning your own drive with antivirus', 'Locking your screen when away'],
    explanation: 'Attackers leave infected drives hoping someone will plug them in.',
  },
  {
    category: 'Malware',
    text: 'What should you do first if you suspect malware on your computer?',
    correct: 'Disconnect from the network and run a scan',
    wrong: ['Keep working as normal', 'Share the files to check them', 'Delete your antivirus'],
    explanation: 'Disconnecting stops the malware from spreading or sending out your data.',
  },
  {
    category: 'Malware',
    text: 'What is a rootkit?',
    correct: 'Malware that hides itself deep inside the system',
    wrong: ['A set of repair tools', 'A type of keyboard', 'A browser extension store'],
    explanation: 'Rootkits hide other malware and are hard to detect and remove.',
  },
  {
    category: 'Malware',
    text: 'Which permission is suspicious for a simple torch (flashlight) app?',
    correct: 'Access to your contacts and SMS',
    wrong: ['Using the camera flash', 'Keeping the screen awake', 'Turning on the light'],
    explanation: 'Apps should only ask for permissions they need for their job.',
  },

  // -------------------------------------------------------- Password Security (15)
  {
    category: 'Password Security',
    text: 'Which password is the strongest?',
    correct: 'Tr!ee7$Moon#Bk9',
    wrong: ['password123', 'Riya2005', 'qwerty'],
    explanation: 'Length and a mix of character types make a password hard to guess.',
  },
  {
    category: 'Password Security',
    text: 'What does multi-factor authentication add?',
    correct: 'A second proof of identity',
    wrong: ['A longer password automatically', 'A faster login', 'A free antivirus'],
    explanation: 'Even if your password is stolen, the attacker still needs the second factor.',
  },
  {
    category: 'Password Security',
    text: 'Why should you not reuse passwords?',
    correct: 'One leak exposes every account that uses it',
    wrong: ['It makes logins slower', 'Websites forbid it by law', 'Passwords expire faster'],
    explanation: 'Attackers try leaked passwords on other sites (credential stuffing).',
  },
  {
    category: 'Password Security',
    text: 'What is a good way to manage many strong passwords?',
    correct: 'A reputable password manager',
    wrong: ['A sticky note on the monitor', 'The same password everywhere', 'Sharing them with friends'],
    explanation: 'A password manager creates and stores a unique password for each account.',
  },
  {
    category: 'Password Security',
    text: 'What is a passphrase?',
    correct: 'A long password made of several random words',
    wrong: ['A short PIN', 'A password shared by a team', 'Your date of birth'],
    explanation: 'Long passphrases are easy to remember and very hard to crack.',
  },
  {
    category: 'Password Security',
    text: 'Which MFA method is generally the strongest?',
    correct: 'A hardware security key',
    wrong: ['Security questions', 'A four-digit PIN', "Your mother's maiden name"],
    explanation: 'Hardware keys cannot be phished or guessed remotely.',
  },
  {
    category: 'Password Security',
    text: 'What is credential stuffing?',
    correct: 'Trying leaked username and password pairs on many sites',
    wrong: ['Hiding passwords inside a file', 'Encrypting passwords', 'Resetting passwords by email'],
    explanation: 'It works only because people reuse passwords across sites.',
  },
  {
    category: 'Password Security',
    text: 'Who should you share your OTP with?',
    correct: 'Nobody',
    wrong: ['Bank staff who call you', 'Your friends', 'Tech support on the phone'],
    explanation: 'No genuine organisation will ever ask you for your OTP.',
  },
  {
    category: 'Password Security',
    text: 'How should a website store passwords safely?',
    correct: 'As salted hashes, not plain text',
    wrong: ['In plain text for easy recovery', 'In an email to the admin', 'In the page URL'],
    explanation: 'Hashes cannot be reversed easily, so a database leak does not reveal real passwords.',
  },
  {
    category: 'Password Security',
    text: 'A long password mainly protects against:',
    correct: 'Brute-force guessing attacks',
    wrong: ['Power cuts', 'Slow internet', 'Screen glare'],
    explanation: 'Each extra character multiplies the number of guesses an attacker needs.',
  },
  {
    category: 'Password Security',
    text: 'Which is a weak password habit?',
    correct: 'Using your name and birth year',
    wrong: ['Using a unique passphrase', 'Using a password manager', 'Turning on MFA'],
    explanation: 'Personal details are the first things attackers try.',
  },
  {
    category: 'Password Security',
    text: 'A service reports a data breach that includes your account. What should you do?',
    correct: 'Change that password and any others that reuse it',
    wrong: ['Ignore it', 'Wait a year', 'Delete your old emails'],
    explanation: 'Act quickly and turn on MFA for the affected accounts.',
  },
  {
    category: 'Password Security',
    text: 'Why are security questions risky?',
    correct: 'The answers can often be found on social media',
    wrong: ['They are too long', 'They always lock accounts', 'They use encryption'],
    explanation: 'Information such as pet names and schools is often public.',
  },
  {
    category: 'Password Security',
    text: 'When should you change a strong, unique password?',
    correct: 'When there is a sign or report of compromise',
    wrong: ['Every single day', 'Never, even after a breach', 'Only on your birthday'],
    explanation: 'Frequent forced changes lead to weak patterns; change it when there is a reason.',
  },
  {
    category: 'Password Security',
    text: "Should a shared computer's browser save your passwords?",
    correct: 'No, other users could access them',
    wrong: ['Yes, it is always private', 'Yes, if the browser is Chrome', 'Yes, to save time'],
    explanation: 'On shared devices, never save passwords and always log out fully.',
  },

  // ------------------------------------------------------------ Online Safety (15)
  {
    category: 'Online Safety',
    text: 'Public Wi-Fi is safest for:',
    correct: 'Reading general news without logging in',
    wrong: ['Online banking', 'Entering card details', 'Logging in to work email'],
    explanation: 'Public networks can be watched; avoid sensitive logins unless you use a VPN.',
  },
  {
    category: 'Online Safety',
    text: 'You receive an OTP you did not request. You should:',
    correct: 'Not share it and secure your account',
    wrong: ['Share it with the caller', 'Post it online', 'Enter it on the website they send'],
    explanation: 'An unrequested OTP may mean someone is trying to log in as you; change your password.',
  },
  {
    category: 'Online Safety',
    text: 'What does a VPN do?',
    correct: 'Encrypts your traffic between your device and the VPN server',
    wrong: ['Makes you immune to malware', 'Speeds up every website', 'Removes all advertisements'],
    explanation: 'A VPN protects data on untrusted networks but does not stop malware or phishing.',
  },
  {
    category: 'Online Safety',
    text: 'Which is a good social media privacy habit?',
    correct: 'Review privacy settings and limit who sees your posts',
    wrong: ['Accept every friend request', 'Post your travel plans publicly', 'Share your home address'],
    explanation: 'Limiting your audience reduces the information attackers can collect about you.',
  },
  {
    category: 'Online Safety',
    text: 'What is social engineering?',
    correct: 'Manipulating people into giving away information',
    wrong: ['Building social websites', 'A type of firewall', 'Programming for social apps'],
    explanation: 'Attackers exploit trust and emotions instead of breaking technology.',
  },
  {
    category: 'Online Safety',
    text: 'A secure web page address starts with:',
    correct: 'https://',
    wrong: ['http://', 'ftp://', 'www only'],
    explanation: 'HTTPS encrypts data in transit, but you must still check the domain name.',
  },
  {
    category: 'Online Safety',
    text: 'Before posting a photo online you should:',
    correct: 'Check that it does not reveal personal details such as your location',
    wrong: ['Add your phone number', 'Tag your home address', 'Turn on live location'],
    explanation: 'Photos can reveal your home, school and daily routine.',
  },
  {
    category: 'Online Safety',
    text: 'What is a safe way to shop online?',
    correct: 'Use trusted sites and secure payment methods',
    wrong: ['Save card details on unknown sites', 'Click ads promising 90% off', 'Pay by sending gift cards'],
    explanation: 'Scammers prefer payments that cannot be traced or reversed, such as gift cards.',
  },
  {
    category: 'Online Safety',
    text: 'What should you do with online accounts you no longer use?',
    correct: 'Delete them or secure them',
    wrong: ['Leave them with weak passwords', 'Share them with others', 'Ignore them forever'],
    explanation: 'Forgotten accounts are easy targets and may hold personal data.',
  },
  {
    category: 'Online Safety',
    text: 'Why should you log out on shared devices?',
    correct: 'To stop others using your open session',
    wrong: ['To save battery', 'To speed up the browser', 'To clean the keyboard'],
    explanation: 'An open session lets the next user act as you without a password.',
  },
  {
    category: 'Online Safety',
    text: 'What is the best response to cyberbullying?',
    correct: 'Save evidence, block the person and report it',
    wrong: ['Reply with threats', 'Delete all evidence', 'Share the messages publicly'],
    explanation: 'Evidence helps the platform and authorities act.',
  },
  {
    category: 'Online Safety',
    text: 'Which is a safe browsing habit?',
    correct: 'Keep your browser and extensions updated',
    wrong: ['Install extensions from random sites', 'Disable pop-up warnings', 'Ignore certificate warnings'],
    explanation: 'Updates close security holes that malicious sites try to use.',
  },
  {
    category: 'Online Safety',
    text: 'Two-step verification protects you when:',
    correct: 'Someone has your password but not your second factor',
    wrong: ['The Wi-Fi is slow', 'There is a power surge', 'You make spelling mistakes'],
    explanation: 'The attacker is stopped at the second step.',
  },
  {
    category: 'Online Safety',
    text: 'A stranger online asks for your home address and school. What do you do?',
    correct: 'Refuse, then block and report them',
    wrong: ['Share it politely', 'Share it if they seem friendly', 'Give them an old address'],
    explanation: 'Never give personal details to people you only know online.',
  },
  {
    category: 'Online Safety',
    text: 'What is a good way to back up important files?',
    correct: 'Keep copies in more than one place, including offline',
    wrong: ['Keep one copy on the same device', 'Email them to yourself only', 'Never back up'],
    explanation: 'Multiple copies protect you from theft, failure and ransomware.',
  },
];

export function buildInitialQuestions(): Question[] {
  const categoryMap: Record<string, number> = {
    'Phishing': 1,
    'Malware': 2,
    'Password Security': 3,
    'Online Safety': 4,
  };

  const categoryCounters: Record<string, number> = {
    'Phishing': 0,
    'Malware': 0,
    'Password Security': 0,
    'Online Safety': 0,
  };

  let questionId = 1;
  let optionId = 100;

  return RAW_QUESTIONS_DATA.map(item => {
    const catIndex = categoryCounters[item.category]++;
    const difficulty: 'easy' | 'medium' | 'hard' =
      catIndex < 5 ? 'easy' : catIndex < 10 ? 'medium' : 'hard';

    // Mix options deterministically
    const rawOpts = [
      { text: item.correct, isCorrect: true },
      { text: item.wrong[0], isCorrect: false },
      { text: item.wrong[1], isCorrect: false },
      { text: item.wrong[2], isCorrect: false },
    ];

    // Simple fixed permutation based on question id to shuffle consistently
    const permutation = [(questionId * 3) % 4, (questionId * 3 + 1) % 4, (questionId * 3 + 2) % 4, (questionId * 3 + 3) % 4];
    const seen = new Set<number>();
    const shuffled: typeof rawOpts = [];
    for (const p of permutation) {
      if (!seen.has(p)) {
        shuffled.push(rawOpts[p]);
        seen.add(p);
      }
    }
    for (let i = 0; i < 4; i++) {
      if (!seen.has(i)) shuffled.push(rawOpts[i]);
    }

    const options = shuffled.map(o => ({
      id: optionId++,
      text: o.text,
      isCorrect: o.isCorrect,
    }));

    return {
      id: questionId++,
      categoryId: categoryMap[item.category],
      categoryName: item.category,
      questionText: item.text,
      explanation: item.explanation,
      difficulty,
      options,
    };
  });
}

export const SEED_LESSONS: Lesson[] = [
  {
    id: 'lesson-phishing',
    title: 'Phishing & Social Engineering',
    category: 'Phishing',
    summary: 'Deceptive messages designed to steal sensitive credentials, session tokens, or install initial payloads.',
    keyPoints: [
      'Hover over every hyperlink before clicking to verify the exact destination domain and protocol.',
      'Check the true email header sender address, looking for lookalike homoglyphs (e.g. paypa1 vs paypal).',
      'Never respond to urgent demands for immediate financial transfers, gift cards, or credentials.',
      'Smishing (SMS) and Vishing (Voice) commonly impersonate bank fraud departments or tech support.',
    ],
    realWorldExample:
      'In a classic CEO fraud attempt, an attacker spoofed an executive name requesting urgent gift cards for a company client, demanding absolute secrecy.',
    quickDefenseTip:
      'When an email sounds urgent or unusual, contact the sender directly through a verified separate channel.',
  },
  {
    id: 'lesson-malware',
    title: 'Malware & Ransomware Defense',
    category: 'Malware',
    summary: 'Harmful software including viruses, spyware, self-replicating worms, trojans, and encryption ransomware.',
    keyPoints: [
      'Maintain immutable, offline backups following the 3-2-1 backup rule (3 copies, 2 media, 1 offsite/offline).',
      'Download executables and installers exclusively from official verified repositories and app stores.',
      'Beware of double extensions like `invoice.pdf.exe` which hide Windows executable binaries.',
      'Keep your OS, kernel, browsers, and endpoint detection software patched against known CVE exploits.',
    ],
    realWorldExample:
      'Ransomware groups target vulnerable open RDP ports and unpatched network services to encrypt network shares in minutes.',
    quickDefenseTip:
      'If you suspect a malware infection, instantly sever network/Wi-Fi connection to prevent lateral movement.',
  },
  {
    id: 'lesson-passwords',
    title: 'Password Security & Credential Hygiene',
    category: 'Password Security',
    summary: 'Protecting user authentication boundaries through high entropy, non-reuse, and multi-factor defense.',
    keyPoints: [
      'Passphrases of 4+ random words (e.g. `correct-horse-battery-staple`) provide massive entropy and easy recall.',
      'Never reuse passwords: credential stuffing bots automatically test breached database lists across services.',
      'Adopt a reputable password manager to generate unique 16+ character random passwords for every single service.',
      'FIDO2 hardware security keys (e.g. YubiKey) provide phishing-resistant cryptographic authentication.',
    ],
    realWorldExample:
      'A credential stuffing attack against a major online store exposed 300,000 accounts simply because users reused their old forum passwords.',
    quickDefenseTip:
      'Enable Multi-Factor Authentication (MFA) everywhere, preferring authenticator apps or security keys over SMS.',
  },
  {
    id: 'lesson-online-safety',
    title: 'Online Safety & Digital Hygiene',
    category: 'Online Safety',
    summary: 'Minimizing attack surfaces across untrusted public Wi-Fi networks, browser sessions, and personal footprints.',
    keyPoints: [
      'Public Wi-Fi networks can be passively monitored via packet sniffing; always tunnel through an encrypted VPN.',
      'Verify HTTPS connection and certificate integrity, but remember that HTTPS only encrypts the wire—it does not prove honesty.',
      'Examine social media sharing: metadata in photos (EXIF GPS coords) can reveal your address and daily routines.',
      'Audit third-party browser extensions and grant only strictly required permissions.',
    ],
    realWorldExample:
      'An open coffee shop Wi-Fi access point had an evil twin router intercepting unencrypted DNS requests from visitors.',
    quickDefenseTip:
      'Always log out from shared terminal sessions and wipe cached browser profiles when stepping away.',
  },
  {
    id: 'lesson-social-eng',
    title: 'Social Engineering & Psychological Traps',
    category: 'Online Safety',
    summary: 'Manipulating human cognitive biases (authority, urgency, fear, scarcity) to bypass technical security perimeters.',
    keyPoints: [
      'Authority bias: attackers impersonate senior executives, law enforcement, or IT administrators.',
      'Pretexting: fabricating an elaborate scenario (e.g., failed audit) to request sensitive data.',
      'Baiting: leaving malicious USB thumb drives in corporate parking lots labeled "Confidential Payroll".',
      'Never bypass standard verification procedures regardless of the caller’s claimed urgency.',
    ],
    realWorldExample:
      'An attacker called a helpdesk pretending to be a remote employee locked out of their MFA token, convincing the agent to reset it.',
    quickDefenseTip:
      'Security policies exist precisely to protect you from urgent pressure. Stick to established protocol.',
  },
  {
    id: 'lesson-2fa',
    title: 'Multi-Factor Authentication & Key Security',
    category: 'Password Security',
    summary: 'Implementing layered defense so that password disclosure alone does not compromise your account.',
    keyPoints: [
      'MFA factors include: Something you know (password), Something you have (phone/key), Something you are (biometrics).',
      'SMS-based OTP is vulnerable to SIM-swapping and SS7 intercept; prefer TOTP apps (Google Authenticator) or WebAuthn.',
      'Safeguard your one-time emergency recovery codes in a secure, encrypted offline vault.',
      'Never approve unexpected MFA push notifications on your phone (MFA fatigue attack).',
    ],
    realWorldExample:
      'Attackers bombarded an employee with 50 push notifications at 2:00 AM until the exhausted user pressed "Approve" to silence it.',
    quickDefenseTip:
      'If you receive an unexpected MFA prompt, immediately decline and change your account password.',
  },
];

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    name: 'Platform Administrator',
    email: 'admin@cyberquiz.com',
    role: 'admin',
    status: 'active',
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 2,
    name: 'Alex Morgan',
    email: 'user@cyberquiz.com',
    role: 'user',
    status: 'active',
    createdAt: '2026-02-01T10:30:00Z',
  },
  {
    id: 3,
    name: 'Elena Rostova',
    email: 'elena.rostova@cyberdefense.org',
    role: 'user',
    status: 'active',
    createdAt: '2026-02-10T14:15:00Z',
  },
  {
    id: 4,
    name: 'Marcus Brody',
    email: 'marcus.b@secops.io',
    role: 'user',
    status: 'active',
    createdAt: '2026-02-18T09:45:00Z',
  },
  {
    id: 5,
    name: 'Priya Sharma',
    email: 'priya.sharma@techsafe.net',
    role: 'user',
    status: 'active',
    createdAt: '2026-03-01T16:20:00Z',
  },
];

export const INITIAL_RESULTS: QuizResult[] = [
  {
    id: 101,
    userId: 3,
    userName: 'Elena Rostova',
    categoryId: 1,
    categoryName: 'Phishing',
    difficulty: 'hard',
    score: 15,
    totalQuestions: 15,
    percentage: 100,
    passed: true,
    attemptDate: '2026-04-12T11:20:00Z',
    timedOut: false,
    review: [],
  },
  {
    id: 102,
    userId: 4,
    userName: 'Marcus Brody',
    categoryId: 2,
    categoryName: 'Malware',
    difficulty: 'hard',
    score: 14,
    totalQuestions: 15,
    percentage: 93,
    passed: true,
    attemptDate: '2026-04-15T15:40:00Z',
    timedOut: false,
    review: [],
  },
  {
    id: 103,
    userId: 5,
    userName: 'Priya Sharma',
    categoryId: 3,
    categoryName: 'Password Security',
    difficulty: 'medium',
    score: 10,
    totalQuestions: 10,
    percentage: 100,
    passed: true,
    attemptDate: '2026-04-18T09:15:00Z',
    timedOut: false,
    review: [],
  },
  {
    id: 104,
    userId: 3,
    userName: 'Elena Rostova',
    categoryId: 4,
    categoryName: 'Online Safety',
    difficulty: 'medium',
    score: 9,
    totalQuestions: 10,
    percentage: 90,
    passed: true,
    attemptDate: '2026-04-20T17:05:00Z',
    timedOut: false,
    review: [],
  },
  {
    id: 105,
    userId: 2,
    userName: 'Alex Morgan',
    categoryId: 1,
    categoryName: 'Phishing',
    difficulty: 'easy',
    score: 5,
    totalQuestions: 5,
    percentage: 100,
    passed: true,
    attemptDate: '2026-04-25T14:30:00Z',
    timedOut: false,
    review: [],
  },
];
