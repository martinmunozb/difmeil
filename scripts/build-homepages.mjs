import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const storeUrl = 'https://chromewebstore.google.com/detail/difmeil/eojoffejiddgjbjgkkgkfhccgofjejad';

const languageLinks = [
  { code: 'es', short: 'ES', label: 'Español', href: '/' },
  { code: 'en', short: 'EN', label: 'English', href: '/en/' },
  { code: 'fr', short: 'FR', label: 'Français', href: '/fr/' },
  { code: 'de', short: 'DE', label: 'Deutsch', href: '/de/' },
  { code: 'pt', short: 'PT', label: 'Português', href: '/pt/' },
];

const shared = {
  es: {
    file: 'index.html', lang: 'es', locale: 'es_ES', canonical: 'https://difmeil.com/', privacyUrl: '/privacidad/',
    title: 'Difmeil — todas tus cuentas de Gmail en una sola bandeja',
    description: 'Lee, busca, responde y recibe avisos de todas tus cuentas de Gmail desde una sola bandeja. Extensión de Chrome gratis hasta 3 cuentas.',
    skip: 'Saltar al contenido', menu: 'Abrir menú', language: 'Idioma', install: 'Añadir a Chrome',
    nav: ['Producto', 'Funciones', 'Privacidad', 'Precios', 'Dudas'],
    hero: {
      eyebrow: 'Extensión para Chrome · Gratis hasta 3 cuentas',
      title: 'Todas tus cuentas de Gmail. Una sola bandeja.',
      lead: 'Lee, busca, responde y recibe avisos de cada cuenta sin cambiar de perfil ni abrir otra pestaña.',
      primary: 'Añadir a Chrome — gratis', secondary: 'Ver cómo funciona', note: 'Sin tarjeta · Conexión segura con Google',
      accounts: '3 cuentas, una vista', mail: 'Correo nuevo',
    },
    trust: ['Vista unificada de verdad', 'Correo directo entre tu navegador y Google', 'Español, English, Français, Deutsch y Português'],
    product: {
      eyebrow: 'Mira Difmeil por dentro', title: 'Menos saltos. Más control sobre tu correo.',
      lead: 'No es otra capa encima de Gmail. Es una bandeja clara para trabajar con todas tus cuentas desde el mismo sitio.',
      mainTitle: 'Todo el correo, ordenado por fecha',
      mainText: 'La bandeja unificada mezcla los mensajes de tus cuentas y conserva el color de cada una para que siempre sepas dónde estás.',
      bullets: ['Busca en todas las cuentas a la vez', 'Lee, responde, reenvía, archiva o elimina', 'Cambia a la vista de una sola cuenta cuando quieras'],
      alts: ['Bandeja unificada de Difmeil con correos de varias cuentas de Gmail', 'Ventana rápida de Difmeil mostrando varias cuentas conectadas', 'Ajustes de apariencia de Difmeil con selector de idioma, tema y densidad'],
      cards: [
        { title: 'Todas tus cuentas, a un clic', text: 'La ventana rápida enseña qué cuenta tiene pendientes y te deja entrar sin cambiar de perfil de Chrome.' },
        { title: 'Tu bandeja, a tu manera', text: 'Elige idioma, tema, densidad, tamaño de texto, colores, alias e iconos para reconocer cada cuenta al instante.' },
      ],
    },
    features: {
      eyebrow: 'Lo esencial, bien resuelto', title: 'Todo lo que esperas de tu correo. Sin repartirlo entre pestañas.',
      lead: 'Difmeil reúne el trabajo diario de Gmail y añade control por cuenta allí donde más lo necesitas.',
      cards: [
        ['Búsqueda entre cuentas', 'Combina búsqueda local y búsqueda real de Gmail para encontrar el mensaje sin recordar en qué cuenta estaba.'],
        ['Redacta y responde', 'Escribe, responde, responde a todos y reenvía con adjuntos desde la propia extensión.'],
        ['Notificaciones útiles', 'Activa avisos por cuenta y crea reglas por remitente, asunto o categoría para reducir el ruido.'],
        ['Acciones en bloque', 'Marca como leído, archiva o envía varios mensajes a la papelera de una sola vez.'],
      ],
    },
    privacy: {
      eyebrow: 'Privacidad que se puede explicar', title: 'Tu correo no vive en nuestros servidores.',
      text: 'Las peticiones para leer o gestionar mensajes van de tu navegador a Google. Difmeil guarda cuentas, tokens y preferencias en el almacenamiento local del navegador; el cuerpo completo se descarga solo cuando abres un correo y no se persiste.',
      link: 'Leer la política completa', browser: 'Tu navegador', browserSub: 'Difmeil y tus preferencias', route: 'Conexión directa', google: 'Google', googleSub: 'Gmail API y People API',
      note: 'El canje inicial de autorización usa un servicio técnico que no almacena tu correo ni tus credenciales.',
    },
    steps: {
      eyebrow: 'Solo tres pasos', title: 'Instala. Conecta. Respira.', lead: 'No hay que importar nada ni configurar reenvíos.',
      items: [
        ['Instala Difmeil', 'Añade la extensión desde la Chrome Web Store y ábrela desde la barra del navegador.'],
        ['Conecta tu Gmail', 'Autoriza la primera cuenta con el acceso oficial de Google. Difmeil nunca ve tu contraseña.'],
        ['Repite y unifica', 'Añade las demás cuentas. Los mensajes aparecen juntos desde ese momento.'],
      ],
    },
    pricing: {
      eyebrow: 'Precios claros', title: 'Empieza gratis. Paga solo si necesitas más.', lead: 'El plan gratuito incluye hasta 3 cuentas y las funciones esenciales.',
      tag: 'Pago único', monthlySuffix: '/mes', onceSuffix: 'una vez', forever: 'para siempre',
      plans: [
        ['Gratis', '0 €', 'Hasta 3 cuentas', ['Bandeja unificada y página completa', 'Leer, buscar, responder y organizar', 'Notificaciones básicas', 'Tema claro y oscuro'], 'Añadir a Chrome — gratis'],
        ['Pro mensual', '2 €', '7 días gratis; después 2 €/mes', ['Cuentas ilimitadas', 'Personalización completa', 'No molestar y reglas de notificación', 'Ajustes propios por cuenta'], 'Probar 7 días gratis'],
        ['Pro permanente', '20 €', 'Un solo pago para la línea Pro 1.x', ['Todo lo incluido en Pro mensual', 'Sin suscripción ni renovaciones', 'Cuentas ilimitadas', 'Plantillas y acciones avanzadas'], 'Añadir a Chrome'],
      ],
      note: 'Importes mostrados para la zona euro, sin impuestos; el precio local exacto y el impuesto de tu país aparecen al pagar. La prueba de 7 días requiere tarjeta y solo se aplica al plan mensual; te avisamos antes del primer cobro.',
    },
    faq: {
      eyebrow: 'Sin letra pequeña escondida', title: 'Preguntas antes de instalar',
      items: [
        ['¿Es seguro dar acceso a mi Gmail?', 'La conexión usa el flujo oficial de Google OAuth. Difmeil nunca ve tu contraseña y puedes revocar el acceso desde tu cuenta de Google cuando quieras.'],
        ['¿Guardáis mis correos en algún servidor?', 'No. Difmeil no almacena tu correo en servidores propios. El cuerpo de un mensaje se descarga al abrirlo y no se persiste.'],
        ['¿Cuántas cuentas puedo conectar gratis?', 'Hasta 3. Puedes usar la bandeja unificada, leer, buscar, responder y organizar sin pagar.'],
        ['¿Qué pasa si dejo de pagar Pro?', 'Vuelves al plan Gratis. Las cuentas que ya estaban conectadas siguen accesibles, pero no puedes añadir otra mientras tengas 3 o más. Nunca bloqueamos tu correo por dejar de pagar.'],
        ['¿Funciona fuera de Chrome?', 'Difmeil se distribuye en Chrome Web Store y puede instalarse en navegadores Chromium compatibles con esa tienda, como Edge, Brave u Opera.'],
      ],
    },
    closing: { title: 'Tu correo ya está repartido. Tu atención no tiene por qué estarlo.', text: 'Reúne tus cuentas de Gmail y vuelve a tener claro qué ha llegado, dónde y cuándo.', cta: 'Añadir a Chrome — gratis' },
    footer: { tagline: 'Todas tus cuentas de Gmail en una sola bandeja, con notificaciones y apariencia bajo tu control.', product: 'Producto', legal: 'Legal', contact: 'Contacto', privacy: 'Privacidad', support: 'Soporte', made: 'Hecho para quien vive entre varias bandejas.' },
  },
  en: {
    file: 'en/index.html', lang: 'en', locale: 'en_US', canonical: 'https://difmeil.com/en/', privacyUrl: '/en/privacy/',
    title: 'Difmeil — all your Gmail accounts in one inbox',
    description: 'Read, search, reply and get notifications from all your Gmail accounts in one inbox. Free Chrome extension for up to 3 accounts.',
    skip: 'Skip to content', menu: 'Open menu', language: 'Language', install: 'Add to Chrome',
    nav: ['Product', 'Features', 'Privacy', 'Pricing', 'FAQ'],
    hero: {
      eyebrow: 'Chrome extension · Free for up to 3 accounts', title: 'All your Gmail accounts. One inbox.',
      lead: 'Read, search, reply and get notified for every account without switching profiles or opening another tab.',
      primary: 'Add to Chrome — free', secondary: 'See how it works', note: 'No card · Secure connection with Google', accounts: '3 accounts, one view', mail: 'New email',
    },
    trust: ['A genuinely unified inbox', 'Mail goes directly between your browser and Google', 'Español, English, Français, Deutsch and Português'],
    product: {
      eyebrow: 'See Difmeil in action', title: 'Fewer jumps. More control over your email.',
      lead: 'Not another layer on top of Gmail. A clear inbox where you can work with every account from one place.',
      mainTitle: 'Every message, ordered by date', mainText: 'The unified inbox combines messages from all your accounts and keeps each account color visible, so you always know where you are.',
      bullets: ['Search every account at once', 'Read, reply, forward, archive or delete', 'Switch to a single-account view whenever you need it'],
      alts: ['Difmeil unified inbox with messages from several Gmail accounts', 'Difmeil quick window showing several connected accounts', 'Difmeil appearance settings with language, theme and density controls'],
      cards: [
        { title: 'Every account, one click away', text: 'The quick window shows which account has unread mail and gets you there without changing Chrome profiles.' },
        { title: 'Your inbox, your way', text: 'Choose language, theme, density, text size, colors, aliases and icons to recognize every account instantly.' },
      ],
    },
    features: {
      eyebrow: 'The essentials, done properly', title: 'Everything you expect from email. Without spreading it across tabs.',
      lead: 'Difmeil brings everyday Gmail work together and adds per-account control where it matters most.',
      cards: [
        ['Search across accounts', 'Combine local search with real Gmail search to find a message without remembering which account held it.'],
        ['Compose and reply', 'Write, reply, reply all and forward with attachments without leaving the extension.'],
        ['Useful notifications', 'Enable alerts per account and create rules by sender, subject or category to cut through the noise.'],
        ['Bulk actions', 'Mark as read, archive or send several messages to trash in one go.'],
      ],
    },
    privacy: {
      eyebrow: 'Privacy you can explain', title: 'Your email does not live on our servers.',
      text: 'Requests to read or manage messages go from your browser to Google. Difmeil keeps accounts, tokens and preferences in local browser storage; full message bodies download only when you open an email and are not persisted.',
      link: 'Read the full policy', browser: 'Your browser', browserSub: 'Difmeil and your preferences', route: 'Direct connection', google: 'Google', googleSub: 'Gmail API and People API',
      note: 'The initial authorization exchange uses a technical service that does not store your email or credentials.',
    },
    steps: {
      eyebrow: 'Just three steps', title: 'Install. Connect. Breathe.', lead: 'There is nothing to import and no forwarding to configure.',
      items: [['Install Difmeil', 'Add the extension from Chrome Web Store and open it from your browser toolbar.'], ['Connect your Gmail', 'Authorize your first account through Google’s official flow. Difmeil never sees your password.'], ['Repeat and unify', 'Add your other accounts. Their messages appear together from that moment on.']],
    },
    pricing: {
      eyebrow: 'Straightforward pricing', title: 'Start free. Pay only when you need more.', lead: 'The free plan includes up to 3 accounts and every essential feature.',
      tag: 'One-time payment', monthlySuffix: '/month', onceSuffix: 'once', forever: 'forever',
      plans: [
        ['Free', '€0', 'Up to 3 accounts', ['Unified inbox and full page', 'Read, search, reply and organize', 'Basic notifications', 'Light and dark themes'], 'Add to Chrome — free'],
        ['Pro monthly', '€2', '7 days free; then €2/month', ['Unlimited accounts', 'Full personalization', 'Do not disturb and notification rules', 'Per-account settings'], 'Try 7 days free'],
        ['Pro permanent', '€20', 'One payment for the Pro 1.x line', ['Everything in Pro monthly', 'No subscription or renewals', 'Unlimited accounts', 'Templates and advanced actions'], 'Add to Chrome'],
      ],
      note: 'Amounts shown are euro-area reference prices before tax; your exact local price and tax appear at checkout. The 7-day trial requires a card and applies only to the monthly plan; we email you before the first charge.',
    },
    faq: {
      eyebrow: 'No hidden fine print', title: 'Questions before you install',
      items: [
        ['Is it safe to give access to Gmail?', 'The connection uses Google’s official OAuth flow. Difmeil never sees your password, and you can revoke access from your Google account at any time.'],
        ['Do you store my emails on a server?', 'No. Difmeil does not store your mail on its own servers. A message body downloads when you open it and is not persisted.'],
        ['How many accounts can I connect for free?', 'Up to 3. You can use the unified inbox, read, search, reply and organize without paying.'],
        ['What happens if I stop paying for Pro?', 'You return to the Free plan. Accounts that were already connected remain accessible, but you cannot add another while you have 3 or more. We never block your email because you stopped paying.'],
        ['Does it work outside Chrome?', 'Difmeil is distributed through Chrome Web Store and can be installed in Chromium browsers that support the store, such as Edge, Brave or Opera.'],
      ],
    },
    closing: { title: 'Your email is already scattered. Your attention does not have to be.', text: 'Bring your Gmail accounts together and know what arrived, where and when.', cta: 'Add to Chrome — free' },
    footer: { tagline: 'All your Gmail accounts in one inbox, with notifications and appearance under your control.', product: 'Product', legal: 'Legal', contact: 'Contact', privacy: 'Privacy', support: 'Support', made: 'Made for people who live across several inboxes.' },
  },
  fr: {
    file: 'fr/index.html', lang: 'fr', locale: 'fr_FR', canonical: 'https://difmeil.com/fr/', privacyUrl: '/fr/confidentialite/',
    title: 'Difmeil — tous vos comptes Gmail dans une seule boîte de réception',
    description: 'Lisez, recherchez, répondez et recevez les notifications de tous vos comptes Gmail dans une seule boîte. Gratuit jusqu’à 3 comptes.',
    skip: 'Aller au contenu', menu: 'Ouvrir le menu', language: 'Langue', install: 'Ajouter à Chrome',
    nav: ['Produit', 'Fonctions', 'Confidentialité', 'Tarifs', 'Questions'],
    hero: {
      eyebrow: 'Extension Chrome · Gratuite jusqu’à 3 comptes', title: 'Tous vos comptes Gmail. Une seule boîte de réception.',
      lead: 'Lisez, recherchez, répondez et recevez les notifications de chaque compte sans changer de profil ni ouvrir un autre onglet.',
      primary: 'Ajouter à Chrome — gratuit', secondary: 'Voir comment ça marche', note: 'Sans carte · Connexion sécurisée avec Google', accounts: '3 comptes, une vue', mail: 'Nouvel e-mail',
    },
    trust: ['Une vraie boîte unifiée', 'Le courrier va directement de votre navigateur à Google', 'Español, English, Français, Deutsch et Português'],
    product: {
      eyebrow: 'Découvrez Difmeil', title: 'Moins d’allers-retours. Plus de contrôle sur vos e-mails.',
      lead: 'Pas une couche de plus sur Gmail. Une boîte claire pour travailler avec tous vos comptes au même endroit.',
      mainTitle: 'Tous les messages, classés par date', mainText: 'La boîte unifiée rassemble les messages de vos comptes tout en conservant la couleur de chacun pour que vous sachiez toujours où vous êtes.',
      bullets: ['Recherchez dans tous les comptes à la fois', 'Lisez, répondez, transférez, archivez ou supprimez', 'Passez à la vue d’un seul compte quand vous le souhaitez'],
      alts: ['Boîte de réception unifiée Difmeil avec plusieurs comptes Gmail', 'Fenêtre rapide Difmeil affichant plusieurs comptes connectés', 'Réglages d’apparence Difmeil avec langue, thème et densité'],
      cards: [{ title: 'Tous vos comptes en un clic', text: 'La fenêtre rapide montre quel compte a des messages non lus, sans changer de profil Chrome.' }, { title: 'Votre boîte, à votre façon', text: 'Choisissez langue, thème, densité, taille du texte, couleurs, alias et icônes pour reconnaître chaque compte.' }],
    },
    features: {
      eyebrow: 'L’essentiel, bien fait', title: 'Tout ce que vous attendez de vos e-mails. Sans les disperser entre les onglets.',
      lead: 'Difmeil rassemble le travail quotidien de Gmail et ajoute le contrôle par compte là où il compte le plus.',
      cards: [['Recherche multicomptes', 'Combinez recherche locale et recherche Gmail pour retrouver un message sans savoir dans quel compte il se trouve.'], ['Rédigez et répondez', 'Rédigez, répondez à tous et transférez avec des pièces jointes sans quitter l’extension.'], ['Notifications utiles', 'Activez les alertes par compte et créez des règles par expéditeur, objet ou catégorie.'], ['Actions groupées', 'Marquez comme lu, archivez ou mettez plusieurs messages à la corbeille en une seule fois.']],
    },
    privacy: {
      eyebrow: 'Une confidentialité simple à expliquer', title: 'Vos e-mails ne vivent pas sur nos serveurs.',
      text: 'Les requêtes pour lire ou gérer les messages vont de votre navigateur à Google. Difmeil conserve comptes, jetons et préférences dans le stockage local du navigateur ; le corps complet est téléchargé uniquement à l’ouverture et n’est pas conservé.',
      link: 'Lire la politique complète', browser: 'Votre navigateur', browserSub: 'Difmeil et vos préférences', route: 'Connexion directe', google: 'Google', googleSub: 'API Gmail et People',
      note: 'L’échange d’autorisation initial utilise un service technique qui ne stocke ni vos e-mails ni vos identifiants.',
    },
    steps: { eyebrow: 'Trois étapes seulement', title: 'Installez. Connectez. Respirez.', lead: 'Rien à importer et aucun transfert à configurer.', items: [['Installez Difmeil', 'Ajoutez l’extension depuis le Chrome Web Store et ouvrez-la depuis la barre du navigateur.'], ['Connectez votre Gmail', 'Autorisez le premier compte avec le parcours officiel de Google. Difmeil ne voit jamais votre mot de passe.'], ['Répétez et réunissez', 'Ajoutez vos autres comptes. Leurs messages apparaissent ensemble immédiatement.']] },
    pricing: {
      eyebrow: 'Des tarifs clairs', title: 'Commencez gratuitement. Payez seulement si vous avez besoin de plus.', lead: 'Le forfait gratuit inclut jusqu’à 3 comptes et toutes les fonctions essentielles.',
      tag: 'Paiement unique', monthlySuffix: '/mois', onceSuffix: 'une fois', forever: 'pour toujours',
      plans: [['Gratuit', '0 €', 'Jusqu’à 3 comptes', ['Boîte unifiée et page complète', 'Lire, rechercher, répondre et organiser', 'Notifications de base', 'Thèmes clair et sombre'], 'Ajouter à Chrome — gratuit'], ['Pro mensuel', '2 €', '7 jours gratuits puis 2 €/mois', ['Comptes illimités', 'Personnalisation complète', 'Ne pas déranger et règles de notification', 'Réglages par compte'], 'Essayer 7 jours gratuitement'], ['Pro permanent', '20 €', 'Un paiement pour la gamme Pro 1.x', ['Tout le forfait Pro mensuel', 'Sans abonnement ni renouvellement', 'Comptes illimités', 'Modèles et actions avancées'], 'Ajouter à Chrome']],
      note: 'Montants affichés à titre de référence pour la zone euro, hors taxes ; votre prix local exact et la taxe apparaissent au paiement. L’essai de 7 jours nécessite une carte et ne concerne que le forfait mensuel.',
    },
    faq: {
      eyebrow: 'Sans petite ligne cachée', title: 'Questions avant l’installation',
      items: [['Est-il sûr de donner accès à Gmail ?', 'La connexion utilise le parcours OAuth officiel de Google. Difmeil ne voit jamais votre mot de passe et vous pouvez révoquer l’accès à tout moment.'], ['Stockez-vous mes e-mails sur un serveur ?', 'Non. Difmeil ne stocke pas votre courrier sur ses propres serveurs. Le corps d’un message est téléchargé à l’ouverture puis n’est pas conservé.'], ['Combien de comptes puis-je connecter gratuitement ?', 'Jusqu’à 3. La boîte unifiée, la lecture, la recherche, les réponses et l’organisation restent gratuites.'], ['Que se passe-t-il si j’arrête Pro ?', 'Vous revenez au forfait Gratuit. Les comptes déjà connectés restent accessibles, mais vous ne pouvez pas en ajouter si vous en avez 3 ou plus. Votre courrier n’est jamais bloqué.'], ['Cela fonctionne-t-il en dehors de Chrome ?', 'Difmeil est distribué via le Chrome Web Store et peut être installé sur les navigateurs Chromium compatibles, comme Edge, Brave ou Opera.']],
    },
    closing: { title: 'Vos e-mails sont déjà dispersés. Votre attention n’a pas à l’être.', text: 'Réunissez vos comptes Gmail et sachez ce qui est arrivé, où et quand.', cta: 'Ajouter à Chrome — gratuit' },
    footer: { tagline: 'Tous vos comptes Gmail dans une seule boîte, avec notifications et apparence sous votre contrôle.', product: 'Produit', legal: 'Mentions légales', contact: 'Contact', privacy: 'Confidentialité', support: 'Assistance', made: 'Pensé pour celles et ceux qui vivent entre plusieurs boîtes.' },
  },
  de: {
    file: 'de/index.html', lang: 'de', locale: 'de_DE', canonical: 'https://difmeil.com/de/', privacyUrl: '/de/datenschutz/',
    title: 'Difmeil — alle deine Gmail-Konten in einem Posteingang',
    description: 'Lies, suche, antworte und erhalte Benachrichtigungen für alle Gmail-Konten in einem Posteingang. Kostenlos für bis zu 3 Konten.',
    skip: 'Zum Inhalt springen', menu: 'Menü öffnen', language: 'Sprache', install: 'Zu Chrome hinzufügen',
    nav: ['Produkt', 'Funktionen', 'Datenschutz', 'Preise', 'Fragen'],
    hero: {
      eyebrow: 'Chrome-Erweiterung · Kostenlos für bis zu 3 Konten', title: 'Alle deine Gmail-Konten. Ein Posteingang.',
      lead: 'Lies, suche, antworte und erhalte Benachrichtigungen für jedes Konto, ohne Profile zu wechseln oder einen weiteren Tab zu öffnen.',
      primary: 'Zu Chrome hinzufügen — kostenlos', secondary: 'So funktioniert es', note: 'Keine Karte · Sichere Verbindung mit Google', accounts: '3 Konten, eine Ansicht', mail: 'Neue E-Mail',
    },
    trust: ['Ein wirklich gemeinsamer Posteingang', 'E-Mails gehen direkt zwischen deinem Browser und Google', 'Español, English, Français, Deutsch und Português'],
    product: {
      eyebrow: 'Difmeil von innen', title: 'Weniger Wechsel. Mehr Kontrolle über deine E-Mails.',
      lead: 'Keine weitere Ebene über Gmail. Ein klarer Posteingang für alle Konten an einem Ort.',
      mainTitle: 'Alle Nachrichten nach Datum sortiert', mainText: 'Der gemeinsame Posteingang vereint Nachrichten aus allen Konten und behält deren Farben bei, damit du immer weißt, wo du bist.',
      bullets: ['Alle Konten gleichzeitig durchsuchen', 'Lesen, antworten, weiterleiten, archivieren oder löschen', 'Bei Bedarf zur Ansicht eines einzelnen Kontos wechseln'],
      alts: ['Gemeinsamer Difmeil-Posteingang mit mehreren Gmail-Konten', 'Difmeil-Schnellfenster mit mehreren verbundenen Konten', 'Difmeil-Darstellungseinstellungen mit Sprache, Design und Dichte'],
      cards: [{ title: 'Alle Konten mit einem Klick', text: 'Das Schnellfenster zeigt ungelesene Nachrichten pro Konto, ohne das Chrome-Profil zu wechseln.' }, { title: 'Dein Posteingang, deine Regeln', text: 'Wähle Sprache, Design, Dichte, Textgröße, Farben, Aliasse und Symbole für jedes Konto.' }],
    },
    features: {
      eyebrow: 'Das Wesentliche, richtig gelöst', title: 'Alles, was du von E-Mail erwartest. Ohne es auf Tabs zu verteilen.',
      lead: 'Difmeil bündelt den Gmail-Alltag und gibt dir dort Kontrolle pro Konto, wo sie am wichtigsten ist.',
      cards: [['Kontenübergreifende Suche', 'Verbinde lokale Suche und echte Gmail-Suche, ohne wissen zu müssen, in welchem Konto die Nachricht liegt.'], ['Schreiben und antworten', 'Verfasse, beantworte und leite Nachrichten mit Anhängen weiter, ohne die Erweiterung zu verlassen.'], ['Sinnvolle Benachrichtigungen', 'Aktiviere Hinweise pro Konto und erstelle Regeln nach Absender, Betreff oder Kategorie.'], ['Sammelaktionen', 'Markiere mehrere Nachrichten auf einmal als gelesen, archiviere oder lösche sie.']],
    },
    privacy: {
      eyebrow: 'Datenschutz, den man erklären kann', title: 'Deine E-Mails liegen nicht auf unseren Servern.',
      text: 'Anfragen zum Lesen oder Verwalten von Nachrichten gehen von deinem Browser zu Google. Difmeil speichert Konten, Tokens und Einstellungen lokal im Browser; vollständige Nachrichtentexte werden nur beim Öffnen geladen und nicht dauerhaft gespeichert.',
      link: 'Vollständige Erklärung lesen', browser: 'Dein Browser', browserSub: 'Difmeil und deine Einstellungen', route: 'Direkte Verbindung', google: 'Google', googleSub: 'Gmail API und People API',
      note: 'Der erste Autorisierungsaustausch nutzt einen technischen Dienst, der weder E-Mails noch Zugangsdaten speichert.',
    },
    steps: { eyebrow: 'Nur drei Schritte', title: 'Installieren. Verbinden. Durchatmen.', lead: 'Nichts importieren, keine Weiterleitung einrichten.', items: [['Difmeil installieren', 'Füge die Erweiterung aus dem Chrome Web Store hinzu und öffne sie über die Browserleiste.'], ['Gmail verbinden', 'Autorisiere das erste Konto über Googles offiziellen Ablauf. Difmeil sieht dein Passwort nie.'], ['Wiederholen und vereinen', 'Füge die übrigen Konten hinzu. Ihre Nachrichten erscheinen sofort zusammen.']] },
    pricing: {
      eyebrow: 'Klare Preise', title: 'Kostenlos starten. Nur zahlen, wenn du mehr brauchst.', lead: 'Der kostenlose Tarif enthält bis zu 3 Konten und alle wichtigen Funktionen.',
      tag: 'Einmalzahlung', monthlySuffix: '/Monat', onceSuffix: 'einmalig', forever: 'dauerhaft',
      plans: [['Kostenlos', '0 €', 'Bis zu 3 Konten', ['Gemeinsamer Posteingang und Vollansicht', 'Lesen, suchen, antworten und organisieren', 'Grundlegende Benachrichtigungen', 'Helles und dunkles Design'], 'Zu Chrome hinzufügen — kostenlos'], ['Pro monatlich', '2 €', '7 Tage kostenlos, danach 2 €/Monat', ['Unbegrenzte Konten', 'Vollständige Personalisierung', 'Nicht stören und Benachrichtigungsregeln', 'Einstellungen pro Konto'], '7 Tage kostenlos testen'], ['Pro permanent', '20 €', 'Eine Zahlung für die Pro-1.x-Reihe', ['Alles aus Pro monatlich', 'Kein Abo und keine Verlängerung', 'Unbegrenzte Konten', 'Vorlagen und erweiterte Aktionen'], 'Zu Chrome hinzufügen']],
      note: 'Die angezeigten Beträge sind Referenzpreise für den Euroraum ohne Steuern; dein genauer lokaler Preis und die Steuer erscheinen beim Bezahlen. Die 7-Tage-Testphase erfordert eine Karte und gilt nur für den Monatstarif.',
    },
    faq: {
      eyebrow: 'Kein verstecktes Kleingedrucktes', title: 'Fragen vor der Installation',
      items: [['Ist der Zugriff auf Gmail sicher?', 'Die Verbindung nutzt Googles offiziellen OAuth-Ablauf. Difmeil sieht dein Passwort nie und du kannst den Zugriff jederzeit im Google-Konto widerrufen.'], ['Speichert ihr meine E-Mails auf einem Server?', 'Nein. Difmeil speichert deine E-Mails nicht auf eigenen Servern. Ein Nachrichtentext wird erst beim Öffnen geladen und nicht dauerhaft gespeichert.'], ['Wie viele Konten sind kostenlos?', 'Bis zu 3. Gemeinsamer Posteingang, Lesen, Suche, Antworten und Organisation bleiben kostenlos.'], ['Was passiert, wenn ich Pro kündige?', 'Du kehrst zum kostenlosen Tarif zurück. Bereits verbundene Konten bleiben erreichbar, aber mit 3 oder mehr kannst du kein weiteres hinzufügen. Deine E-Mails werden nie blockiert.'], ['Funktioniert es außerhalb von Chrome?', 'Difmeil wird über den Chrome Web Store verteilt und kann in kompatiblen Chromium-Browsern wie Edge, Brave oder Opera installiert werden.']],
    },
    closing: { title: 'Deine E-Mails sind schon verteilt. Deine Aufmerksamkeit muss es nicht sein.', text: 'Vereine deine Gmail-Konten und behalte im Blick, was wann und wo angekommen ist.', cta: 'Zu Chrome hinzufügen — kostenlos' },
    footer: { tagline: 'Alle deine Gmail-Konten in einem Posteingang – mit Benachrichtigungen und Darstellung unter deiner Kontrolle.', product: 'Produkt', legal: 'Rechtliches', contact: 'Kontakt', privacy: 'Datenschutz', support: 'Support', made: 'Für Menschen, die zwischen mehreren Posteingängen leben.' },
  },
  pt: {
    file: 'pt/index.html', lang: 'pt', locale: 'pt_BR', canonical: 'https://difmeil.com/pt/', privacyUrl: '/pt/privacidade/',
    title: 'Difmeil — todas as suas contas do Gmail em uma só caixa de entrada',
    description: 'Leia, busque, responda e receba avisos de todas as contas do Gmail em uma caixa de entrada. Grátis para até 3 contas.',
    skip: 'Pular para o conteúdo', menu: 'Abrir menu', language: 'Idioma', install: 'Adicionar ao Chrome',
    nav: ['Produto', 'Recursos', 'Privacidade', 'Preços', 'Dúvidas'],
    hero: {
      eyebrow: 'Extensão para Chrome · Grátis para até 3 contas', title: 'Todas as suas contas do Gmail. Uma só caixa de entrada.',
      lead: 'Leia, busque, responda e receba avisos de cada conta sem trocar de perfil nem abrir outra aba.',
      primary: 'Adicionar ao Chrome — grátis', secondary: 'Veja como funciona', note: 'Sem cartão · Conexão segura com o Google', accounts: '3 contas, uma visão', mail: 'Novo e-mail',
    },
    trust: ['Uma caixa realmente unificada', 'O correio vai direto entre seu navegador e o Google', 'Español, English, Français, Deutsch e Português'],
    product: {
      eyebrow: 'Veja o Difmeil por dentro', title: 'Menos trocas. Mais controle sobre seu correio.',
      lead: 'Não é outra camada em cima do Gmail. É uma caixa clara para trabalhar com todas as contas no mesmo lugar.',
      mainTitle: 'Todas as mensagens por data', mainText: 'A caixa unificada combina mensagens das suas contas e mantém a cor de cada uma para você sempre saber onde está.',
      bullets: ['Busque em todas as contas de uma vez', 'Leia, responda, encaminhe, arquive ou exclua', 'Mude para a visão de uma conta quando quiser'],
      alts: ['Caixa unificada do Difmeil com mensagens de várias contas do Gmail', 'Janela rápida do Difmeil mostrando várias contas conectadas', 'Configurações de aparência do Difmeil com idioma, tema e densidade'],
      cards: [{ title: 'Todas as contas a um clique', text: 'A janela rápida mostra qual conta tem pendências sem exigir a troca de perfil do Chrome.' }, { title: 'Sua caixa, do seu jeito', text: 'Escolha idioma, tema, densidade, tamanho do texto, cores, apelidos e ícones para reconhecer cada conta.' }],
    },
    features: {
      eyebrow: 'O essencial, bem resolvido', title: 'Tudo o que você espera do e-mail. Sem espalhar pelas abas.',
      lead: 'O Difmeil reúne o trabalho diário do Gmail e adiciona controle por conta onde ele mais importa.',
      cards: [['Busca entre contas', 'Combine busca local e busca real do Gmail sem precisar lembrar em qual conta estava a mensagem.'], ['Escreva e responda', 'Escreva, responda a todos e encaminhe com anexos sem sair da extensão.'], ['Notificações úteis', 'Ative avisos por conta e crie regras por remetente, assunto ou categoria para reduzir o ruído.'], ['Ações em lote', 'Marque como lido, arquive ou mande várias mensagens para a lixeira de uma vez.']],
    },
    privacy: {
      eyebrow: 'Privacidade fácil de explicar', title: 'Seu correio não fica nos nossos servidores.',
      text: 'As requisições para ler ou gerenciar mensagens vão do seu navegador para o Google. O Difmeil mantém contas, tokens e preferências no armazenamento local do navegador; o corpo completo só é baixado ao abrir o e-mail e não fica salvo.',
      link: 'Ler a política completa', browser: 'Seu navegador', browserSub: 'Difmeil e suas preferências', route: 'Conexão direta', google: 'Google', googleSub: 'Gmail API e People API',
      note: 'A troca inicial de autorização usa um serviço técnico que não armazena seu correio nem suas credenciais.',
    },
    steps: { eyebrow: 'Só três passos', title: 'Instale. Conecte. Respire.', lead: 'Não é preciso importar nada nem configurar encaminhamento.', items: [['Instale o Difmeil', 'Adicione a extensão pela Chrome Web Store e abra pela barra do navegador.'], ['Conecte seu Gmail', 'Autorize a primeira conta pelo fluxo oficial do Google. O Difmeil nunca vê sua senha.'], ['Repita e unifique', 'Adicione as outras contas. As mensagens aparecem juntas a partir desse momento.']] },
    pricing: {
      eyebrow: 'Preços claros', title: 'Comece grátis. Pague só quando precisar de mais.', lead: 'O plano grátis inclui até 3 contas e todos os recursos essenciais.',
      tag: 'Pagamento único', monthlySuffix: '/mês', onceSuffix: 'uma vez', forever: 'para sempre',
      plans: [['Grátis', '0 €', 'Até 3 contas', ['Caixa unificada e página completa', 'Ler, buscar, responder e organizar', 'Notificações básicas', 'Tema claro e escuro'], 'Adicionar ao Chrome — grátis'], ['Pro mensal', '2 €', '7 dias grátis; depois 2 €/mês', ['Contas ilimitadas', 'Personalização completa', 'Não perturbe e regras de notificação', 'Configurações por conta'], 'Testar 7 dias grátis'], ['Pro permanente', '20 €', 'Um pagamento para a linha Pro 1.x', ['Tudo do Pro mensal', 'Sem assinatura nem renovação', 'Contas ilimitadas', 'Modelos e ações avançadas'], 'Adicionar ao Chrome']],
      note: 'Os valores exibidos são referências para a zona do euro, sem impostos; o preço local exato e o imposto aparecem no pagamento. O teste de 7 dias exige cartão e vale apenas para o plano mensal.',
    },
    faq: {
      eyebrow: 'Sem letras pequenas escondidas', title: 'Dúvidas antes de instalar',
      items: [['É seguro dar acesso ao Gmail?', 'A conexão usa o fluxo oficial do Google OAuth. O Difmeil nunca vê sua senha e você pode revogar o acesso pela conta do Google quando quiser.'], ['Vocês guardam meus e-mails em um servidor?', 'Não. O Difmeil não armazena seu correio em servidores próprios. O corpo da mensagem é baixado ao abrir e não fica salvo.'], ['Quantas contas posso conectar grátis?', 'Até 3. Você pode usar a caixa unificada, ler, buscar, responder e organizar sem pagar.'], ['O que acontece se eu parar de pagar o Pro?', 'Você volta ao plano Grátis. As contas conectadas continuam acessíveis, mas não é possível adicionar outra enquanto houver 3 ou mais. O correio nunca é bloqueado.'], ['Funciona fora do Chrome?', 'O Difmeil é distribuído pela Chrome Web Store e pode ser instalado em navegadores Chromium compatíveis, como Edge, Brave ou Opera.']],
    },
    closing: { title: 'Seu correio já está espalhado. Sua atenção não precisa estar.', text: 'Reúna suas contas do Gmail e volte a saber o que chegou, onde e quando.', cta: 'Adicionar ao Chrome — grátis' },
    footer: { tagline: 'Todas as suas contas do Gmail em uma caixa, com notificações e aparência sob seu controle.', product: 'Produto', legal: 'Legal', contact: 'Contato', privacy: 'Privacidade', support: 'Suporte', made: 'Feito para quem vive entre várias caixas de entrada.' },
  },
};

