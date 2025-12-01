/* ============================================================
   ====================  LISTE DES QUESTIONS  ==================
   ============================================================ */

const questions = [
  {
    question: "1. Lors d’un changement d’état, la température d’un corps pur :",
    options: ["augmente", "diminue", "reste constante", "varie selon la masse"],
    bonne_reponse: "reste constante",
    explication: "Pendant la fusion ou la solidification, l’énergie sert à changer l’état, pas à augmenter la température."
  },
  {
    question: "2. La chaleur correspond à :",
    options: ["une température élevée", "un transfert d’énergie", "une masse importante", "une couleur rouge"],
    bonne_reponse: "un transfert d’énergie",
    explication: "La chaleur est un transfert d’énergie d’un corps chaud vers un corps froid."
  },
  {
    question: "3. Quelle est l’unité de l’énergie thermique Q ?",
    options: ["le Watt", "le Joule", "le Kelvin", "le Volt"],
    bonne_reponse: "le Joule",
    explication: "Q se mesure en Joule (J)."
  },
  {
    question: "4. Dans un calorimètre, les échanges de chaleur avec l’extérieur :",
    options: ["sont importants", "sont négligeables", "dépendent du métal", "raffraichissent l’eau"],
    bonne_reponse: "sont négligeables",
    explication: "Un calorimètre limite les pertes."
  },
  {
    question: "5. Ajouter 10 g de glace à 20°C dans 250 mL d’eau à 20°C :",
    options: ["réchauffe l’eau", "refroidit légèrement l’eau", "ne change rien", "fait bouillir l’eau"],
    bonne_reponse: "refroidit légèrement l’eau",
    explication: "La glace absorbe de l’énergie pour fondre → l’eau se refroidit."
  },
  {
    question: "6. Lors de la fusion de la glace, l’énergie fournie sert à :",
    options: ["augmenter la température", "changer l’état", "réduire la masse", "faire bouillir l’eau"],
    bonne_reponse: "changer l’état",
    explication: "Pendant la fusion, l’énergie sert uniquement à casser les liaisons solides."
  },
  {
    question: "7. La température finale dans un calorimètre après ajout de glace dépend principalement :",
    options: ["du volume de glace", "de la couleur du calorimètre", "du bruit ambiant", "de la forme du glaçon"],
    bonne_reponse: "du volume de glace",
    explication: "Plus il y a de glace, plus il faut d’énergie pour la faire fondre."
  },
  {
    question: "8. Quel phénomène se produit lorsqu'une soudure est refroidie trop vite ?",
    options: ["déformation ou fissure", "augmentation de la résistance", "polissage automatique", "aucun effet"],
    bonne_reponse: "déformation ou fissure",
    explication: "Un refroidissement brutal crée des contraintes internes."
  },
  {
    question: "9. L’énergie massique de fusion de la glace correspond à :",
    options: ["l’énergie nécessaire pour chauffer la glace de 1°C", "l’énergie pour faire fondre 1 kg de glace", "la température de la glace", "la masse de la glace"],
    bonne_reponse: "l’énergie pour faire fondre 1 kg de glace",
    explication: "Elle représente l’énergie à fournir pour passer de solide à liquide."
  },
  {
    question: "10. Lors d’un refroidissement, l’énergie thermique :",
    options: ["arrive du froid", "est perdue vers l’extérieur", "est transférée du corps chaud vers le corps froid", "augmente spontanément"],
    bonne_reponse: "est transférée du corps chaud vers le corps froid",
    explication: "La chaleur se déplace toujours du chaud vers le froid."
  },
  {
    question: "11. La capacité calorifique massique de l’eau signifie que :",
    options: ["l’eau chauffe vite", "il faut beaucoup d’énergie pour augmenter sa température", "l’eau bout facilement", "elle absorbe peu de chaleur"],
    bonne_reponse: "il faut beaucoup d’énergie pour augmenter sa température",
    explication: "L’eau stocke beaucoup d’énergie. D’où l’efficacité du refroidissement à l’eau pour limiter les déformations."
  },
  {
    question: "12. Le principe du calorimètre est utilisé en atelier pour :",
    options: ["mesurer des tensions électriques", "limiter les pertes thermiques", "colorer les métaux", "souffler de l’air"],
    bonne_reponse: "limiter les pertes thermiques",
    explication: "Limiter les échanges thermiques permet de contrôler les températures."
  },
  {
    question: "13. Une tôle chauffée se dilate. Cela signifie que :",
    options: ["sa masse augmente", "sa longueur augmente", "sa couleur change", "elle devient plus légère"],
    bonne_reponse: "sa longueur augmente",
    explication: "La dilatation thermique allonge les pièces. En chaudronnerie : prévoir le retrait au refroidissement."
  },
  {
    question: "14. Pourquoi mesure-t-on la température pendant un soudage ?",
    options: ["pour éviter l’oxydation", "pour contrôler l’apport de chaleur", "pour décorer la pièce", "pour mesurer la masse"],
    bonne_reponse: "pour contrôler l’apport de chaleur",
    explication: "L’apport thermique influence la qualité du cordon. Une surchauffe crée des défauts."
  },
  {
    question: "15. Lors d’une solidification, l’énergie thermique :",
    options: ["est absorbée", "est libérée", "reste constante", "disparaît"],
    bonne_reponse: "est libérée",
    explication: "Un corps libère de l’énergie en solidifiant."
  },
  {
    question: "16. Une pièce métallique froide placée sur une pièce chaude :",
    options: ["chauffe la pièce chaude", "reste froide", "reçoit de la chaleur", "absorbe la masse"],
    bonne_reponse: "reçoit de la chaleur",
    explication: "La chaleur se transfère vers la pièce froide."
  },
  {
    question: "17. Pourquoi agite-t-on l’eau dans un calorimètre ?",
    options: ["pour dissoudre la glace", "pour homogénéiser la température", "pour accélérer l’évaporation", "pour refroidir le calorimètre"],
    bonne_reponse: "pour homogénéiser la température",
    explication: "L’agitation répartit la chaleur uniformément."
  },
  {
    question: "18. Que devient la masse lors d’un changement d’état ?",
    options: ["elle augmente", "elle diminue", "elle reste la même", "elle disparaît"],
    bonne_reponse: "elle reste la même",
    explication: "La masse se conserve."
  },
  {
    question: "19. Quelle est la conséquence d’un chauffage non uniforme ?",
    options: ["aucun effet", "déformations", "refroidissement rapide", "augmentation de masse"],
    bonne_reponse: "déformations",
    explication: "Les différences de dilatation entraînent des déformations. Risque de voilement en chaudronnerie."
  },
  {
    question: "20. Pourquoi utilise-t-on un isolant thermique sur une pièce soudée ?",
    options: ["pour garder la chaleur et éviter les contraintes", "pour décorer", "pour changer la masse", "pour accélérer la fusion"],
    bonne_reponse: "pour garder la chaleur et éviter les contraintes",
    explication: "Limiter le refroidissement brutal réduit les fissures."
  }
];

/* ============================================================
   =================== FIN DES QUESTIONS =======================
   ============================================================ */
