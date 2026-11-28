// Lecciones 1–7 (español)
export const LESSONS_1 = [
  {
    id: 'intro', title: '¿Qué es el BaZi?', zh: '八字', level: 'Basics',
    summary: 'Los «Ocho Caracteres» – un mapa de las energías en el momento del nacimiento.',
    body: `
<p>El <b>BaZi</b> (八字, «ocho caracteres») – también llamado los <b>Cuatro Pilares del Destino</b> (四柱命理) – es un sistema chino clásico que describe a una persona a partir del momento de su nacimiento.</p>
<p>El año, el mes, el día y la hora de nacimiento se escriben cada uno como un par de caracteres: un <b>Tallo Celestial</b> (天干) arriba y una <b>Rama Terrestre</b> (地支) abajo. Cuatro pilares × dos caracteres = <b>ocho caracteres</b>.</p>
<div data-widget="sample-chart"></div>
<p>Cada carácter lleva uno de los <b>Cinco Elementos</b> y una polaridad <b>Yin</b> o <b>Yang</b>. Leer una carta significa observar cómo estas energías se apoyan, se controlan y se equilibran entre sí.</p>
<h3>Lo que representa cada pilar</h3>
<ul>
<li><b>Año</b> – antepasados, sociedad, primera infancia (aprox. de 1 a 16 años)</li>
<li><b>Mes</b> – padres, entorno profesional, juventud (17–32)</li>
<li><b>Día</b> – tú mismo (el tallo) y tu pareja (la rama) (33–48)</li>
<li><b>Hora</b> – hijos, ideas, madurez (49+)</li>
</ul>
<p class="note">El BaZi es un sistema cultural tradicional. Esta app lo enseña para aprender y reflexionar sobre uno mismo – no como base para decisiones médicas, financieras o jurídicas.</p>`,
    quiz: [
      { q: '¿Cuántos caracteres tiene una carta BaZi completa?', options: ['Cuatro', 'Ocho', 'Doce', 'Diez'], answer: 1,
        explain: 'Cuatro pilares, cada uno con un tallo y una rama = 8 caracteres.' },
      { q: '¿Qué pilar te representa de forma más directa?', options: ['Año', 'Mes', 'Día', 'Hora'], answer: 2,
        explain: 'El tallo del día es el «Maestro del Día» – el yo.' },
    ],
  },
  {
    id: 'yinyang', title: 'El Yin y el Yang', zh: '阴阳', level: 'Basics',
    summary: 'Las dos fuerzas complementarias detrás de cada carácter.',
    body: `
<p>Todo fenómeno contiene dos aspectos complementarios: el <b>Yang</b> (阳) – activo, luminoso, expansivo, hacia fuera – y el <b>Yin</b> (阴) – receptivo, oscuro, que se contrae, hacia dentro.</p>
<div data-widget="yinyang"></div>
<p>Ninguno de los dos es «bueno» o «malo». Dependen el uno del otro y se transforman constantemente el uno en el otro: el mediodía (máximo Yang) se convierte en noche; pleno invierno (máximo Yin) se convierte en primavera.</p>
<h3>En el BaZi</h3>
<p>Cada uno de los cinco elementos aparece dos veces entre los diez Tallos Celestiales: una vez Yang y una vez Yin. La Madera Yang 甲 es un árbol alto; la Madera Yin 乙 es una enredadera en flor. El mismo elemento, una expresión muy distinta.</p>
<p>La polaridad importa al derivar los <b>Diez Dioses</b>: que dos tallos compartan o no la misma polaridad decide, por ejemplo, si un elemento es «Riqueza Directa» o «Riqueza Indirecta».</p>
<p class="tip">Regla práctica: en la secuencia de tallos y ramas, las posiciones impares (1.ª, 3.ª, …) son Yang y las pares son Yin.</p>`,
    quiz: [
      { q: '¿Qué cualidad pertenece al Yang?', options: ['Receptivo', 'Que se contrae', 'Activo', 'Oscuro'], answer: 2, explain: 'El Yang es activo, luminoso y expansivo.' },
      { q: '乙 Yi es …', options: ['Madera Yang', 'Madera Yin', 'Fuego Yin', 'Metal Yang'], answer: 1, explain: '甲 es Madera Yang, 乙 es Madera Yin.' },
    ],
  },
  {
    id: 'elements', title: 'Los Cinco Elementos', zh: '五行', level: 'Basics',
    summary: 'Madera, Fuego, Tierra, Metal y Agua – y cómo se producen y se controlan entre sí.',
    body: `
<p>Los <b>Cinco Elementos</b> (Wu Xing, 五行, literalmente «cinco movimientos») son fases de la energía más que sustancias físicas.</p>
<div data-widget="elements"></div>
<h3>El ciclo de producción (生)</h3>
<p>La Madera alimenta el <b>Fuego</b> → el Fuego crea ceniza, la <b>Tierra</b> → la Tierra alberga el <b>Metal</b> → el Metal lleva el <b>Agua</b> (condensación) → el Agua nutre la <b>Madera</b>.</p>
<h3>El ciclo de control (克)</h3>
<p>La Madera rompe la <b>Tierra</b> (raíces) → la Tierra contiene el <b>Agua</b> → el Agua apaga el <b>Fuego</b> → el Fuego funde el <b>Metal</b> → el Metal corta la <b>Madera</b>.</p>
<div data-widget="cycle"></div>
<h3>Debilitamiento</h3>
<p>Producir cuesta energía: el elemento «madre» se agota por el «hijo». Controlar también cuesta energía – un controlador demasiado débil se agota ante un objetivo fuerte («el agua débil no puede apagar un incendio forestal»).</p>
<p class="tip">Casi todo en el análisis BaZi se remite a estos dos ciclos. ¡Apréndelos de memoria!</p>`,
    quiz: [
      { q: '¿Qué elemento produce el Agua?', options: ['Fuego', 'Madera', 'Metal', 'Tierra'], answer: 1, explain: 'El Agua nutre la Madera.' },
      { q: '¿Qué elemento controla al Metal?', options: ['Fuego', 'Agua', 'Madera', 'Tierra'], answer: 0, explain: 'El Fuego funde el Metal.' },
      { q: 'La Tierra controla …', options: ['la Madera', 'el Metal', 'el Agua', 'el Fuego'], answer: 2, explain: 'La Tierra contiene el Agua.' },
    ],
  },
  {
    id: 'stems', title: 'Los diez Tallos Celestiales', zh: '天干', level: 'Basics',
    summary: 'Diez caracteres: cada elemento en su forma Yang y Yin.',
    body: `
<p>Los <b>Tallos Celestiales</b> son las energías «celestiales» y visibles de una carta – están en la parte de arriba de cada pilar. Cada tallo se representa con una imagen de la naturaleza.</p>
<div data-widget="stems"></div>
<p>Toca un tallo para leer su personalidad. Cuando conoces a alguien, su <b>tallo del día</b> da una primera impresión de su naturaleza esencial.</p>
<h3>Combinaciones de tallos (天干五合)</h3>
<p>Los tallos separados por cinco posiciones se «combinan» – se atraen y pueden transformarse en las condiciones adecuadas:</p>
<ul><li>甲 + 己 → Tierra</li><li>乙 + 庚 → Metal</li><li>丙 + 辛 → Agua</li><li>丁 + 壬 → Madera</li><li>戊 + 癸 → Fuego</li></ul>`,
    quiz: [
      { q: '¿Qué tallo se representa como el sol?', options: ['丁 Ding', '丙 Bing', '戊 Wu', '庚 Geng'], answer: 1, explain: '丙 es el Fuego Yang – el sol. 丁 es la vela.' },
      { q: '¿Cuál es el elemento de 壬 Ren?', options: ['Metal', 'Tierra', 'Agua', 'Madera'], answer: 2, explain: '壬 es el Agua Yang – el océano.' },
      { q: '甲 se combina con …', options: ['乙', '庚', '己', '戊'], answer: 2, explain: '甲 + 己 se combinan (→ Tierra).' },
    ],
  },
  {
    id: 'branches', title: 'Las doce Ramas Terrestres', zh: '地支', level: 'Basics',
    summary: 'Los doce animales – meses, horas y las raíces de una carta.',
    body: `
<p>Las <b>Ramas Terrestres</b> están en la parte de abajo de cada pilar. Están ligadas a los doce animales del zodiaco, a los doce periodos de dos horas del día y a los doce meses solares.</p>
<div data-widget="branches"></div>
<p>Las ramas son más complejas que los tallos: cada una contiene de uno a tres <b>tallos ocultos</b> (ver la lección sobre los tallos ocultos). Son las «raíces» que apoyan o debilitan a los tallos de arriba.</p>
<h3>Estaciones</h3>
<ul>
<li>Primavera (Madera): 寅 Tigre, 卯 Conejo, (辰 Dragón)</li>
<li>Verano (Fuego): 巳 Serpiente, 午 Caballo, (未 Cabra)</li>
<li>Otoño (Metal): 申 Mono, 酉 Gallo, (戌 Perro)</li>
<li>Invierno (Agua): 亥 Cerdo, 子 Rata, (丑 Buey)</li>
</ul>
<p>Las cuatro ramas de Tierra 辰 戌 丑 未 cierran cada estación – son ramas «almacén».</p>`,
    quiz: [
      { q: '¿Qué animal es 午 Wu?', options: ['Rata', 'Caballo', 'Cabra', 'Perro'], answer: 1, explain: '午 es el Caballo – Fuego Yang, de 11:00 a 13:00.' },
      { q: '¿Qué rama rige la hora de 23:00 a 01:00?', options: ['亥 Cerdo', '丑 Buey', '子 Rata', '寅 Tigre'], answer: 2, explain: 'La hora de la Rata 子 empieza a las 23:00.' },
      { q: '¿Cuál de estas es una rama de Tierra?', options: ['酉', '辰', '卯', '亥'], answer: 1, explain: '辰 Dragón es Tierra (igual que 戌, 丑 y 未).' },
    ],
  },
  {
    id: 'jiazi', title: 'El ciclo de los 60 Jiazi', zh: '六十甲子', level: 'Calendar',
    summary: 'Combinar diez tallos con doce ramas da 60 combinaciones.',
    body: `
<p>Los tallos y las ramas avanzan juntos: 甲子, 乙丑, 丙寅 … Como 10 y 12 tienen un factor común, solo los tallos Yang se emparejan con ramas Yang y los Yin con Yin – lo que da <b>60</b> combinaciones (no 120). Es el <b>ciclo sexagenario</b>, llamado así por su primer par, 甲子 Jia Zi.</p>
<div data-widget="jiazi"></div>
<p>El mismo ciclo cuenta años, meses, días y horas. 1984 fue 甲子; 2044 volverá a serlo. Los días recorren este ciclo sin interrupción desde hace más de 2700 años.</p>
<h3>Na Yin 纳音 – la imagen de un pilar</h3>
<p>Los 60 pilares forman 30 parejas, y cada pareja lleva una imagen poética con su propio elemento: 甲子 y 乙丑 son 海中金 <i>Oro en el mar</i>; 丙寅 y 丁卯, 炉中火 <i>Fuego en el horno</i>. Estas imágenes se llaman Na Yin («sonido»). Dan color a un pilar, pero el tallo y la rama cuentan siempre primero. En la vista «Detallada», tu carta muestra el Na Yin bajo cada pilar.</p>
<p class="tip">Por este ciclo tu «animal del zodiaco chino» se repite cada 12 años, pero tu pilar del año completo solo cada 60 años.</p>`,
    quiz: [
      { q: '¿Cuántos pilares tiene el ciclo completo?', options: ['12', '60', '120', '10'], answer: 1, explain: '60 – los tallos Yang solo se emparejan con ramas Yang.' },
      { q: '¿Qué par sigue a 甲子?', options: ['乙子', '甲丑', '乙丑', '丙寅'], answer: 2, explain: 'Ambos avanzan un paso: 乙丑.' },
    ],
  },
  {
    id: 'pillars', title: 'Construir los Cuatro Pilares', zh: '排四柱', level: 'Calendar',
    summary: 'Por qué el BaZi usa el calendario solar y cómo se obtiene cada pilar.',
    body: `
<p>El BaZi usa el calendario <b>solar</b> (节气, términos solares), <i>no</i> el año nuevo lunar.</p>
<h3>Pilar del año</h3>
<p>El año empieza en <b>Li Chun</b> 立春 (Inicio de la primavera, hacia el 4 de febrero), cuando el sol alcanza los 315° de longitud eclíptica. Alguien nacido el 20 de enero de 2024 pertenece al año 癸卯 (2023), no a 甲辰.</p>
<h3>Pilar del mes</h3>
<p>Los meses empiezan en los doce términos <b>Jie</b> (节), aproximadamente entre el 4 y el 8 de cada mes gregoriano. El primer mes es siempre el mes del Tigre 寅. Su tallo se deduce del tallo del año (regla de los «Cinco Tigres»):</p>
<ul><li>año 甲/己 → 丙寅</li><li>año 乙/庚 → 戊寅</li><li>año 丙/辛 → 庚寅</li><li>año 丁/壬 → 壬寅</li><li>año 戊/癸 → 甲寅</li></ul>
<div data-widget="jie"></div>
<h3>Pilar del día</h3>
<p>Se toma directamente del ciclo continuo de 60 días. Muchas escuelas empiezan el nuevo día a las 23:00 (el inicio de la hora de la Rata) – esta app lo hace así por defecto.</p>
<h3>Pilar de la hora</h3>
<p>La rama viene del periodo de dos horas; el tallo se deduce del tallo del día (regla de las «Cinco Ratas»): día 甲/己 → hora 甲子, 乙/庚 → 丙子, 丙/辛 → 戊子, 丁/壬 → 庚子, 戊/癸 → 壬子.</p>
<h3>Hora solar verdadera</h3>
<p>Tradicionalmente la hora se basa en la posición del sol en el lugar de nacimiento. Introduce la longitud del lugar de nacimiento en la calculadora para aplicar esta corrección – puede cambiar el pilar de la hora si naciste cerca de un límite.</p>`,
    quiz: [
      { q: '¿Cuándo empieza el año BaZi?', options: ['El 1 de enero', 'En el Año Nuevo Chino', 'En Li Chun (~4 de feb.)', 'En el solsticio de invierno'], answer: 2, explain: 'El año solar empieza en Li Chun.' },
      { q: 'El primer mes del año BaZi es siempre el …', options: ['mes de la Rata 子', 'mes del Tigre 寅', 'mes del Conejo 卯', 'mes del Buey 丑'], answer: 1, explain: 'Li Chun da comienzo al mes del Tigre.' },
      { q: 'En un año 甲, el mes del Tigre es …', options: ['甲寅', '丙寅', '戊寅', '壬寅'], answer: 1, explain: 'Los años 甲/己 empiezan con 丙寅.' },
    ],
  },
];