const icons = {
  check: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m6 12 4 4 8-9"/></svg>',
  search: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
  reply: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m9 17-5-5 5-5"/><path d="M4 12h10a6 6 0 0 1 6 6"/></svg>',
  bell: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></svg>',
  layers: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-9 5 9 5 9-5-9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 16 9 5 9-5"/></svg>',
  shield: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 5 6v6c0 4.6 3 8 7 9 4-1 7-4.4 7-9V6l-7-3Z"/><path d="m9 12 2 2 4-5"/></svg>',
  globe: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></svg>',
  browser: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/></svg>',
  google: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5.1a4.4 4.4 0 0 1-1.9 2.9v2.4h3.1c1.8-1.7 2.7-4.1 2.7-7Z"/><path d="M12 21c2.6 0 4.8-.9 6.3-2.3l-3.1-2.4c-.9.6-2 .9-3.2.9-2.5 0-4.7-1.7-5.4-4h-3v2.5A9.5 9.5 0 0 0 12 21Z"/><path d="M6.6 13.2A5.8 5.8 0 0 1 6.3 12c0-.4.1-.8.2-1.2V8.3h-3A9 9 0 0 0 2.5 12c0 1.4.3 2.6 1 3.7l3.1-2.5Z"/><path d="M12 6.8c1.4 0 2.7.5 3.7 1.5l2.7-2.8A9.1 9.1 0 0 0 3.5 8.3l3.1 2.5c.7-2.3 2.9-4 5.4-4Z"/></svg>',
  arrow: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 12h16M15 7l5 5-5 5"/></svg>',
  menu: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  chrome: '<svg class="chrome-mark" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fff" opacity=".98"/><circle cx="12" cy="12" r="4.1" fill="#4285f4"/><path d="M3.4 7.1h10.8l3.1 5.4" fill="none" stroke="#ea4335" stroke-width="4"/><path d="m17.2 12.5-5.4 9" fill="none" stroke="#34a853" stroke-width="4"/><path d="M11.8 21.5 6.5 12" fill="none" stroke="#fbbc05" stroke-width="4"/></svg>',
};

