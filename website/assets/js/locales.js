/* eslint-disable max-len */
window.SITE_LOCALES = {
  en: {
    'meta.title': 'crypto-vdf — Verifiable Delay Functions for JavaScript',
    'meta.description':
      'crypto-vdf — Verifiable Delay Functions for JavaScript. Learn what VDFs are, try the live demo, Pietrzak & Wesolowski in Node.js and browsers.',
    'nav.what': 'What is a VDF?',
    'nav.apps': 'Applications',
    'nav.demo': 'Live demo',
    'nav.library': 'Library',
    'nav.start': 'Quick start',
    'nav.api': 'API',
    'nav.github': 'GitHub',
    'nav.npm': 'npm install',
    'hero.label': 'Proof-of-time cryptography',
    'hero.title': 'Time you can prove.<br />Verification anyone can run.',
    'hero.lead':
      'A <strong>Verifiable Delay Function</strong> forces sequential computation to produce an output—then proves it in milliseconds. Built for Node.js and browsers in TypeScript.',
    'hero.cta.start': 'Get started',
    'hero.cta.api': 'API reference',
    'hero.diagram.aria':
      'Diagram: challenge flows through slow solve to proof, then fast verify to accepted output',
    'svg.pipeline': 'VDF evaluation pipeline',
    'svg.challenge': 'Challenge',
    'svg.solve': 'solve()',
    'svg.sequential': 'sequential work',
    'svg.cannotParallel': 'cannot parallelize',
    'svg.proof': 'Proof',
    'svg.verify': 'verify()',
    'svg.fast': 'fast ✓',
    'svg.solveTime': 'solve time',
    'svg.verifyTime': 'verify time',
    'what.label': 'Concept',
    'what.title': 'What is a Verifiable Delay Function?',
    'what.intro':
      'A VDF is a function <em>y = f(x)</em> that takes a chosen wall-clock time to compute (even with many CPUs), but where anyone can check <em>y</em> from a compact proof in a fraction of a second. That gap between <strong>slow evaluation</strong> and <strong>fast verification</strong> is the whole point.',
    'what.card1.title': 'Sequential delay',
    'what.card1.text': 'Each step depends on the last. Throwing more cores at it does not shorten the delay.',
    'what.card2.title': 'Compact proof',
    'what.card2.text':
      'The prover outputs a proof π that encodes the delayed computation without redoing all the work.',
    'what.card3.title': 'Public verify',
    'what.card3.text':
      'Validators, smart contracts, or clients confirm correctness quickly—no trust in the prover’s hardware.',
    'what.d1.title': 'Why “verifiable delay”?',
    'what.d1.caption': 'Evaluation time is a tunable parameter (difficulty). Verification stays cheap.',
    'what.d1.chart': 'Relative cost (log scale, illustrative)',
    'what.d1.solve': 'solve',
    'what.d1.solveUnit': 'seconds–minutes',
    'what.d1.verify': 'verify',
    'what.d1.verifyUnit': 'milliseconds',
    'what.d1.cost': 'cost',
    'what.d1.legendSolve': 'Solve — intentional bottleneck',
    'what.d1.legendVerify': 'Verify — efficient check',
    'what.d2.title': 'Parallel machines still wait',
    'what.d2.caption': 'Ideal for fairness: no one can “buy” a shorter delay with more GPUs alone.',
    'what.d2.chart': '1 CPU vs many CPUs (same VDF chain)',
    'what.d2.oneCore': '1 core',
    'what.d2.tDelay': 'T delay',
    'what.d2.nCores': 'N cores',
    'what.d2.chain': 'still one sequential chain → same T',
    'what.d2.same': '✓ same minimum delay',
    'apps.label': 'Use cases',
    'apps.title': 'Where VDFs are used',
    'apps.intro':
      'Protocols need time to pass—or randomness no one could have predicted early. VDFs anchor that logic in cryptography instead of trusted timers.',
    'apps.beacon.title': 'Randomness beacon (simplified)',
    'apps.beacon.caption':
      'Everyone agrees on output only after the delay elapses—late entrants cannot bias earlier rounds.',
    'apps.svg.round': 'Round input',
    'apps.svg.seed': 'block hash + seed',
    'apps.svg.vdfDelay': 'VDF delay',
    'apps.svg.solveRace': 'public solve race',
    'apps.svg.proofPi': 'Proof π',
    'apps.svg.fastVerify': 'Fast verify',
    'apps.svg.random': 'Random',
    'apps.svg.output': 'output',
    'apps.c1.title': 'Randomness beacons',
    'apps.c1.text':
      'Unbiasable public randomness for lotteries, leader election, and consensus protocols after a public delay.',
    'apps.c2.title': 'Blockchain & consensus',
    'apps.c2.text':
      'Proof-of-time and delay in leader selection—reducing advantage from hashrate alone in some designs.',
    'apps.c3.title': 'Time-lock puzzles',
    'apps.c3.text':
      'Encrypt or commit to data that only becomes usable after a verifiable wait—useful for escrows and timed release.',
    'apps.c4.title': 'Anti front-running',
    'apps.c4.text':
      'Order or reveal transactions only after a delay so participants cannot rush ahead of a committed schedule.',
    'demo.label': 'Try it in your browser',
    'demo.title': 'Live demo — real crypto-vdf code',
    'demo.intro':
      'This runs the same <strong>browser bundle</strong> published on npm. Watch each step: a public challenge goes in, <code>solve()</code> burns time on your CPU, then <code>verify()</code> checks the proof instantly.',
    'demo.exp.title': 'Your experiment',
    'demo.challenge.label': 'Challenge (hex bytes)',
    'demo.challenge.hint': 'Public input <em>x</em> — anyone can see it before the delay finishes.',
    'demo.random.title': 'Random challenge',
    'demo.scheme.label': 'VDF scheme',
    'demo.scheme.weso': 'Wesolowski (recommended)',
    'demo.scheme.piet': 'Pietrzak',
    'demo.bits.label': 'Security size (discriminant)',
    'demo.bits.256': '256-bit (faster)',
    'demo.bits.512': '512-bit (heavier solve)',
    'demo.diff.label': 'Difficulty (iterations)',
    'demo.diff.hint': 'Higher difficulty = longer <code>solve()</code>; <code>verify()</code> stays near-instant.',
    'demo.run': '▶ Run live demo',
    'demo.codeLabel': 'Code being executed',
    'demo.steps.title': 'What happens step by step',
    'demo.s1.title': 'Challenge',
    'demo.s1.text': 'Parse your hex string into <code>Uint8Array</code>.',
    'demo.s2.title': 'Setup',
    'demo.s2.text': 'Pick scheme + load precomputed discriminant.',
    'demo.s3.title': 'solve()',
    'demo.s3.text': 'Sequential work — cannot be shortened with more cores.',
    'demo.s4.title': 'Proof π',
    'demo.s4.text': 'Compact certificate of the computation.',
    'demo.s5.title': 'verify()',
    'demo.s5.text': 'Anyone validates π without repeating the delay.',
    'demo.s6.title': 'Done',
    'demo.s6.text': 'Output is trustworthy — the delay really elapsed.',
    'demo.logLabel': 'Activity log',
    'lib.label': 'crypto-vdf',
    'lib.title': 'This library',
    'lib.intro':
      'TypeScript implementations of <strong>Pietrzak</strong> and <strong>Wesolowski</strong> VDFs with precomputed discriminants (256–2048 bit), Node.js ESM/CJS, and a browser bundle.',
    'lib.c1.title': 'Wesolowski (recommended)',
    'lib.c1.text': 'Any positive difficulty, smaller proofs, fast verify. Default choice for production.',
    'lib.c2.title': 'Pietrzak',
    'lib.c2.text': 'Even difficulty ≥ 66, max 7000 in this JS port. Compact proofs at lower difficulties.',
    'lib.c3.title': 'Precomputed D',
    'lib.c3.text': 'Discriminants from Rust GMP—do not generate in pure JS for production workloads.',
    'lib.note':
      '<strong>Production:</strong> Use <code>DISCRIMINANT_*</code> constants and Wesolowski unless you have a specific reason for Pietrzak.',
    'start.label': 'Developers',
    'start.title': 'Quick start',
    'start.api': 'API documentation',
    'start.npm': 'npm',
    'start.research': 'VDF research',
    'footer.license': 'Apache-2.0',
    'lang.label': 'Language',
  },
  fr: {
    'meta.title': 'crypto-vdf — Fonctions à délai vérifiables pour JavaScript',
    'meta.description':
      'crypto-vdf — VDF en JavaScript. Comprenez les VDF, essayez la démo en direct : Pietrzak et Wesolowski pour Node.js et le navigateur.',
    'nav.what': 'Qu’est-ce qu’une VDF ?',
    'nav.apps': 'Applications',
    'nav.demo': 'Démo en direct',
    'nav.library': 'Bibliothèque',
    'nav.start': 'Démarrage',
    'nav.api': 'API',
    'nav.github': 'GitHub',
    'nav.npm': 'npm install',
    'hero.label': 'Cryptographie à preuve de temps',
    'hero.title': 'Du temps que l’on peut prouver.<br />Une vérification pour tous.',
    'hero.lead':
      'Une <strong>fonction à délai vérifiable</strong> impose un calcul séquentiel pour produire une sortie, puis la prouve en millisecondes. Pour Node.js et les navigateurs, en TypeScript.',
    'hero.cta.start': 'Commencer',
    'hero.cta.api': 'Référence API',
    'hero.diagram.aria':
      'Schéma : défi, résolution lente, preuve, vérification rapide, sortie acceptée',
    'svg.pipeline': 'Pipeline d’évaluation VDF',
    'svg.challenge': 'Défi',
    'svg.solve': 'solve()',
    'svg.sequential': 'travail séquentiel',
    'svg.cannotParallel': 'non parallélisable',
    'svg.proof': 'Preuve',
    'svg.verify': 'verify()',
    'svg.fast': 'rapide ✓',
    'svg.solveTime': 'temps solve',
    'svg.verifyTime': 'temps verify',
    'what.label': 'Concept',
    'what.title': 'Qu’est-ce qu’une fonction à délai vérifiable ?',
    'what.intro':
      'Une VDF est une fonction <em>y = f(x)</em> qui demande un temps réel pour être calculée (même avec beaucoup de CPU), mais dont le résultat <em>y</em> se vérifie en une fraction de seconde via une preuve compacte. L’écart entre <strong>évaluation lente</strong> et <strong>vérification rapide</strong> est l’essentiel.',
    'what.card1.title': 'Délai séquentiel',
    'what.card1.text': 'Chaque étape dépend de la précédente. Plus de cœurs ne raccourcit pas le délai.',
    'what.card2.title': 'Preuve compacte',
    'what.card2.text': 'Le prouveur produit une preuve π sans refaire tout le travail.',
    'what.card3.title': 'Vérification publique',
    'what.card3.text':
      'Validateurs, contrats ou clients vérifient rapidement—sans faire confiance au matériel du prouveur.',
    'what.d1.title': 'Pourquoi « délai vérifiable » ?',
    'what.d1.caption': 'Le temps d’évaluation est réglable (difficulté). La vérification reste peu coûteuse.',
    'what.d1.chart': 'Coût relatif (échelle log., illustratif)',
    'what.d1.solve': 'solve',
    'what.d1.solveUnit': 'secondes–minutes',
    'what.d1.verify': 'verify',
    'what.d1.verifyUnit': 'millisecondes',
    'what.d1.cost': 'coût',
    'what.d1.legendSolve': 'Solve — goulot intentionnel',
    'what.d1.legendVerify': 'Verify — contrôle efficace',
    'what.d2.title': 'La parallélisation n’aide pas',
    'what.d2.caption': 'Équité : on ne raccourcit pas le délai en ajoutant des GPU.',
    'what.d2.chart': '1 CPU vs plusieurs (même chaîne VDF)',
    'what.d2.oneCore': '1 cœur',
    'what.d2.tDelay': 'délai T',
    'what.d2.nCores': 'N cœurs',
    'what.d2.chain': 'une seule chaîne séquentielle → même T',
    'what.d2.same': '✓ même délai minimum',
    'apps.label': 'Cas d’usage',
    'apps.title': 'Où utilise-t-on les VDF ?',
    'apps.intro':
      'Les protocoles ont besoin que le temps passe—ou d’aléa imprévisible à l’avance. Les VDF ancrent cela en cryptographie.',
    'apps.beacon.title': 'Balise d’aléa (simplifié)',
    'apps.beacon.caption':
      'Tous s’accordent sur la sortie après le délai—les arrivées tardives ne biaisent pas les tours précédents.',
    'apps.svg.round': 'Entrée du tour',
    'apps.svg.seed': 'hash bloc + graine',
    'apps.svg.vdfDelay': 'Délai VDF',
    'apps.svg.solveRace': 'course solve publique',
    'apps.svg.proofPi': 'Preuve π',
    'apps.svg.fastVerify': 'Verify rapide',
    'apps.svg.random': 'Aléa',
    'apps.svg.output': 'sortie',
    'apps.c1.title': 'Balises d’aléa',
    'apps.c1.text': 'Aléa public non biaisé pour tirages, élection de leader et consensus après un délai public.',
    'apps.c2.title': 'Blockchain et consensus',
    'apps.c2.text': 'Preuve de temps et délai dans l’élection de leader—moins d’avantage du hashrate seul.',
    'apps.c3.title': 'Puzzles à verrouillage temporel',
    'apps.c3.text': 'Données utilisables seulement après un délai vérifiable—escrow, libération programmée.',
    'apps.c4.title': 'Anti front-running',
    'apps.c4.text': 'Révéler les transactions après un délai—personne ne devance le calendrier fixé.',
    'demo.label': 'Essayez dans votre navigateur',
    'demo.title': 'Démo en direct — vrai code crypto-vdf',
    'demo.intro':
      'Même <strong>bundle navigateur</strong> que sur npm. Défi public, <code>solve()</code> sur votre CPU, puis <code>verify()</code> quasi instantané.',
    'demo.exp.title': 'Votre expérience',
    'demo.challenge.label': 'Défi (octets hex)',
    'demo.challenge.hint': 'Entrée publique <em>x</em> — visible avant la fin du délai.',
    'demo.random.title': 'Défi aléatoire',
    'demo.scheme.label': 'Schéma VDF',
    'demo.scheme.weso': 'Wesolowski (recommandé)',
    'demo.scheme.piet': 'Pietrzak',
    'demo.bits.label': 'Taille de sécurité (discriminant)',
    'demo.bits.256': '256 bits (plus rapide)',
    'demo.bits.512': '512 bits (solve plus lourd)',
    'demo.diff.label': 'Difficulté (itérations)',
    'demo.diff.hint': 'Plus de difficulté = <code>solve()</code> plus long ; <code>verify()</code> reste rapide.',
    'demo.run': '▶ Lancer la démo',
    'demo.codeLabel': 'Code exécuté',
    'demo.steps.title': 'Étape par étape',
    'demo.s1.title': 'Défi',
    'demo.s1.text': 'Convertir la chaîne hex en <code>Uint8Array</code>.',
    'demo.s2.title': 'Configuration',
    'demo.s2.text': 'Schéma + discriminant précalculé.',
    'demo.s3.title': 'solve()',
    'demo.s3.text': 'Travail séquentiel—pas raccourci avec plus de cœurs.',
    'demo.s4.title': 'Preuve π',
    'demo.s4.text': 'Certificat compact du calcul.',
    'demo.s5.title': 'verify()',
    'demo.s5.text': 'Tous valident π sans refaire le délai.',
    'demo.s6.title': 'Terminé',
    'demo.s6.text': 'Sortie fiable—le délai s’est bien écoulé.',
    'demo.logLabel': 'Journal d’activité',
    'lib.label': 'crypto-vdf',
    'lib.title': 'Cette bibliothèque',
    'lib.intro':
      'Implémentations TypeScript des VDF <strong>Pietrzak</strong> et <strong>Wesolowski</strong>, discriminants précalculés (256–2048 bits), ESM/CJS Node et bundle navigateur.',
    'lib.c1.title': 'Wesolowski (recommandé)',
    'lib.c1.text': 'Toute difficulté positive, preuves plus petites, verify rapide. Choix par défaut en production.',
    'lib.c2.title': 'Pietrzak',
    'lib.c2.text': 'Difficulté paire ≥ 66, max 7000 dans ce port JS. Preuves compactes à basse difficulté.',
    'lib.c3.title': 'D précalculé',
    'lib.c3.text': 'Discriminants via Rust GMP—ne pas générer en JS pur en production.',
    'lib.note':
      '<strong>Production :</strong> utilisez <code>DISCRIMINANT_*</code> et Wesolowski sauf raison spécifique pour Pietrzak.',
    'start.label': 'Développeurs',
    'start.title': 'Démarrage rapide',
    'start.api': 'Documentation API',
    'start.npm': 'npm',
    'start.research': 'Recherche VDF',
    'footer.license': 'Apache-2.0',
    'lang.label': 'Langue',
  },
  es: {
    'meta.title': 'crypto-vdf — Funciones de retraso verificable para JavaScript',
    'meta.description':
      'crypto-vdf — VDF en JavaScript. Aprende qué son las VDF, prueba la demo en vivo: Pietrzak y Wesolowski en Node.js y navegador.',
    'nav.what': '¿Qué es una VDF?',
    'nav.apps': 'Aplicaciones',
    'nav.demo': 'Demo en vivo',
    'nav.library': 'Biblioteca',
    'nav.start': 'Inicio rápido',
    'nav.api': 'API',
    'nav.github': 'GitHub',
    'nav.npm': 'npm install',
    'hero.label': 'Criptografía de prueba de tiempo',
    'hero.title': 'Tiempo que puedes probar.<br />Verificación para cualquiera.',
    'hero.lead':
      'Una <strong>función de retraso verificable</strong> exige cómputo secuencial para obtener una salida y la prueba en milisegundos. Para Node.js y navegadores, en TypeScript.',
    'hero.cta.start': 'Empezar',
    'hero.cta.api': 'Referencia API',
    'hero.diagram.aria': 'Diagrama: reto, solve lento, prueba, verify rápido, salida aceptada',
    'svg.pipeline': 'Pipeline de evaluación VDF',
    'svg.challenge': 'Reto',
    'svg.solve': 'solve()',
    'svg.sequential': 'trabajo secuencial',
    'svg.cannotParallel': 'no paralelizable',
    'svg.proof': 'Prueba',
    'svg.verify': 'verify()',
    'svg.fast': 'rápido ✓',
    'svg.solveTime': 'tiempo solve',
    'svg.verifyTime': 'tiempo verify',
    'what.label': 'Concepto',
    'what.title': '¿Qué es una función de retraso verificable?',
    'what.intro':
      'Una VDF es <em>y = f(x)</em>: tarda un tiempo real en calcularse (aunque uses muchas CPU), pero cualquiera comprueba <em>y</em> en una fracción de segundo con una prueba compacta. La brecha entre <strong>evaluación lenta</strong> y <strong>verificación rápida</strong> es la clave.',
    'what.card1.title': 'Retraso secuencial',
    'what.card1.text': 'Cada paso depende del anterior. Más núcleos no acorta el retraso.',
    'what.card2.title': 'Prueba compacta',
    'what.card2.text': 'El prover emite una prueba π sin repetir todo el trabajo.',
    'what.card3.title': 'Verificación pública',
    'what.card3.text': 'Validadores, contratos o clientes verifican rápido—sin confiar en el hardware del prover.',
    'what.d1.title': '¿Por qué «retraso verificable»?',
    'what.d1.caption': 'El tiempo de evaluación es ajustable (dificultad). La verificación sigue siendo barata.',
    'what.d1.chart': 'Coste relativo (escala log., ilustrativo)',
    'what.d1.solve': 'solve',
    'what.d1.solveUnit': 'segundos–minutos',
    'what.d1.verify': 'verify',
    'what.d1.verifyUnit': 'milisegundos',
    'what.d1.cost': 'coste',
    'what.d1.legendSolve': 'Solve — cuello de botella intencional',
    'what.d1.legendVerify': 'Verify — comprobación eficiente',
    'what.d2.title': 'Más máquinas, mismo retraso',
    'what.d2.caption': 'Equidad: no se compra un retraso menor solo con más GPU.',
    'what.d2.chart': '1 CPU vs muchas (misma cadena VDF)',
    'what.d2.oneCore': '1 núcleo',
    'what.d2.tDelay': 'retraso T',
    'what.d2.nCores': 'N núcleos',
    'what.d2.chain': 'una cadena secuencial → mismo T',
    'what.d2.same': '✓ mismo retraso mínimo',
    'apps.label': 'Casos de uso',
    'apps.title': 'Dónde se usan las VDF',
    'apps.intro':
      'Los protocolos necesitan que pase el tiempo—o aleatoriedad impredecible antes. Las VDF lo anclan con criptografía.',
    'apps.beacon.title': 'Baliza de aleatoriedad (simplificado)',
    'apps.beacon.caption':
      'Todos acuerdan la salida tras el retraso—quien llega tarde no sesga rondas anteriores.',
    'apps.svg.round': 'Entrada de ronda',
    'apps.svg.seed': 'hash de bloque + semilla',
    'apps.svg.vdfDelay': 'Retraso VDF',
    'apps.svg.solveRace': 'carrera solve pública',
    'apps.svg.proofPi': 'Prueba π',
    'apps.svg.fastVerify': 'Verify rápido',
    'apps.svg.random': 'Aleatorio',
    'apps.svg.output': 'salida',
    'apps.c1.title': 'Balizas de aleatoriedad',
    'apps.c1.text': 'Aleatoriedad pública imparcial para loterías, líderes y consenso tras un retraso público.',
    'apps.c2.title': 'Blockchain y consenso',
    'apps.c2.text': 'Prueba de tiempo y retraso en elección de líder—menos ventaja solo por hashrate.',
    'apps.c3.title': 'Puzzles de time-lock',
    'apps.c3.text': 'Datos usables solo tras una espera verificable—útil en escrow y liberación programada.',
    'apps.c4.title': 'Anti front-running',
    'apps.c4.text': 'Revelar transacciones tras un retraso—nadie adelanta el calendario acordado.',
    'demo.label': 'Pruébalo en el navegador',
    'demo.title': 'Demo en vivo — código crypto-vdf real',
    'demo.intro':
      'El mismo <strong>bundle del navegador</strong> de npm. Reto público, <code>solve()</code> en tu CPU, luego <code>verify()</code> al instante.',
    'demo.exp.title': 'Tu experimento',
    'demo.challenge.label': 'Reto (bytes hex)',
    'demo.challenge.hint': 'Entrada pública <em>x</em> — visible antes de que termine el retraso.',
    'demo.random.title': 'Reto aleatorio',
    'demo.scheme.label': 'Esquema VDF',
    'demo.scheme.weso': 'Wesolowski (recomendado)',
    'demo.scheme.piet': 'Pietrzak',
    'demo.bits.label': 'Tamaño de seguridad (discriminante)',
    'demo.bits.256': '256 bits (más rápido)',
    'demo.bits.512': '512 bits (solve más pesado)',
    'demo.diff.label': 'Dificultad (iteraciones)',
    'demo.diff.hint': 'Más dificultad = <code>solve()</code> más largo; <code>verify()</code> sigue siendo rápido.',
    'demo.run': '▶ Ejecutar demo',
    'demo.codeLabel': 'Código ejecutado',
    'demo.steps.title': 'Paso a paso',
    'demo.s1.title': 'Reto',
    'demo.s1.text': 'Convierte el hex en <code>Uint8Array</code>.',
    'demo.s2.title': 'Configuración',
    'demo.s2.text': 'Esquema + discriminante precalculado.',
    'demo.s3.title': 'solve()',
    'demo.s3.text': 'Trabajo secuencial—no se acorta con más núcleos.',
    'demo.s4.title': 'Prueba π',
    'demo.s4.text': 'Certificado compacto del cálculo.',
    'demo.s5.title': 'verify()',
    'demo.s5.text': 'Cualquiera valida π sin repetir el retraso.',
    'demo.s6.title': 'Listo',
    'demo.s6.text': 'Salida fiable—el retraso realmente pasó.',
    'demo.logLabel': 'Registro de actividad',
    'lib.label': 'crypto-vdf',
    'lib.title': 'Esta biblioteca',
    'lib.intro':
      'Implementaciones TypeScript de VDF <strong>Pietrzak</strong> y <strong>Wesolowski</strong>, discriminantes precalculados (256–2048 bits), ESM/CJS en Node y bundle para navegador.',
    'lib.c1.title': 'Wesolowski (recomendado)',
    'lib.c1.text': 'Cualquier dificultad positiva, pruebas más pequeñas, verify rápido. Opción por defecto en producción.',
    'lib.c2.title': 'Pietrzak',
    'lib.c2.text': 'Dificultad par ≥ 66, máx. 7000 en este port JS. Pruebas compactas a baja dificultad.',
    'lib.c3.title': 'D precalculado',
    'lib.c3.text': 'Discriminantes con Rust GMP—no generar en JS puro en producción.',
    'lib.note':
      '<strong>Producción:</strong> usa <code>DISCRIMINANT_*</code> y Wesolowski salvo razón específica para Pietrzak.',
    'start.label': 'Desarrolladores',
    'start.title': 'Inicio rápido',
    'start.api': 'Documentación API',
    'start.npm': 'npm',
    'start.research': 'Investigación VDF',
    'footer.license': 'Apache-2.0',
    'lang.label': 'Idioma',
  },
  ja: {
    'meta.title': 'crypto-vdf — JavaScript 向け検証可能遅延関数（VDF）',
    'meta.description':
      'crypto-vdf — JavaScript の VDF ライブラリ。VDF の解説、ライブデモ、Pietrzak と Wesolowski を Node.js とブラウザで。',
    'nav.what': 'VDF とは',
    'nav.apps': '用途',
    'nav.demo': 'ライブデモ',
    'nav.library': 'ライブラリ',
    'nav.start': 'クイックスタート',
    'nav.api': 'API',
    'nav.github': 'GitHub',
    'nav.npm': 'npm install',
    'hero.label': '証明可能な時間の暗号',
    'hero.title': '証明できる時間。<br />誰でも検証できる。',
    'hero.lead':
      '<strong>検証可能遅延関数（VDF）</strong>は順次計算で出力を得て、ミリ秒単位で証明します。TypeScript で Node.js とブラウザに対応。',
    'hero.cta.start': 'はじめる',
    'hero.cta.api': 'API リファレンス',
    'hero.diagram.aria': '図：チャレンジ、遅い solve、証明、速い verify、受理された出力',
    'svg.pipeline': 'VDF 評価パイプライン',
    'svg.challenge': 'チャレンジ',
    'svg.solve': 'solve()',
    'svg.sequential': '順次処理',
    'svg.cannotParallel': '並列化不可',
    'svg.proof': '証明',
    'svg.verify': 'verify()',
    'svg.fast': '高速 ✓',
    'svg.solveTime': 'solve 時間',
    'svg.verifyTime': 'verify 時間',
    'what.label': '概念',
    'what.title': '検証可能遅延関数（VDF）とは',
    'what.intro':
      'VDF は <em>y = f(x)</em> で、計算には現実時間がかかります（CPU を増やしても短縮できません）が、<em>y</em> は短い証明で一瞬で検証できます。<strong>遅い評価</strong>と<strong>速い検証</strong>の差が本質です。',
    'what.card1.title': '順次遅延',
    'what.card1.text': '各ステップは前に依存します。コアを増やしても遅延は短くなりません。',
    'what.card2.title': 'コンパクトな証明',
    'what.card2.text': '証明者は証明 π を出力し、計算をやり直す必要はありません。',
    'what.card3.title': '公開検証',
    'what.card3.text': '検証者・コントラクト・クライアントが素早く正しさを確認—証明者の機器を信頼する必要はありません。',
    'what.d1.title': 'なぜ「検証可能な遅延」か',
    'what.d1.caption': '評価時間は難易度で調整。検証は常に安価です。',
    'what.d1.chart': '相対コスト（対数スケール・示意）',
    'what.d1.solve': 'solve',
    'what.d1.solveUnit': '秒〜分',
    'what.d1.verify': 'verify',
    'what.d1.verifyUnit': 'ミリ秒',
    'what.d1.cost': 'コスト',
    'what.d1.legendSolve': 'Solve — 意図的なボトルネック',
    'what.d1.legendVerify': 'Verify — 効率的な検証',
    'what.d2.title': '並列でも待つ',
    'what.d2.caption': '公平性：GPU を増やしても遅延は短くなりません。',
    'what.d2.chart': '1 CPU と多数 CPU（同一 VDF チェーン）',
    'what.d2.oneCore': '1 コア',
    'what.d2.tDelay': '遅延 T',
    'what.d2.nCores': 'N コア',
    'what.d2.chain': '1 本の順次チェーン → 同じ T',
    'what.d2.same': '✓ 同じ最小遅延',
    'apps.label': 'ユースケース',
    'apps.title': 'VDF の利用場面',
    'apps.intro': 'プロトコルには時間の経過、または事前に予測できない乱数が必要です。VDF はそれを暗号で固定します。',
    'apps.beacon.title': '乱数ビーコン（簡略）',
    'apps.beacon.caption': '遅延後にのみ出力に合意—遅れて参加しても過去のラウンドを歪められません。',
    'apps.svg.round': 'ラウンド入力',
    'apps.svg.seed': 'ブロックハッシュ + シード',
    'apps.svg.vdfDelay': 'VDF 遅延',
    'apps.svg.solveRace': '公開 solve 競争',
    'apps.svg.proofPi': '証明 π',
    'apps.svg.fastVerify': '高速 verify',
    'apps.svg.random': '乱数',
    'apps.svg.output': '出力',
    'apps.c1.title': '乱数ビーコン',
    'apps.c1.text': '抽選・リーダー選出・コンセンサス向けの偏りのない公開乱数（公開遅延の後）。',
    'apps.c2.title': 'ブロックチェーンとコンセンサス',
    'apps.c2.text': 'リーダー選出での証明可能な時間遅延—ハッシュレートだけの優位を抑える設計も。',
    'apps.c3.title': 'タイムロックパズル',
    'apps.c3.text': '検証可能な待ち時間の後にのみ使えるデータ—エスクローや時間解放に。',
    'apps.c4.title': 'フロントランニング対策',
    'apps.c4.text': '遅延後に取引を公開—合意スケジュールより先に動けません。',
    'demo.label': 'ブラウザで試す',
    'demo.title': 'ライブデモ — 本物の crypto-vdf',
    'demo.intro':
      'npm と同じ<strong>ブラウザバンドル</strong>です。公開チャレンジ、CPU で <code>solve()</code>、すぐ <code>verify()</code>。',
    'demo.exp.title': 'あなたの実験',
    'demo.challenge.label': 'チャレンジ（hex バイト）',
    'demo.challenge.hint': '公開入力 <em>x</em> — 遅延が終わる前から誰でも見られます。',
    'demo.random.title': 'ランダムチャレンジ',
    'demo.scheme.label': 'VDF 方式',
    'demo.scheme.weso': 'Wesolowski（推奨）',
    'demo.scheme.piet': 'Pietrzak',
    'demo.bits.label': 'セキュリティサイズ（判別式）',
    'demo.bits.256': '256 ビット（速い）',
    'demo.bits.512': '512 ビット（重い solve）',
    'demo.diff.label': '難易度（反復回数）',
    'demo.diff.hint': '難易度↑ = <code>solve()</code> が長く；<code>verify()</code> はほぼ瞬時。',
    'demo.run': '▶ デモを実行',
    'demo.codeLabel': '実行中のコード',
    'demo.steps.title': 'ステップごとの流れ',
    'demo.s1.title': 'チャレンジ',
    'demo.s1.text': 'hex 文字列を <code>Uint8Array</code> に変換。',
    'demo.s2.title': 'セットアップ',
    'demo.s2.text': '方式選択 + 事前計算判別式の読み込み。',
    'demo.s3.title': 'solve()',
    'demo.s3.text': '順次処理—コアを増やしても短縮不可。',
    'demo.s4.title': '証明 π',
    'demo.s4.text': '計算のコンパクトな証明書。',
    'demo.s5.title': 'verify()',
    'demo.s5.text': '誰でも遅延を繰り返さず π を検証。',
    'demo.s6.title': '完了',
    'demo.s6.text': '出力は信頼できる—遅延は本当に経過した。',
    'demo.logLabel': 'アクティビティログ',
    'lib.label': 'crypto-vdf',
    'lib.title': 'このライブラリ',
    'lib.intro':
      'TypeScript 実装の <strong>Pietrzak</strong> と <strong>Wesolowski</strong> VDF。事前計算判別式（256〜2048 ビット）、Node ESM/CJS、ブラウザバンドル。',
    'lib.c1.title': 'Wesolowski（推奨）',
    'lib.c1.text': '任意の正の難易度、小さな証明、高速 verify。本番の既定。',
    'lib.c2.title': 'Pietrzak',
    'lib.c2.text': '偶数難易度 ≥ 66、この JS 版は最大 7000。低難易度でコンパクトな証明。',
    'lib.c3.title': '事前計算 D',
    'lib.c3.text': 'Rust GMP で生成—本番では純 JS 生成は非推奨。',
    'lib.note':
      '<strong>本番:</strong> <code>DISCRIMINANT_*</code> と Wesolowski を使用（Pietrzak は特別な理由がある場合のみ）。',
    'start.label': '開発者向け',
    'start.title': 'クイックスタート',
    'start.api': 'API ドキュメント',
    'start.npm': 'npm',
    'start.research': 'VDF 研究',
    'footer.license': 'Apache-2.0',
    'lang.label': '言語',
  },
};

