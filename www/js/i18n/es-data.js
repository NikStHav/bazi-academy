// Spanish content for data.js (same order as the English arrays).
export const ELEMENTS = [
  { name: 'Madera', season: 'Primavera', direction: 'Este', traits: 'Crecimiento, bondad, planificación, flexibilidad, expansión hacia arriba.' },
  { name: 'Fuego', season: 'Verano', direction: 'Sur', traits: 'Calidez, expresión, pasión, visibilidad, entusiasmo.' },
  { name: 'Tierra', season: 'Transiciones entre estaciones', direction: 'Centro', traits: 'Estabilidad, confianza, sustento, fiabilidad, mediación.' },
  { name: 'Metal', season: 'Otoño', direction: 'Oeste', traits: 'Estructura, justicia, determinación, refinamiento, disciplina.' },
  { name: 'Agua', season: 'Invierno', direction: 'Norte', traits: 'Sabiduría, adaptabilidad, comunicación, profundidad, fluidez.' },
];
export const STEMS = [
  { image: 'Árbol alto', desc: 'Madera Yang – el gran árbol. Recto, de principios firmes, un líder natural que crece de forma constante hacia arriba; puede ser terco y difícil de doblegar.' },
  { image: 'Flores, enredaderas, hierba', desc: 'Madera Yin – flores y enredaderas. Elegante, adaptable e ingeniosa; encuentra la manera de rodear los obstáculos y prospera gracias a sus conexiones.' },
  { image: 'El sol', desc: 'Fuego Yang – el sol. Generoso, radiante, abierto y optimista; brilla para todos, pero puede resultar abrumador o impaciente.' },
  { image: 'Vela, lámpara, luz de estrellas', desc: 'Fuego Yin – la vela. Cálido, perceptivo y atento; ilumina los detalles y a las personas de cerca. Constante, pero sensible al «viento».' },
  { image: 'Montaña', desc: 'Tierra Yang – la montaña. Sólida, fiable y protectora; cambia despacio, a veces es inamovible.' },
  { image: 'Campo fértil', desc: 'Tierra Yin – el campo. Nutritiva, paciente y versátil; apoya a los demás y absorbe mucho, a veces se preocupa demasiado.' },
  { image: 'Hacha, mineral en bruto, arma', desc: 'Metal Yang – el hacha. Directo, leal, valiente y decidido; valora la justicia, puede ser brusco o duro.' },
  { image: 'Joya, hoja fina', desc: 'Metal Yin – la joya. Refinado, preciso, estético y orgulloso; valora la calidad y el reconocimiento.' },
  { image: 'Océano, gran río', desc: 'Agua Yang – el océano. Inteligente, dinámica, aventurera y libre; puede ser inquieta o arrolladora.' },
  { image: 'Lluvia, rocío, niebla', desc: 'Agua Yin – la lluvia y la niebla. Intuitiva, suave, imaginativa y discretamente perseverante; nutre de forma sutil.' },
];
export const BRANCHES = [
  { animal: 'Rata', month: 'dic. (Da Xue → Xiao Han)' }, { animal: 'Buey', month: 'ene. (Xiao Han → Li Chun)' },
  { animal: 'Tigre', month: 'feb. (Li Chun → Jing Zhe)' }, { animal: 'Conejo', month: 'mar. (Jing Zhe → Qing Ming)' },
  { animal: 'Dragón', month: 'abr. (Qing Ming → Li Xia)' }, { animal: 'Serpiente', month: 'may. (Li Xia → Mang Zhong)' },
  { animal: 'Caballo', month: 'jun. (Mang Zhong → Xiao Shu)' }, { animal: 'Cabra', month: 'jul. (Xiao Shu → Li Qiu)' },
  { animal: 'Mono', month: 'ago. (Li Qiu → Bai Lu)' }, { animal: 'Gallo', month: 'sep. (Bai Lu → Han Lu)' },
  { animal: 'Perro', month: 'oct. (Han Lu → Li Dong)' }, { animal: 'Cerdo', month: 'nov. (Li Dong → Da Xue)' },
];
export const TEN_GODS = {
  F: { name: 'Amigo', short: 'Am', rel: 'Mismo elemento, misma polaridad',
    desc: 'Iguales, hermanos, autosuficiencia e independencia. Fortalece al Maestro del Día; en exceso puede significar terquedad o competencia.' },
  RW: { name: 'Rival', short: 'Ri', rel: 'Mismo elemento, polaridad opuesta',
    desc: 'Competidores, acción audaz, impulso social y gusto por el riesgo. Apoya al yo, pero puede «robar» riqueza con gastos impulsivos.' },
  EG: { name: 'Dios de la Comida', short: 'DC', rel: 'Elemento que produzco, misma polaridad',
    desc: 'Creatividad, disfrute, talento, comida y expresión relajada. Una salida suave para la energía del Maestro del Día.' },
  HO: { name: 'Rebelde', short: 'Re', rel: 'Elemento que produzco, polaridad opuesta',
    desc: 'Brillantez, rebeldía, actuación e innovación. Cuestiona la autoridad; lengua afilada, gran originalidad.' },
  IW: { name: 'Riqueza Indirecta', short: 'RqI', rel: 'Elemento que controlo, misma polaridad',
    desc: 'Golpes de suerte, negocios, oportunidades y generosidad. Riqueza que llega a través de proyectos y contactos.' },
  DW: { name: 'Riqueza Directa', short: 'RqD', rel: 'Elemento que controlo, polaridad opuesta',
    desc: 'Ingresos estables, ahorro, constancia y sentido práctico. Clásicamente también la estrella de la esposa en la carta de un hombre.' },
  '7K': { name: 'Siete Asesinos', short: '7A', rel: 'Elemento que me controla, misma polaridad',
    desc: 'Presión, ambición, valentía y poder. Impulsa a lograr metas bajo presión; sin control trae conflictos.' },
  DO: { name: 'Autoridad Directa', short: 'AD', rel: 'Elemento que me controla, polaridad opuesta',
    desc: 'Orden, estatus, responsabilidad, reputación y normas. Clásicamente también la estrella del esposo en la carta de una mujer.' },
  IR: { name: 'Recurso Indirecto', short: 'RcI', rel: 'Elemento que me produce, misma polaridad',
    desc: 'Intuición, aprendizaje poco convencional, espiritualidad y soledad. Perspicaz, a veces retraído.' },
  DR: { name: 'Recurso Directo', short: 'RcD', rel: 'Elemento que me produce, polaridad opuesta',
    desc: 'Apoyo, educación, la madre, protección y paciencia. Nutre y fortalece al Maestro del Día.' },
};
export const JIE_NAMES = ['Li Chun – Inicio de la primavera', 'Jing Zhe – Despertar de los insectos', 'Qing Ming – Claridad y luz', 'Li Xia – Inicio del verano',
  'Mang Zhong – Grano en espiga', 'Xiao Shu – Calor menor', 'Li Qiu – Inicio del otoño', 'Bai Lu – Rocío blanco', 'Han Lu – Rocío frío',
  'Li Dong – Inicio del invierno', 'Da Xue – Gran nevada', 'Xiao Han – Frío menor'];
