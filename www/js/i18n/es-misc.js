// Spanish content for almanac.js, shensha.js, forecast.js, compat.js, lunar.js
export const OFFICERS = [
  { name: 'Establecer', good: 'Empezar planes nuevos, asumir un cargo, viajar', avoid: 'Excavar, mover tierra, abrir almacenes', desc: 'El día de los comienzos – la energía es fresca y enérgica.' },
  { name: 'Eliminar', good: 'Limpiar, ordenar, dejar malos hábitos, rutinas de salud', avoid: 'Bodas, compras importantes', desc: 'Un día para despejar lo viejo y hacer sitio a lo nuevo.' },
  { name: 'Plenitud', good: 'Celebraciones, abrir un negocio, comercio, reuniones', avoid: 'Pleitos, asumir un cargo nuevo', desc: 'Abundancia y plenitud – bueno para reuniones y comercio.' },
  { name: 'Equilibrio', good: 'Reparaciones, trabajo rutinario, pintar, nivelar', avoid: 'Grandes proyectos nuevos, bodas', desc: 'Un día parejo y corriente – ideal para el mantenimiento y la rutina.' },
  { name: 'Estabilidad', good: 'Bodas, firmar contratos, comprar, fijar metas', avoid: 'Pleitos, viajes largos', desc: 'Fijar y asentar – lo que se acuerda hoy suele durar.' },
  { name: 'Iniciar', good: 'Empezar una obra, contratar, plantar, firmar', avoid: 'Mudarse, viajar, abrir un negocio', desc: 'Tomar y sostener – bueno para emprender un plan con firmeza.' },
  { name: 'Destrucción', good: 'Demoliciones, romper malos hábitos, terminar cosas a propósito', avoid: 'Bodas, contratos, inauguraciones, mudanzas', desc: 'El día opuesto al mes – las cosas se separan. Evita los comienzos importantes.' },
  { name: 'Peligro', good: 'Oración, trabajo minucioso, meditación', avoid: 'Actividades arriesgadas, escalar, navegar', desc: 'Delicado, pero favorable si actúas con cuidado.' },
  { name: 'Éxito', good: 'Casi todo: bodas, inauguraciones, mudanzas, contratos, viajes', avoid: 'Pleitos', desc: 'Uno de los mejores días del ciclo – los esfuerzos llegan a buen término.' },
  { name: 'Recibir', good: 'Cobrar deudas, cosechar, comprar, almacenar', avoid: 'Viajes, intervenciones médicas, funerales', desc: 'Un día para recoger lo que te corresponde.' },
  { name: 'Abrir', good: 'Abrir un negocio, bodas, empezar estudios, viajar, mudarse', avoid: 'Entierros, cerrar asuntos', desc: 'Las puertas se abren – excelente para lanzamientos y comienzos.' },
  { name: 'Cerrar', good: 'Ahorrar dinero, cerrar cuentas, levantar muros', avoid: 'Inauguraciones, viajes, empezar algo nuevo', desc: 'Las cosas se sellan – un día para descansar y concluir, no para empezar.' },
];
export const RATING_LABEL = { best: 'Muy bueno', good: 'Bueno', fair: 'Neutral', bad: 'Desfavorable' };
export const ACTIVITIES = ['Boda o compromiso', 'Mudanza', 'Firmar un contrato', 'Abrir un negocio o un lanzamiento', 'Empezar un viaje', 'Reforma u obra'];

export const STARS = {
  noble: { name: 'Noble Celestial', desc: 'Personas que ayudan y protección – el apoyo aparece cuando más lo necesitas.',
    pillar: { year: 'ayuda de la familia, de los mayores y de la sociedad', month: 'mentores y jefes que te apoyan en el trabajo', day: 'una pareja que te apoya; recibes ayuda personal', hour: 'hijos o alumnos que ayudan, o apoyo en la madurez' } },
  peach: { name: 'Flor de Melocotón', desc: 'Encanto, atracción y popularidad – romance, vida social y gusto artístico.',
    pillar: { year: 'popularidad temprana y soltura social', month: 'carisma en el trabajo y en tu círculo social', day: 'fuerte atracción romántica en las relaciones cercanas', hour: 'un romance que florece tarde; un lado romántico interior' } },
  horse: { name: 'Caballo Viajero', desc: 'Movimiento, viajes, mudanzas y cambios – una energía inquieta que florece en lugares nuevos.',
    pillar: { year: 'mudanzas o viajes en la infancia', month: 'trabajos con viajes o cambios frecuentes', day: 'un estilo de vida móvil; una pareja de lejos', hour: 'viajes y mudanzas más adelante en la vida' } },
  academic: { name: 'Estrella Académica', desc: 'Inteligencia, aprendizaje y escritura – éxito en los estudios, los exámenes y el trabajo intelectual.',
    pillar: { year: 'un entorno familiar culto', month: 'éxito profesional gracias a la formación', day: 'una mente aguda y estudiosa', hour: 'hijos inteligentes; aprendizaje de por vida' } },
  canopy: { name: 'Dosel', desc: 'Arte, espiritualidad y soledad – profundidad, originalidad e interés por la metafísica.',
    pillar: { year: 'raíces espirituales o artísticas', month: 'trabajo creativo o especializado', day: 'una naturaleza independiente e introspectiva', hour: 'intereses espirituales que crecen con la edad' } },
  prosperity: { name: 'Estrella de la Prosperidad', desc: 'Recursos estables e ingresos ganados por uno mismo – el «sueldo» propio del Maestro del Día.',
    pillar: { year: 'una base familiar sólida', month: 'ingresos constantes por el trabajo', day: 'autosuficiencia y buena salud', hour: 'seguridad en la madurez' } },
  blade: { name: 'Espada de la Cabra', desc: 'Fuerza de voluntad y valentía feroces – un filo afilado que necesita disciplina para usarse bien.',
    pillar: { year: 'influencias familiares de mucho carácter', month: 'un impulso profesional competitivo e intenso', day: 'una personalidad enérgica; el temperamento necesita cuidado', hour: 'determinación más adelante en la vida' } },
  void: { name: 'Vacío', desc: 'Vacío – lo que hay en este pilar se siente menos tangible; fuerte para el trabajo espiritual o creativo, más débil para los asuntos materiales.',
    pillar: { year: 'distancia de las raíces familiares', month: 'cambios de profesión o caminos poco convencionales', day: 'independencia; las relaciones necesitan un cuidado especial', hour: 'planes inusuales; menos ataduras en la madurez' } },
};