Object.assign(window.SITE_LOCALES.en, {
  'demo.diff.w2048': '2,048 — moderate (~0.3–1s solve)',
  'demo.diff.w5000': '5,000 — clear gap (~1–3s solve)',
  'demo.diff.w8000': '8,000 — recommended demo (~2–5s solve)',
  'demo.diff.w10000': '10,000 — max delay (~3–8s solve)',
  'demo.diff.w4096': '4,096 — recommended (~3–10s solve)',
  'demo.diff.w6000': '6,000 — heavy (~5–15s solve)',
  'demo.diff.p2048': '2,048 — moderate (even)',
  'demo.diff.p5000': '5,000 — clear gap (even)',
  'demo.diff.p7000': '7,000 — max for Pietrzak in JS',
  'demo.diff.p4096': '4,096 — recommended (even)',
  'demo.diff.p6000': '6,000 — heavy (even)',
  'demo.ready': 'Ready. Choose options and click “Run live demo”.',
  'demo.compareCap':
    'Same proof on any machine — verify stays cheap; solve sets the delay.',
  'demo.solveBar': 'solve {ms} ms',
  'demo.verifyBar': 'verify {ms} ms',
  'demo.running': 'running…',
  'demo.slowPath': '{ms} ms (slow path)',
  'demo.fastPath': '{ms} ms (fast path)',
  'demo.valid': 'Valid ✓ · verify ~{ratio}× faster',
  'demo.libMissing': 'Library not loaded. Run npm run website:build and reload.',
});

