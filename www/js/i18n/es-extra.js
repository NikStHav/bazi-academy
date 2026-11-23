// Spanish texts that German keeps inline: growth stages (stages.js), hour deities (hours.js),
// the in-app guide (guide.js) and the day-card themes (daily.js).
export const STAGES = [
  ['长生', 'Nacimiento', 'Un comienzo fresco – optimismo, potencial y una capacidad natural de crecer.'],
  ['沐浴', 'Baño', 'Encanto y curiosidad – atractivo y romántico, pero inquieto y abierto a las tentaciones.'],
  ['冠带', 'Corona', 'Confianza creciente – imagen, ambición y deseo de ser visto.'],
  ['临官', 'Mayoría de edad', 'Capacidad y autosuficiencia – listo para asumir responsabilidades y una profesión.'],
  ['帝旺', 'Apogeo', 'Plena fuerza – una voluntad y un empuje fuertes que pueden volverse dominantes.'],
  ['衰', 'Declive', 'Madurez – con experiencia, prudente y mesurado en lugar de impulsivo.'],
  ['病', 'Enfermedad', 'Sensibilidad – empático y perceptivo, con tendencia a preocuparse.'],
  ['死', 'Muerte', 'Quietud – tranquilo, introspectivo y concentrado, con una profundidad serena.'],
  ['墓', 'Tumba', 'Almacén – reservado y ahorrador, con reservas ocultas.'],
  ['绝', 'Extinción', 'Transición – independiente, listo para nuevos capítulos, a veces inquieto.'],
  ['胎', 'Concepción', 'Ideas que se forman – imaginativo y lleno de planes que aún no han nacido.'],
  ['养', 'Nutrición', 'Ser nutrido – dulce, apoyado y creciendo paso a paso.'],
];

export const DEITY_NAMES = ['Dragón Verde', 'Salón Luminoso', 'Castigo Celestial', 'Pájaro Bermellón', 'Cofre Dorado', 'Virtud Celestial',
  'Tigre Blanco', 'Salón de Jade', 'Prisión Celestial', 'Tortuga Negra', 'Señor del Destino', 'Serpiente Enroscada'];