export const MONTH_TEXT = {
  F: 'Independencia e iguales – bueno para trabajar en equipo de igual a igual y para proyectos propios.',
  RW: 'Competitivo y lleno de energía – actúa con audacia, pero vigila el dinero y las asociaciones.',
  EG: 'Relajado y creativo – disfruta, descansa, cocina, crea algo.',
  HO: 'Expresivo e inquieto – genial para ideas y presentaciones; sé diplomático.',
  IW: 'Oportunidades y contactos – negocios paralelos, ventas, generosidad.',
  DW: 'Trabajo e ingresos constantes – haz presupuesto, ahorra, termina tareas.',
  '7K': 'Presión y desafíos – da la cara, pero evita los conflictos y el exceso de trabajo.',
  DO: 'Reconocimiento y responsabilidad – asuntos formales, solicitudes, compromisos.',
  IR: 'Reflexión y estudio – investigación, intuición, tiempo a solas.',
  DR: 'Apoyo y aprendizaje – mentores, cursos, descanso y familia.',
};

export const ROLE = {
  F: 'un igual – un vínculo como entre amigos', RW: 'una pareja rival y vivaz que te desafía y te da energía',
  EG: 'alguien a quien te gusta cuidar y con quien te relajas', HO: 'alguien que saca tu lado expresivo y rebelde',
  IW: 'una fuente emocionante de oportunidades y diversión', DW: 'una pareja constante y práctica – clásicamente la estrella de la esposa para los hombres',
  '7K': 'una presencia fuerte y exigente que te impulsa', DO: 'una influencia estabilizadora y responsable – clásicamente la estrella del esposo para las mujeres',
  IR: 'un maestro poco convencional y compañero de ideas', DR: 'alguien que te cuida y con quien te sientes seguro',
};

export const SOLAR_TERM_NAMES = { 315: 'Inicio de la primavera', 330: 'Agua de lluvia', 345: 'Despertar de los insectos', 0: 'Equinoccio de primavera',
  15: 'Claridad y luz', 30: 'Lluvia de los granos', 45: 'Inicio del verano', 60: 'Plenitud menor', 75: 'Grano en espiga', 90: 'Solsticio de verano',
  105: 'Calor menor', 120: 'Gran calor', 135: 'Inicio del otoño', 150: 'Fin del calor', 165: 'Rocío blanco', 180: 'Equinoccio de otoño',
  195: 'Rocío frío', 210: 'Descenso de la escarcha', 225: 'Inicio del invierno', 240: 'Nevada menor', 255: 'Gran nevada', 270: 'Solsticio de invierno',
  285: 'Frío menor', 300: 'Gran frío' };

export const FESTIVALS = {
  '春节': ['Año Nuevo Chino', 'La Fiesta de la Primavera – el comienzo del año lunar, celebrado en familia, con adornos rojos y fuegos artificiales.'],
  '元宵节': ['Fiesta de los Faroles', 'La primera luna llena del año – faroles, adivinanzas y bolitas dulces de arroz (tangyuan).'],
  '龙抬头': ['El Dragón alza la cabeza', 'El dragón despierta – tradicionalmente un día para cortarse el pelo y recibir las lluvias de primavera.'],
  '端午节': ['Fiesta del Bote del Dragón', 'Regatas de botes del dragón y zongzi (bolas de arroz), en recuerdo del poeta Qu Yuan.'],
  '七夕': ['Fiesta de Qixi', 'El encuentro del pastor y la tejedora – la fiesta china del amor.'],
  '中元节': ['Fiesta de los Fantasmas', 'Un día para honrar a los antepasados y apaciguar a los espíritus errantes.'],
  '中秋节': ['Fiesta del Medio Otoño', 'La luna llena de la cosecha – reuniones familiares y pasteles de luna.'],
  '重阳节': ['Fiesta del Doble Nueve', 'Un día para subir a lugares altos, para los crisantemos y para honrar a las personas mayores.'],
  '腊八节': ['Fiesta de Laba', 'Se come la papilla Laba – el comienzo de los preparativos del Año Nuevo.'],
  '除夕': ['Nochevieja lunar', 'La cena familiar de reunión en la última noche del año lunar.'],
  '清明节': ['Fiesta de Qingming', 'El día de los difuntos – las familias visitan y limpian las tumbas de sus antepasados.'],
  '冬至': ['Fiesta del Solsticio de Invierno', 'Dongzhi – el punto de inflexión del Yin y el Yang, celebrado con empanadillas o tangyuan.'],
};