/* Fill FR/ES/JA demo difficulty strings */
window.SITE_LOCALES.fr['demo.diff.w2048'] = '2 048 — délai modéré (~0,3–1s solve)';
window.SITE_LOCALES.fr['demo.diff.w5000'] = '5 000 — écart net (~1–3s solve)';
window.SITE_LOCALES.fr['demo.diff.w8000'] = '8 000 — démo recommandée (~2–5s solve)';
window.SITE_LOCALES.fr['demo.diff.w10000'] = '10 000 — délai max (~3–8s solve)';
window.SITE_LOCALES.fr['demo.diff.w4096'] = '4 096 — recommandé (~3–10s solve)';
window.SITE_LOCALES.fr['demo.diff.w6000'] = '6 000 — lourd (~5–15s solve)';
window.SITE_LOCALES.fr['demo.diff.p2048'] = '2 048 — modéré (pair)';
window.SITE_LOCALES.fr['demo.diff.p5000'] = '5 000 — écart net (pair)';
window.SITE_LOCALES.fr['demo.diff.p7000'] = '7 000 — max Pietrzak JS';
window.SITE_LOCALES.fr['demo.diff.p4096'] = '4 096 — recommandé (pair)';
window.SITE_LOCALES.fr['demo.diff.p6000'] = '6 000 — lourd (pair)';
window.SITE_LOCALES.fr['demo.ready'] = 'Prêt. Choisissez les options et cliquez « Lancer la démo ».';
window.SITE_LOCALES.fr['demo.compareCap'] =
  'Même preuve partout — verify reste peu coûteux ; solve fixe le délai.';