export const GUIDE = [
  ['🚀', 'Empieza con tu propia carta', `
<ol><li>Abre la pestaña <a href="#/chart">Carta</a> e introduce tu <b>fecha, hora y lugar de nacimiento</b>. Elige el lugar de la lista – la app ajusta entonces la zona horaria correcta, el horario de verano histórico y la hora solar verdadera.</li>
<li>Marca <b>«Esta es mi propia carta»</b> (★). Muchas funciones – Hoy, el reloj chino, los recordatorios, tu pareja ideal – se personalizan según esta carta.</li>
<li>¿No sabes tu hora de nacimiento? Marca «Hora de nacimiento desconocida»: obtienes tres pilares, que ya es mucho.</li></ol>`],
  ['🔎', 'Lee tu carta', `
<ul><li><b>Toca cualquier carácter</b> (tallo, rama, Dios) para ver lo que significa – la carta es tu mejor libro de texto.</li>
<li>Las letras pequeñas bajo las ramas son los <b>Diez Dioses de los tallos ocultos</b> (p. ej., RcD = Recurso Directo).</li>
<li>Lee las tarjetas de arriba abajo: <b>Maestro del Día</b> (quién eres) → <b>pilar del día</b> (tu «asiento» y las fases de crecimiento) → <b>Cinco Elementos</b> → <b>interacciones</b> → <b>estrellas simbólicas</b> → <b>pilares de la suerte</b>.</li>
<li>La <b>lectura detallada</b> lo une todo: elementos favorables, perfil de los Diez Dioses, profesión, relaciones, puntos débiles y cómo equilibrarlos.</li></ul>`],
  ['🎓', 'Aprende BaZi paso a paso', `
<ul><li>Recorre las <a href="#/learn">15 lecciones</a> en orden – cada una se apoya en la anterior. Los diagramas son interactivos: toca elementos, tallos y ramas.</li>
<li>Termina cada lección con <b>«Ponte a prueba»</b>. Una lección cuenta como completada cuando al menos la mitad de las respuestas son correctas.</li>
<li>Practica unos minutos al día en la pestaña <a href="#/quiz">Cuestionario</a> – cada ronda se genera de nuevo. Empieza por los Cinco Elementos y los tallos, y pasa después a los tallos ocultos y los Diez Dioses.</li>
<li>Consejo: después de cada lección, busca el tema en tu propia carta.</li></ul>`],
  ['☀️', 'Úsala cada día', `
<ul><li>Empieza con tu <b>carta del día</b>: toca la rueda en la pantalla <a href="#/today">Hoy</a>. Se detiene en el pilar de hoy y muestra estrellas, el tema del día, qué hacer y qué evitar, y tus horas de suerte. Abre <b>«¿Por qué?»</b> para ver las razones del BaZi paso a paso.</li>
<li><a href="#/today">Hoy</a> muestra también los pilares del día, lo que significa el día para ti, el <b>reloj chino</b> con las horas de suerte de hoy y el <b>almanaque</b> (para qué es propicio el día y qué evitar).</li>
<li>Activa el <b>consejo del día</b> en la pantalla Hoy para recibir cada día una breve nota sobre su energía.</li>
<li>La pestaña <a href="#/calendar">Calendario</a> muestra las fechas lunares, los términos solares, las lunas nuevas y llenas y las fiestas. Toca cualquier día para ver sus detalles.</li></ul>`],
  ['🧭', 'Planifica con antelación', `
<ul><li><b>Influencias</b> (en cada carta): elige cualquier fecha y hora para ver cómo afectan a la carta sus pilares del año, mes, día y hora – ideal para citas, viajes o decisiones.</li>
<li><b>El año por delante</b>: el tema del año y los 12 meses con valoraciones y los mejores meses.</li>
<li><b>Línea de la vida</b>: todos los pilares de la suerte y los años de un vistazo – entiende las grandes fases de la vida.</li>
<li><a href="#/almanac">Planificador del almanaque</a>: encuentra buenos días para bodas, mudanzas, contratos, lanzamientos, viajes o reformas.</li></ul>`],
  ['💞', 'Relaciones', `
<ul><li><a href="#/match">Compatibilidad</a>: compara dos cartas guardadas – Maestros del Día, palacios de la pareja, animales del zodiaco y equilibrio de elementos.</li>
<li><b>Tu pareja ideal</b>: qué Maestros del Día, animales del zodiaco y elementos te convienen.</li>
<li><b>Consulta rápida</b>: ¿acabas de conocer a alguien? Introduce su fecha de nacimiento – no se guarda nada.</li></ul>`],
  ['🗂️', 'Organiza, comparte y protege', `
<ul><li>Asigna a las cartas un <b>grupo</b> (familia, amigos, clientes …) y <b>notas</b>, y luego búscalas y ordénalas en la pestaña Carta.</li>
<li>Usa las notas como un diario: apunta los acontecimientos importantes y compáralos con la carta, el año y el pilar de la suerte – la mejor manera de contrastar el BaZi con la vida real.</li>
<li><b>Compartir como imagen</b> envía una tarjeta de la carta a tus amigos.</li>
<li>Los <b>recordatorios</b> y <b>Añadir a tu calendario</b> (pestaña Calendario) llevan las lunas llenas, los solsticios y las fiestas al calendario de tu teléfono.</li>
<li>Haz copias de seguridad con regularidad: <a href="#/about">Acerca de</a> → <b>Exportar</b>. En un teléfono nuevo, usa <b>Importar</b>.</li>
<li>Los dos botones de arriba a la derecha están en todas las pantallas: el <b>botón de idioma</b> (ES · EN · DE) cambia el idioma y <b>ⓘ</b> abre los ajustes, el tamaño del texto, la copia de seguridad y el <b>soporte</b> – escríbenos cuando quieras.</li></ul>`],
  ['🗓️', 'Rutinas sugeridas', `
<ul><li><b>Cada día (2 minutos):</b> pantalla Hoy → carta del día, horas de suerte, almanaque; una ronda del cuestionario.</li>
<li><b>Cada semana:</b> una lección; mira los próximos 7 días en el almanaque; añade notas sobre la semana a tu carta.</li>
<li><b>Cada mes:</b> revisa el nuevo mes solar en El año por delante y en el Calendario.</li>
<li><b>Antes de grandes decisiones:</b> Influencias para la fecha + planificador del almanaque.</li>
<li><b>Una vez al año (hacia Li Chun, a principios de febrero):</b> lee El año por delante y tu Línea de la vida.</li></ul>
<p class="note">El BaZi describe tendencias para reflexionar – tus decisiones dan forma a tu vida.</p>`],
];