function installButton(label, className = 'btn btn-primary') {
  return `<a class="${className}" href="${storeUrl}" target="_blank" rel="noopener noreferrer">${icons.chrome}<span>${label}</span></a>`;
}

function languages(current, mobile = false) {
  return languageLinks.map((item) => `<a href="${item.href}" hreflang="${item.code}"${item.code === current ? ' aria-current="page"' : ''}>${mobile ? item.short : item.label}</a>`).join('');
}

function featureList(items) {
  return `<ul class="feature-list">${items.map((item) => `<li>${icons.check}<span>${item}</span></li>`).join('')}</ul>`;
}

function productPicture(name, alt, { eager = false, sizes = '(max-width: 700px) calc(100vw - 24px), 50vw' } = {}) {
  return `<picture><source type="image/webp" srcset="/assets/product/${name}-640.webp 640w, /assets/product/${name}.webp 1280w" sizes="${sizes}"><img src="/assets/product/${name}.png" width="1280" height="800"${eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'} alt="${alt}"></picture>`;
}

function documentFor(d) {
  const navHrefs = ['#producto', '#funciones', '#privacidad', '#precios', '#faq'];
  const alternates = languageLinks.map((item) => `<link rel="alternate" hreflang="${item.code}" href="https://difmeil.com${item.href}" />`).join('\n');
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Difmeil', applicationCategory: 'ProductivityApplication', operatingSystem: 'Chrome, Chromium',
    description: d.description, url: d.canonical, downloadUrl: storeUrl, image: 'https://difmeil.com/assets/product/unified-inbox.png',
    offers: [
      { '@type': 'Offer', name: d.pricing.plans[0][0], price: '0', priceCurrency: 'EUR' },
      { '@type': 'Offer', name: d.pricing.plans[1][0], price: '2', priceCurrency: 'EUR' },
      { '@type': 'Offer', name: d.pricing.plans[2][0], price: '20', priceCurrency: 'EUR' },
    ],
  }, null, 2).replaceAll('<', '\\u003c');

  const cards = d.features.cards.map((card, index) => `<article class="bento-card"><div class="bento-icon">${[icons.search, icons.reply, icons.bell, icons.layers][index]}</div><h3>${card[0]}</h3><p>${card[1]}</p></article>`).join('');
  const steps = d.steps.items.map((item) => `<article class="step"><h3>${item[0]}</h3><p>${item[1]}</p></article>`).join('');
  const prices = d.pricing.plans.map((plan, index) => `<article class="price-card${index === 2 ? ' featured' : ''}">${index === 2 ? `<span class="price-tag">${d.pricing.tag}</span>` : ''}<div class="price-name">${plan[0]}</div><div class="price">${plan[1]}${index === 1 ? `<small>${d.pricing.monthlySuffix}</small>` : index === 2 ? `<small>${d.pricing.onceSuffix}</small>` : ''}</div><div class="price-sub">${plan[2]}</div>${featureList(plan[3])}${installButton(plan[4], index === 2 ? 'btn btn-primary' : 'btn btn-outline')}</article>`).join('');
  const faqs = d.faq.items.map((item) => `<details><summary>${item[0]}</summary><p>${item[1]}</p></details>`).join('');

  return `<!DOCTYPE html>
<html lang="${d.lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${d.title}</title>
  <meta name="description" content="${d.description}" />
  <meta name="robots" content="index,follow" />
  <meta name="theme-color" content="#f7f5ef" />
  <link rel="icon" type="image/png" href="/assets/logo-mark.png" />
  <link rel="canonical" href="${d.canonical}" />
  ${alternates}
  <link rel="alternate" hreflang="x-default" href="https://difmeil.com/en/" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="${d.locale}" />
  <meta property="og:title" content="${d.title}" />
  <meta property="og:description" content="${d.description}" />
  <meta property="og:url" content="${d.canonical}" />
  <meta property="og:image" content="https://difmeil.com/assets/product/unified-inbox.png" />
  <meta property="og:image:width" content="1280" />
  <meta property="og:image:height" content="800" />
  <meta property="og:image:alt" content="${d.product.alts[0]}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${d.title}" />
  <meta name="twitter:description" content="${d.description}" />
  <meta name="twitter:image" content="https://difmeil.com/assets/product/unified-inbox.png" />
  <link rel="preload" href="/assets/product/unified-inbox.webp" as="image" type="image/webp" imagesrcset="/assets/product/unified-inbox-640.webp 640w, /assets/product/unified-inbox.webp 1280w" imagesizes="(max-width: 980px) calc(100vw - 40px), 55vw" fetchpriority="high" />
  <link rel="stylesheet" href="/assets/site.css" />
  <script type="application/ld+json">${jsonLd}</script>
  <script src="/assets/site.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#contenido">${d.skip}</a>
  <header class="site-header">
    <div class="wrap header-inner">
      <a class="brand" href="${d.lang === 'es' ? '/' : `/${d.lang}/`}" aria-label="Difmeil"><img src="/assets/logo-mark.png" width="32" height="32" alt="" />Difmeil</a>
      <nav class="desktop-nav" aria-label="Difmeil">${d.nav.map((label, i) => `<a href="${navHrefs[i]}">${label}</a>`).join('')}</nav>
      <div class="header-actions"><a class="language-link" href="#idiomas">${icons.globe}<span>${d.language}</span></a>${installButton(d.install, 'btn btn-primary btn-small')}<button class="menu-button" type="button" popovertarget="mobile-menu" aria-controls="mobile-menu" aria-expanded="false" aria-label="${d.menu}">${icons.menu}</button></div>
    </div>
    <div class="mobile-menu" id="mobile-menu" popover>
      <nav aria-label="${d.menu}">${d.nav.map((label, i) => `<a href="${navHrefs[i]}">${label}</a>`).join('')}${installButton(d.install, 'btn btn-primary')}</nav>
      <nav class="mobile-languages" aria-label="${d.language}">${languages(d.lang, true)}</nav>
    </div>
  </header>

  <main id="contenido">
    <section class="hero" id="producto">
      <div class="wrap hero-grid">
        <div class="hero-copy">
          <p class="eyebrow">${d.hero.eyebrow}</p>
          <h1>${d.hero.title}</h1>
          <p class="hero-lead">${d.hero.lead}</p>
          <div class="hero-actions">${installButton(d.hero.primary)}<a class="btn btn-outline" href="#funciones">${d.hero.secondary}</a></div>
          <p class="hero-note">${d.hero.note}</p>
        </div>
        <div class="hero-visual">
          <div class="product-window"><div class="window-bar"><span></span><span></span><span></span></div>${productPicture('unified-inbox', d.product.alts[0], { eager: true, sizes: '(max-width: 980px) calc(100vw - 40px), 55vw' })}</div>
          <div class="account-chip" aria-hidden="true"><span class="account-stack"><span>T</span><span>P</span><span>C</span></span>${d.hero.accounts}</div>
          <div class="mail-chip" aria-hidden="true"><b>3</b>${d.hero.mail}</div>
        </div>
      </div>
    </section>

    <aside class="trust-strip" aria-label="Difmeil"><ul class="wrap trust-list"><li>${icons.layers}${d.trust[0]}</li><li>${icons.shield}${d.trust[1]}</li><li>${icons.globe}${d.trust[2]}</li></ul></aside>

    <section class="section" id="funciones">
      <div class="wrap">
        <header class="section-heading"><p class="eyebrow">${d.product.eyebrow}</p><h2>${d.product.title}</h2><p>${d.product.lead}</p></header>
        <div class="showcase-main">
          <figure class="screenshot-card">${productPicture('unified-inbox', d.product.alts[0], { sizes: '(max-width: 980px) calc(100vw - 40px), 66vw' })}</figure>
          <div class="showcase-copy"><h3>${d.product.mainTitle}</h3><p>${d.product.mainText}</p>${featureList(d.product.bullets)}</div>
        </div>
        <div class="story-grid">
          <article class="story-card">${productPicture('multiple-accounts', d.product.alts[1])}<div class="story-copy"><h3>${d.product.cards[0].title}</h3><p>${d.product.cards[0].text}</p></div></article>
          <article class="story-card">${productPicture('appearance', d.product.alts[2])}<div class="story-copy"><h3>${d.product.cards[1].title}</h3><p>${d.product.cards[1].text}</p></div></article>
        </div>
      </div>
    </section>

    <section class="section section-soft">
      <div class="wrap">
        <header class="section-heading centered"><p class="eyebrow">${d.features.eyebrow}</p><h2>${d.features.title}</h2><p>${d.features.lead}</p></header>
        <div class="bento">${cards}</div>
      </div>
    </section>

    <section class="section privacy" id="privacidad">
      <div class="wrap privacy-grid">
        <div class="privacy-copy"><p class="eyebrow">${d.privacy.eyebrow}</p><h2>${d.privacy.title}</h2><p>${d.privacy.text}</p><a href="${d.privacyUrl}">${d.privacy.link} →</a></div>
        <div class="data-route">
          <div class="data-node">${icons.browser}<div><strong>${d.privacy.browser}</strong><span>${d.privacy.browserSub}</span></div></div>
          <div class="data-arrow">${icons.arrow}<span>${d.privacy.route}</span></div>
          <div class="data-node">${icons.google}<div><strong>${d.privacy.google}</strong><span>${d.privacy.googleSub}</span></div></div>
          <p class="privacy-note">${d.privacy.note}</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <header class="section-heading centered"><p class="eyebrow">${d.steps.eyebrow}</p><h2>${d.steps.title}</h2><p>${d.steps.lead}</p></header>
        <div class="steps">${steps}</div>
      </div>
    </section>

    <section class="section section-soft" id="precios">
      <div class="wrap">
        <header class="section-heading centered"><p class="eyebrow">${d.pricing.eyebrow}</p><h2>${d.pricing.title}</h2><p>${d.pricing.lead}</p></header>
        <div class="pricing-grid">${prices}</div>
        <p class="pricing-note">${d.pricing.note}</p>
      </div>
    </section>

    <section class="section" id="faq">
      <div class="wrap">
        <header class="section-heading centered"><p class="eyebrow">${d.faq.eyebrow}</p><h2>${d.faq.title}</h2></header>
        <div class="faq-list">${faqs}</div>
      </div>
    </section>

    <section class="closing">
      <div class="wrap closing-card"><div><h2>${d.closing.title}</h2><p>${d.closing.text}</p></div>${installButton(d.closing.cta, 'btn btn-dark')}</div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-grid">
        <div class="footer-intro"><a class="brand" href="${d.lang === 'es' ? '/' : `/${d.lang}/`}"><img src="/assets/logo-mark.png" width="32" height="32" alt="" />Difmeil</a><p>${d.footer.tagline}</p></div>
        <div class="footer-col"><h2>${d.footer.product}</h2>${d.nav.slice(0, 4).map((label, i) => `<a href="${navHrefs[i]}">${label}</a>`).join('')}</div>
        <div class="footer-col"><h2>${d.footer.legal}</h2><a href="${d.privacyUrl}">${d.footer.privacy}</a><a href="mailto:support@difmeil.com">${d.footer.support}</a></div>
        <div class="footer-col" id="idiomas"><h2>${d.language}</h2>${languages(d.lang)}</div>
      </div>
      <div class="footer-bottom"><span>© <span data-year>2026</span> Difmeil</span><span>${d.footer.made}</span></div>
    </div>
  </footer>
</body>
</html>
`;
}

for (const data of Object.values(shared)) {
  const target = join(root, data.file);
  mkdirSync(dirname(target), { recursive: true });
  const html = documentFor(data).replace(/<(meta|link|img)([^>]*?) \/>/g, '<$1$2>');
  writeFileSync(target, html, 'utf8');
}

console.log(`Generated ${Object.keys(shared).length} localized homepages.`);