window.SITE_LOCALES.fr['demo.solveBar'] = 'solve {ms} ms';
window.SITE_LOCALES.fr['demo.verifyBar'] = 'verify {ms} ms';
window.SITE_LOCALES.fr['demo.running'] = 'en cours…';
window.SITE_LOCALES.fr['demo.slowPath'] = '{ms} ms (lent)';
window.SITE_LOCALES.fr['demo.fastPath'] = '{ms} ms (rapide)';
window.SITE_LOCALES.fr['demo.valid'] = 'Valide ✓ · verify ~{ratio}× plus rapide';
window.SITE_LOCALES.fr['demo.libMissing'] =
  'Bibliothèque non chargée. Exécutez npm run website:build et rechargez.';

window.SITE_LOCALES.es['demo.diff.w2048'] = '2.048 — retraso moderado (~0,3–1s solve)';
window.SITE_LOCALES.es['demo.diff.w5000'] = '5.000 — brecha clara (~1–3s solve)';
window.SITE_LOCALES.es['demo.diff.w8000'] = '8.000 — demo recomendada (~2–5s solve)';
window.SITE_LOCALES.es['demo.diff.w10000'] = '10.000 — retraso máximo (~3–8s solve)';
window.SITE_LOCALES.es['demo.diff.w4096'] = '4.096 — recomendado (~3–10s solve)';
window.SITE_LOCALES.es['demo.diff.w6000'] = '6.000 — pesado (~5–15s solve)';
window.SITE_LOCALES.es['demo.diff.p2048'] = '2.048 — moderado (par)';
window.SITE_LOCALES.es['demo.diff.p5000'] = '5.000 — brecha clara (par)';
window.SITE_LOCALES.es['demo.diff.p7000'] = '7.000 — máx. Pietrzak JS';
window.SITE_LOCALES.es['demo.diff.p4096'] = '4.096 — recomendado (par)';
window.SITE_LOCALES.es['demo.diff.p6000'] = '6.000 — pesado (par)';
window.SITE_LOCALES.es['demo.ready'] = 'Listo. Elige opciones y pulsa « Ejecutar demo ».';
window.SITE_LOCALES.es['demo.compareCap'] =
  'La misma prueba en cualquier máquina — verify barato; solve marca el retraso.';