export const DAILY_THEMES = {
  F: { icon: '🤝', title: 'Valerte por ti mismo', text: 'Un día para confiar en ti y conectar con personas de tu nivel.',
    do: ['Trabajar en tus propios proyectos', 'Quedar con amigos o compañeros', 'Hacer ejercicio'], avoid: ['Discusiones tercas', 'Prestar dinero'] },
  RW: { icon: '🔥', title: 'Audaz y competitivo', text: 'La energía está alta – actúa con audacia, pero vigila tu dinero.',
    do: ['Deporte y competición', 'Dar un primer paso valiente', 'Unirte a otros por una meta'], avoid: ['Compras impulsivas', 'Apuestas o préstamos arriesgados'] },
  EG: { icon: '🎨', title: 'Disfrutar y crear', text: 'Un día relajado para la creatividad, la buena comida y hacer lo que te gusta.',
    do: ['Aficiones creativas', 'Cocinar o comer bien', 'Descansar y recargar energía'], avoid: ['Los excesos', 'Exigirte demasiado'] },
  HO: { icon: '💡', title: 'Exprésate', text: 'Las ideas fluyen y quieres que te escuchen – genial para presentar, pero elige bien tus palabras.',
    do: ['Presentar ideas', 'Escribir, actuar, publicar', 'Lluvia de ideas'], avoid: ['Criticar a tu jefe', 'Palabras hirientes'] },
  IW: { icon: '🎯', title: 'Oportunidades', text: 'Las oportunidades pueden surgir de la nada – haz contactos, vende y mantente abierto.',
    do: ['Hacer contactos y conocer gente', 'Ventas y negocios paralelos', 'Aceptar invitaciones'], avoid: ['Juegos de azar', 'Dispersarte demasiado'] },
  DW: { icon: '💰', title: 'Progreso constante', text: 'Un día práctico para el trabajo, el dinero y avanzar paso a paso.',
    do: ['Terminar tareas pendientes', 'Planificar tu presupuesto', 'Poner al día el papeleo'], avoid: ['Atajos', 'Derrochar'] },
  '7K': { icon: '⚡', title: 'Presión y valentía', text: 'Los desafíos te piden dar la cara – mantén la calma y no busques peleas.',
    do: ['Afrontar una tarea difícil', 'Poner límites claros', 'Entrenamiento físico'], avoid: ['Conflictos', 'Exceso de trabajo y riesgos'] },
  DO: { icon: '🏛️', title: 'Responsabilidad', text: 'Un buen día para los asuntos formales, los compromisos y demostrar que eres fiable.',
    do: ['Solicitudes y trámites oficiales', 'Cumplir tus promesas', 'Hablar con tus superiores'], avoid: ['Saltarte las normas', 'Llegar tarde'] },
  IR: { icon: '🔮', title: 'Reflexionar y estudiar', text: 'Mira hacia dentro – la investigación, la intuición y la calma funcionan mejor hoy.',
    do: ['Estudiar o investigar', 'Meditar o escribir un diario', 'Tiempo a solas'], avoid: ['Darle demasiadas vueltas', 'Grandes eventos sociales'] },
  DR: { icon: '📚', title: 'Apoyo y aprendizaje', text: 'Hoy la ayuda viene de los demás – aprende, pide consejo y cuídate.',
    do: ['Aprender algo nuevo', 'Pedir consejo a un mentor', 'Tiempo en familia y descanso'], avoid: ['Esperar a que otros actúen', 'Descuidar tus propias necesidades'] },
};