window.SITE_LOCALES.es['demo.solveBar'] = 'solve {ms} ms';
window.SITE_LOCALES.es['demo.verifyBar'] = 'verify {ms} ms';
window.SITE_LOCALES.es['demo.running'] = 'ejecutando…';
window.SITE_LOCALES.es['demo.slowPath'] = '{ms} ms (lento)';
window.SITE_LOCALES.es['demo.fastPath'] = '{ms} ms (rápido)';
window.SITE_LOCALES.es['demo.valid'] = 'Válido ✓ · verify ~{ratio}× más rápido';
window.SITE_LOCALES.es['demo.libMissing'] =
  'Biblioteca no cargada. Ejecuta npm run website:build y recarga.';

window.SITE_LOCALES.ja['demo.diff.w2048'] = '2,048 — 中程度（solve 約0.3–1秒）';
window.SITE_LOCALES.ja['demo.diff.w5000'] = '5,000 — はっきりした差（solve 約1–3秒）';
window.SITE_LOCALES.ja['demo.diff.w8000'] = '8,000 — 推奨デモ（solve 約2–5秒）';
window.SITE_LOCALES.ja['demo.diff.w10000'] = '10,000 — 最大遅延（256ビット）';
window.SITE_LOCALES.ja['demo.diff.w4096'] = '4,096 — 推奨（solve 約3–10秒）';
window.SITE_LOCALES.ja['demo.diff.w6000'] = '6,000 — 重い（solve 約5–15秒）';
window.SITE_LOCALES.ja['demo.diff.p2048'] = '2,048 — 中程度（偶数）';
window.SITE_LOCALES.ja['demo.diff.p5000'] = '5,000 — はっきりした差（偶数）';
window.SITE_LOCALES.ja['demo.diff.p7000'] = '7,000 — JS版 Pietrzak 上限';
window.SITE_LOCALES.ja['demo.diff.p4096'] = '4,096 — 推奨（偶数）';
window.SITE_LOCALES.ja['demo.diff.p6000'] = '6,000 — 重い（偶数）';
window.SITE_LOCALES.ja['demo.ready'] = '準備完了。オプションを選び「デモを実行」をクリック。';
window.SITE_LOCALES.ja['demo.compareCap'] =
  '同じ証明をどこでも—verify は安価、solve が遅延を決める。';
window.SITE_LOCALES.ja['demo.solveBar'] = 'solve {ms} ms';
window.SITE_LOCALES.ja['demo.verifyBar'] = 'verify {ms} ms';
window.SITE_LOCALES.ja['demo.running'] = '実行中…';
window.SITE_LOCALES.ja['demo.slowPath'] = '{ms} ms（遅い）';
window.SITE_LOCALES.ja['demo.fastPath'] = '{ms} ms（速い）';
window.SITE_LOCALES.ja['demo.valid'] = '有効 ✓ · verify は約 {ratio} 倍速い';
window.SITE_LOCALES.ja['demo.libMissing'] =
  'ライブラリ未読込。npm run website:build 後に再読込してください。';

/* EN demo log strings */
Object.assign(window.SITE_LOCALES.en, {
  'demo.log.s1': 'Step 1 — Build the challenge (public input x).',
  'demo.log.s2': 'Step 2 — Configure {scheme} VDF, {bits}-bit discriminant, difficulty {diff}.',
  'demo.log.s3a': 'Step 3 — solve(): sequential squaring (this is the intentional delay).',
  'demo.log.s3b': 'The UI may freeze briefly — real VDF work on CPU, not the network.',
  'demo.log.s3done': 'solve() finished in {ms} ms.',
  'demo.log.s4': 'Step 4 — Proof π received ({bytes} bytes).',
  'demo.log.s5a': 'Step 5 — verify(): check π without redoing the delay.',
  'demo.log.s5done': 'verify() finished in {ms} ms.',
  'demo.log.s6': 'Step 6 — Success. solve {solve} ms vs verify {verify} ms (~{ratio}× faster verification).',
  'demo.log.tip': 'Tip: pick a higher difficulty or 512-bit size to widen the gap on this device.',
  'demo.err.hex': 'Challenge must be even-length hexadecimal (e.g. aabbcc).',
  'demo.err.empty': 'Challenge cannot be empty.',
  'demo.err.pietrzak': 'Pietrzak requires an even difficulty.',
});

window.SITE_LOCALES.fr['demo.log.s1'] = 'Étape 1 — Construire le défi (entrée publique x).';
window.SITE_LOCALES.fr['demo.log.s2'] =
  'Étape 2 — Configurer VDF {scheme}, discriminant {bits} bits, difficulté {diff}.';
window.SITE_LOCALES.fr['demo.log.s3a'] =
  'Étape 3 — solve() : carrés séquentiels (c’est le délai intentionnel).';
window.SITE_LOCALES.fr['demo.log.s3b'] =
  'L’interface peut geler un instant — calcul VDF réel sur le CPU, pas le réseau.';
window.SITE_LOCALES.fr['demo.log.s3done'] = 'solve() terminé en {ms} ms.';
window.SITE_LOCALES.fr['demo.log.s4'] = 'Étape 4 — Preuve π reçue ({bytes} octets).';
window.SITE_LOCALES.fr['demo.log.s5a'] =
  'Étape 5 — verify() : vérifier π sans refaire le délai.';
window.SITE_LOCALES.fr['demo.log.s5done'] = 'verify() terminé en {ms} ms.';
window.SITE_LOCALES.fr['demo.log.s6'] =
  'Étape 6 — Succès. solve {solve} ms vs verify {verify} ms (~{ratio}× plus rapide).';
window.SITE_LOCALES.fr['demo.log.tip'] =
  'Astuce : augmentez la difficulté ou passez en 512 bits pour mieux voir l’écart sur cet appareil.';
window.SITE_LOCALES.fr['demo.err.hex'] = 'Le défi doit être hexadécimal de longueur paire (ex. aabbcc).';
window.SITE_LOCALES.fr['demo.err.empty'] = 'Le défi ne peut pas être vide.';
window.SITE_LOCALES.fr['demo.err.pietrzak'] = 'Pietrzak exige une difficulté paire.';

window.SITE_LOCALES.es['demo.log.s1'] = 'Paso 1 — Crear el reto (entrada pública x).';
window.SITE_LOCALES.es['demo.log.s2'] =
  'Paso 2 — Configurar VDF {scheme}, discriminante {bits} bits, dificultad {diff}.';
window.SITE_LOCALES.es['demo.log.s3a'] = 'Paso 3 — solve(): cuadrados secuenciales (el retraso intencional).';
window.SITE_LOCALES.es['demo.log.s3b'] =
  'La UI puede congelarse un momento — trabajo VDF real en CPU, no en la red.';
window.SITE_LOCALES.es['demo.log.s3done'] = 'solve() terminó en {ms} ms.';
window.SITE_LOCALES.es['demo.log.s4'] = 'Paso 4 — Prueba π recibida ({bytes} bytes).';
window.SITE_LOCALES.es['demo.log.s5a'] = 'Paso 5 — verify(): comprobar π sin repetir el retraso.';
window.SITE_LOCALES.es['demo.log.s5done'] = 'verify() terminó en {ms} ms.';
window.SITE_LOCALES.es['demo.log.s6'] =
  'Paso 6 — Éxito. solve {solve} ms vs verify {verify} ms (~{ratio}× más rápido).';
window.SITE_LOCALES.es['demo.log.tip'] =
  'Consejo: sube la dificultad o usa 512 bits para ver mejor la brecha en este dispositivo.';
window.SITE_LOCALES.es['demo.err.hex'] = 'El reto debe ser hexadecimal de longitud par (ej. aabbcc).';
window.SITE_LOCALES.es['demo.err.empty'] = 'El reto no puede estar vacío.';
window.SITE_LOCALES.es['demo.err.pietrzak'] = 'Pietrzak requiere dificultad par.';

window.SITE_LOCALES.ja['demo.log.s1'] = 'ステップ 1 — チャレンジを構築（公開入力 x）。';
window.SITE_LOCALES.ja['demo.log.s2'] =
  'ステップ 2 — {scheme} VDF、{bits} ビット判別式、難易度 {diff} を設定。';
window.SITE_LOCALES.ja['demo.log.s3a'] = 'ステップ 3 — solve()：順次平方（意図的な遅延）。';
window.SITE_LOCALES.ja['demo.log.s3b'] = 'UI が一瞬止まることがあります — ネットではなく CPU で VDF を実行中。';
window.SITE_LOCALES.ja['demo.log.s3done'] = 'solve() が {ms} ms で完了。';
window.SITE_LOCALES.ja['demo.log.s4'] = 'ステップ 4 — 証明 π を受信（{bytes} バイト）。';
window.SITE_LOCALES.ja['demo.log.s5a'] = 'ステップ 5 — verify()：遅延を繰り返さず π を検証。';
window.SITE_LOCALES.ja['demo.log.s5done'] = 'verify() が {ms} ms で完了。';
window.SITE_LOCALES.ja['demo.log.s6'] =
  'ステップ 6 — 成功。solve {solve} ms、verify {verify} ms（検証は約 {ratio} 倍速い）。';
window.SITE_LOCALES.ja['demo.log.tip'] =
  'ヒント：難易度を上げるか 512 ビットにすると、この端末で差が分かりやすくなります。';
window.SITE_LOCALES.ja['demo.err.hex'] = 'チャレンジは偶数長の16進である必要があります（例: aabbcc）。';
window.SITE_LOCALES.ja['demo.err.empty'] = 'チャレンジは空にできません。';
window.SITE_LOCALES.ja['demo.err.pietrzak'] = 'Pietrzak は偶数の難易度が必要です。';
