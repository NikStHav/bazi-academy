// Lecciones 8–15 (español)
export const LESSONS_2 = [
  {
    id: 'hidden', title: 'Los tallos ocultos', zh: '藏干', level: 'Core',
    summary: 'Los tallos escondidos dentro de cada rama.',
    body: `
<p>Cada Rama Terrestre contiene de uno a tres <b>tallos ocultos</b> (藏干). El primero es el <b>qi principal</b> (本气), seguido del qi medio y del qi residual.</p>
<div data-widget="hidden"></div>
<p>Los tallos ocultos explican por qué una rama puede apoyar a un tallo de otro elemento. Por ejemplo, 寅 Tigre contiene 甲 Madera, 丙 Fuego y 戊 Tierra – así que un Maestro del Día 丙 Fuego tiene una raíz en 寅.</p>
<h3>Raíces</h3>
<p>Un tallo que encuentra su propio elemento en una rama de abajo (o en otro lugar de la carta) está <b>enraizado</b> (通根) y es mucho más fuerte que un tallo «flotante» sin raíces.</p>
<p class="tip">Las ramas puras 子 卯 午 酉 (los puntos cardinales) contienen sobre todo un elemento; las ramas de Tierra 辰 戌 丑 未 contienen tres – son los «almacenes» de las estaciones.</p>`,
    quiz: [
      { q: '¿Cuál es el tallo oculto principal de 亥 Cerdo?', options: ['甲', '壬', '癸', '戊'], answer: 1, explain: '亥 contiene 壬 (principal) y 甲.' },
      { q: '¿Qué rama contiene 戊 乙 癸?', options: ['辰', '戌', '丑', '未'], answer: 0, explain: '辰 Dragón es el almacén del Agua: 戊 乙 癸.' },
    ],
  },
  {
    id: 'daymaster', title: 'El Maestro del Día', zh: '日主', level: 'Core',
    summary: 'El tallo de tu pilar del día – el centro de todo análisis.',
    body: `
<p>El Tallo Celestial del pilar del día es el <b>Maestro del Día</b> (日主 o 日元). Te representa a <b>ti</b>. Todos los demás caracteres se interpretan en relación con él.</p>
<p>Hazte tres preguntas:</p>
<ol>
<li><b>¿Quién soy?</b> – Lee la naturaleza del tallo de tu Maestro del Día (lección sobre los Tallos Celestiales).</li>
<li><b>¿Cuándo nací?</b> – ¿Está mi elemento en su estación? (lección sobre la fuerza)</li>
<li><b>¿Qué me rodea?</b> – ¿Qué elementos me apoyan y cuáles produzco, controlo o me controlan? (lección sobre los Diez Dioses)</li>
</ol>
<p>Un Maestro del Día 甲 Madera nacido en primavera es un árbol en pleno crecimiento; nacido en otoño, se enfrenta a afiladas hachas de Metal – el mismo tallo, una historia muy distinta.</p>
<h3>Los 60 pilares del día</h3>
<p>Junto con su rama, el Maestro del Día forma el <b>pilar del día</b> (日柱). La rama es el «asiento» del Maestro del Día y su palacio de la pareja – por eso 甲子 y 甲午 son ambos Madera Yang y, sin embargo, personas muy diferentes.</p>
<div data-widget="daypillars"></div>
<p class="tip">Calcula tu propia carta en la pestaña <b>Carta</b> y toca tu Maestro del Día para leer sobre él.</p>`,
    quiz: [
      { q: 'El Maestro del Día es …', options: ['La rama del año', 'El tallo del día', 'El tallo del mes', 'La rama de la hora'], answer: 1, explain: 'El tallo del pilar del día.' },
    ],
  },
  {
    id: 'tengods', title: 'Los Diez Dioses', zh: '十神', level: 'Core',
    summary: 'Las relaciones entre el Maestro del Día y cada uno de los demás caracteres.',
    body: `
<p>Los <b>Diez Dioses</b> (十神) traducen los cinco elementos en temas de la vida. Cada uno se define por la relación de su elemento con el Maestro del Día y por la polaridad (igual u opuesta):</p>
<div data-widget="tengods"></div>
<h3>Cinco grupos</h3>
<ul>
<li><b>Compañeros</b> (mismo elemento) – Amigo, Rival: el yo, los iguales</li>
<li><b>Expresión</b> (lo que produzco) – Dios de la Comida, Rebelde (en los textos clásicos «Oficial Herido»): expresión, talento</li>
<li><b>Riqueza</b> (lo que controlo) – Riqueza Directa e Indirecta: dinero, recursos</li>
<li><b>Poder</b> (lo que me controla) – Autoridad Directa, Siete Asesinos: profesión, disciplina</li>
<li><b>Recursos</b> (lo que me produce) – Recurso Directo e Indirecto: conocimiento, apoyo</li>
</ul>
<div data-widget="tengod-trainer"></div>`,
    quiz: [
      { q: 'Para un Maestro del Día 甲, ¿qué es 丙?', options: ['Rebelde', 'Dios de la Comida', 'Riqueza Directa', 'Amigo'], answer: 1, explain: 'La Madera produce el Fuego, ambos Yang → Dios de la Comida.' },
      { q: 'Para un Maestro del Día 庚, ¿qué es 丁?', options: ['Siete Asesinos', 'Autoridad Directa', 'Recurso Directo', 'Rival'], answer: 1, explain: 'El Fuego controla el Metal, polaridad opuesta → Autoridad Directa.' },
      { q: 'La estrella de Recurso es el elemento que …', options: ['controlo', 'me controla', 'me produce', 'produzco'], answer: 2, explain: 'El Recurso (印) produce al Maestro del Día.' },
    ],
  },
  {
    id: 'strength', title: 'Fuerza y estaciones', zh: '旺相休囚死', level: 'Analysis',
    summary: '¿Es fuerte o débil el Maestro del Día?',
    body: `
<p>El factor más importante para la fuerza es la <b>rama del mes</b> – la estación del nacimiento (月令). Un elemento puede estar en uno de cinco estados:</p>
<div data-widget="phases"></div>
<h3>Valorar la fuerza</h3>
<ol>
<li><b>Estación:</b> ¿apoya la rama del mes al Maestro del Día?</li>
<li><b>Raíces:</b> ¿aparece el elemento del Maestro del Día en los tallos ocultos?</li>
<li><b>Apoyo:</b> ¿cuántos tallos de Compañero y de Recurso hay?</li>
</ol>
<p>Elementos que apoyan = mismo elemento + Recurso. Que debilitan = Expresión, Riqueza y Poder.</p>
<p>La calculadora de cartas muestra una puntuación <i>aproximada</i>. Los lectores con experiencia también sopesan combinaciones, choques y estructuras especiales (从格) – ningún número sustituye al criterio.</p>`,
    quiz: [
      { q: 'Un Maestro del Día de Fuego nacido en verano está …', options: ['Próspero 旺', 'Muerto 死', 'Atrapado 囚', 'En reposo 休'], answer: 0, explain: 'El Fuego en la estación del Fuego está en su apogeo.' },
      { q: 'Un Maestro del Día de Madera nacido en invierno (Agua) está …', options: ['En reposo', 'Fuerte 相', 'Muerto', 'Atrapado'], answer: 1, explain: 'El Agua produce la Madera → 相 Fuerte.' },
      { q: '¿Qué factor importa más para la fuerza?', options: ['La rama de la hora', 'El tallo del año', 'La rama del mes', 'El sexo'], answer: 2, explain: 'La rama del mes – la estación.' },
    ],
  },
  {
    id: 'interactions', title: 'Interacciones de las ramas', zh: '刑冲合害', level: 'Analysis',
    summary: 'Choques, combinaciones, castigos y daños.',
    body: `
<p>Las ramas interactúan entre sí. Las interacciones más importantes:</p>
<h3>Seis Choques 六冲 – opuestos en la rueda del zodiaco</h3>
<p>Animales enfrentados en la rueda – movimiento, cambio, conflicto. Un choque con la rama del día puede afectar al palacio de la relación.</p>
<div data-widget="rel-clash"></div>
<h3>Seis Armonías 六合</h3>
<p>Vínculos, atracción, cooperación – cada pareja tiende hacia un elemento.</p>
<div data-widget="rel-six"></div>
<h3>Triple Armonía 三合</h3>
<p>Un marco poderoso que refuerza un elemento. Dos de los tres forman una media combinación si uno de ellos es el animal del centro (子 Rata, 卯 Conejo, 午 Caballo, 酉 Gallo).</p>
<div data-widget="rel-three"></div>
<h3>¿Cómo funciona una Triple Armonía?</h3>
<p>Cada grupo cuenta la historia de vida de <b>un elemento</b>: el animal donde <b>nace</b>, el animal donde está en su <b>apogeo</b> y el animal donde se <b>almacena</b>. Piensa en una planta: brota, florece por completo y se cosecha y se guarda.</p>
<div data-widget="three-life"></div>
<p><b>Ejemplo Agua:</b> 申 Mono es Metal, y el Metal produce Agua – dentro lleva un poco de Agua (壬), así que el Agua nace aquí. 子 Rata es pleno invierno, Agua pura – el apogeo. 辰 Dragón es Tierra, pero esconde algo de Agua (癸), como un embalse – aquí se almacena el Agua.</p>
<p><b>La regla fácil:</b> el animal del medio es siempre uno de los cuatro animales «puros» – 子 Rata, 卯 Conejo, 午 Caballo o 酉 Gallo. Su elemento es el elemento de todo el grupo. Los otros dos están cuatro puestos antes y después en la rueda, así que los tres forman un triángulo. La Tierra no tiene grupo propio: se reparte entre los cuatro animales almacén 辰 Dragón, 未 Cabra, 戌 Perro y 丑 Buey.</p>
<p class="tip">Volverás a encontrar estos tres momentos: en la lección de Estrellas simbólicas (Dosel = almacén, Caballo Viajero) y en la lección avanzada sobre las Doce Fases de Crecimiento.</p>
<h3>Combinaciones direccionales 三会</h3>
<p>Los tres animales de una estación juntos:</p>
<div data-widget="rel-season"></div>
<h3>Castigos 刑 y daños 害</h3>
<p>Los castigos clásicos traen tensión y obligaciones; 子 Rata y 卯 Conejo forman el castigo «descortés». Los daños indican fricciones ocultas.</p>
<div data-widget="rel-harm"></div>
<div data-widget="wheel"></div>`,
    quiz: [
      { q: '¿Qué rama choca con 子 Rata?', options: ['丑 Buey', '午 Caballo', '卯 Conejo', '酉 Gallo'], answer: 1, explain: 'Opuestos: 子午 chocan.' },
      { q: '申子辰 forma un marco de …', options: ['Fuego', 'Metal', 'Agua', 'Madera'], answer: 2, explain: 'Mono–Rata–Dragón = Agua.' },
      { q: '¿Qué par es una Seis Armonías?', options: ['寅亥', '寅申', '卯酉', '巳亥'], answer: 0, explain: '寅亥 se combinan; los demás son choques.' },
    ],
  },
  {
    id: 'stars', title: 'Estrellas simbólicas', zh: '神煞', level: 'Analysis',
    summary: 'Noble Celestial, Flor de Melocotón, Caballo Viajero y otras estrellas especiales.',
    body: `
<p>Además de los elementos y los Diez Dioses, el BaZi clásico usa <b>estrellas simbólicas</b> (神煞, Shen Sha). Son ramas especiales que llevan un tema concreto. Dan color a una lectura, pero nunca pesan más que los elementos y la fuerza del Maestro del Día.</p>
<div data-widget="stars"></div>
<h3>Cómo se encuentran</h3>
<ul>
<li><b>A partir del tallo del día:</b> Noble Celestial 天乙贵人, Estrella Académica 文昌, Estrella de la Prosperidad 禄 y Espada de la Cabra 羊刃. Por ejemplo, un Maestro del Día 癸 tiene su Noble Celestial en 卯 y 巳.</li>
<li><b>A partir de la rama del día o del año</b> (según su grupo de Triple Armonía): Flor de Melocotón 桃花, Caballo Viajero 驿马 y Dosel 华盖. Para 申子辰, la Flor de Melocotón es 酉, el Caballo Viajero 寅 y el Dosel 辰.</li>
<li><b>A partir del pilar del día:</b> las dos ramas del Vacío 空亡 de su grupo de diez días (旬). En el grupo 甲子, 戌 y 亥 están vacías.</li>
</ul>
<h3>Dónde aparecen</h3>
<p>El pilar de una estrella indica <i>dónde</i> actúa: una Flor de Melocotón en la rama del día apunta al romance en las relaciones cercanas; en la rama del mes, al carisma en el trabajo. Cuando un año o un pilar de la suerte trae la rama de una estrella, la estrella se «activa» – un año del Caballo Viajero suele traer viajes o una mudanza.</p>
<p><b>¿Por qué estas ramas?</b> Siguen la historia de vida del elemento del grupo (ver Interacciones de las ramas): el Dosel es el animal <b>almacén</b>, el Caballo Viajero choca con el animal del <b>nacimiento</b> y pone las cosas en movimiento, y la Flor de Melocotón es la fase «Baño», justo después del nacimiento – joven, encantadora e inquieta.</p>
<p class="tip">La página de tu carta muestra tus estrellas simbólicas, y la previsión del año indica cuáles activa cada año y cada mes.</p>`,
    quiz: [
      { q: '¿Qué estrella representa el romance y el encanto?', options: ['Caballo Viajero', 'Flor de Melocotón', 'Dosel', 'Vacío'], answer: 1, explain: 'Flor de Melocotón 桃花 – atracción y popularidad.' },
      { q: 'Para 申子辰, el Caballo Viajero es …', options: ['寅', '酉', '辰', '亥'], answer: 0, explain: '申子辰 → 寅; es la rama que choca con la primera rama del grupo.' },
      { q: 'El Noble Celestial se busca a partir del …', options: ['rama del mes', 'tallo de la hora', 'tallo del día', 'pilar de la suerte'], answer: 2, explain: '天乙贵人 se busca a partir del tallo del día (y a menudo también del tallo del año).' },
    ],
  },
  {
    id: 'luck', title: 'Pilares de la Suerte', zh: '大运', level: 'Analysis',
    summary: 'Fases de diez años que tiñen tu vida.',
    body: `
<p>Además de la carta natal, el BaZi usa los <b>Pilares de la Suerte</b> (大运 Da Yun): cada uno dura diez años y añade un nuevo tallo y una nueva rama a la carta.</p>
<h3>Dirección</h3>
<ul><li>Año Yang + hombre, o año Yin + mujer → los pilares de la suerte avanzan <b>hacia delante</b> desde el pilar del mes.</li>
<li>Año Yin + hombre, o año Yang + mujer → avanzan <b>hacia atrás</b>.</li></ul>
<h3>Edad de inicio</h3>
<p>Cuenta los días desde el nacimiento hasta el siguiente término Jie (hacia delante) o hasta el anterior (hacia atrás). <b>Tres días = un año</b> de vida. 15 días → el primer pilar de la suerte empieza a los 5 años.</p>
<p>Además, cada año tiene su propio <b>pilar anual</b> (流年). La interacción entre la carta natal, el pilar de la suerte y el pilar del año se usa para hablar de los tiempos.</p>
<p class="tip">Tus pilares de la suerte aparecen al final de tu carta calculada.</p>`,
    quiz: [
      { q: '¿Cuánto dura un Pilar de la Suerte?', options: ['1 año', '5 años', '10 años', '12 años'], answer: 2, explain: 'Cada pilar de la suerte abarca diez años.' },
      { q: 'Un hombre nacido en un año Yang: los pilares de la suerte van …', options: ['Hacia delante', 'Hacia atrás', 'Depende de la hora', 'En ambos sentidos'], answer: 0, explain: 'Año Yang + hombre → hacia delante.' },
      { q: '¿Cuántos días equivalen a un año de edad de inicio?', options: ['1', '3', '10', '30'], answer: 1, explain: 'Tres días = un año.' },
    ],
  },
  {
    id: 'useful', title: 'Dios Útil y equilibrio', zh: '用神', level: 'Analysis',
    summary: '¿Qué elemento equilibra una carta?',
    body: `
<p>El <b>Dios Útil</b> (用神) es el elemento que mejor equilibra una carta. El enfoque clásico es 扶抑 (apoyar o contener):</p>
<ul>
<li><b>Maestro del Día fuerte</b> → favorece la Expresión, la Riqueza y el Poder (para drenar y aprovechar el exceso).</li>
<li><b>Maestro del Día débil</b> → favorece los Recursos y los Compañeros (para apoyarlo).</li>
</ul>
<p>Un segundo enfoque es 调候 (ajuste del clima): una carta nacida en pleno invierno necesita Fuego para calentarse; una carta de verano necesita Agua para refrescarse.</p>
<p>Las cartas especiales en las que un elemento domina por completo pueden, en cambio, «seguir» a ese elemento (从格).</p>
<h3>Practicar con responsabilidad</h3>
<p>El BaZi describe tendencias, no un destino fijo. Los buenos practicantes lo usan para animar a la reflexión – nunca para asustar a las personas ni para decidir por ellas.</p>
<p class="tip">Siguiente paso: calcula las cartas de personas que conoces bien y compara lo que ves con lo que sabes. ¡Después ponte a prueba en la pestaña Cuestionario!</p>`,
    quiz: [
      { q: 'Un Maestro del Día muy débil suele beneficiarse de …', options: ['la Riqueza', 'el Poder', 'los Recursos', 'la Expresión'], answer: 2, explain: 'El Recurso apoya y fortalece al Maestro del Día.' },
      { q: '调候 se refiere al …', options: ['Ajuste del clima', 'Combinación de tallos', 'Pilares de la suerte', 'Tallos ocultos'], answer: 0, explain: 'Equilibrar calor y frío, sequedad y humedad.' },
    ],
  },
  {
    id: 'lifestages', title: 'Las Doce Fases de Crecimiento', zh: '十二长生', level: 'Advanced',
    summary: 'Cómo cada tallo nace, alcanza su apogeo y descansa a lo largo de las doce ramas.',
    body: `
<p>Esta es una lección <b>avanzada</b>. Se basa en las Triples Armonías: allí viste que un elemento nace, alcanza su apogeo y se almacena. En realidad, cada Tallo Celestial recorre un ciclo de vida completo de <b>doce fases</b> (十二长生) – una fase por cada una de las doce ramas.</p>
<h3>Las doce fases – una vida en cuatro etapas</h3>
<ul>
<li><b>Crecer:</b> 长生 Nacimiento → 沐浴 Baño (un bebé al que bañan – encantador pero vulnerable) → 冠带 Corona (arreglarse como adolescente)</li>
<li><b>Fuerte:</b> 临官 Mayoría de edad (vida laboral, responsabilidad) → 帝旺 Apogeo (la cima de la fuerza)</li>
<li><b>Debilitarse:</b> 衰 Declive → 病 Enfermedad → 死 Muerte</li>
<li><b>Descansar y renovarse:</b> 墓 Tumba (guardado) → 绝 Extinción (lo viejo se ha ido) → 胎 Concepción → 养 Nutrición (crecer en el vientre) – y el ciclo vuelve a empezar con el Nacimiento.</li>
</ul>
<p class="tip">No te asustes por nombres como «Enfermedad» o «Muerte»: son imágenes clásicas de la fuerza de un elemento, no predicciones sobre tu salud o tu vida.</p>
<div data-widget="life-stages"></div>
<h3>Cómo se cuenta</h3>
<ol>
<li>Busca la rama de <b>Nacimiento</b> del tallo: 甲 Madera → 亥 Cerdo, 丙 Fuego y 戊 Tierra → 寅 Tigre, 庚 Metal → 巳 Serpiente, 壬 Agua → 申 Mono. Para los tallos Yin: 乙 → 午 Caballo, 丁 y 己 → 酉 Gallo, 辛 → 子 Rata, 癸 → 卯 Conejo.</li>
<li>Los <b>tallos Yang</b> avanzan desde ahí <b>hacia delante</b> (en sentido horario), una fase por rama. Los <b>tallos Yin</b> van <b>hacia atrás</b>.</li>
</ol>
<p>Ejemplo 甲 Madera: Nacimiento en 亥 Cerdo, Baño en 子 Rata, Corona en 丑 Buey, Mayoría de edad en 寅 Tigre, Apogeo en 卯 Conejo, Declive en 辰 Dragón … Tumba en 未 Cabra.</p>
<p>La Tierra 戊 y 己 sigue aquí al Fuego (la visión clásica más común). Algunas escuelas hacen que los tallos Yin compartan sin más el ciclo de su pareja Yang; la app usa el cómputo clásico «el Yin va hacia atrás».</p>
<h3>Conexiones que ya conoces</h3>
<ul>
<li><b>Triple Armonía:</b> Nacimiento, Apogeo y Tumba de un tallo Yang son justo los tres animales de su grupo – 壬 Agua: 申 Mono, 子 Rata, 辰 Dragón.</li>
<li><b>Estrella de Prosperidad 禄</b> = la fase Mayoría de edad del Maestro del Día; <b>Filo de Cabra 羊刃</b> = el Apogeo de un Maestro del Día Yang.</li>
<li><b>Flor de Melocotón 桃花</b> = la fase Baño del elemento del grupo; <b>Dosel 华盖</b> = su Tumba.</li>
<li><b>Fuerza:</b> un Maestro del Día nacido en un mes en el que está en Mayoría de edad o Apogeo es fuerte; en Muerte, Tumba o Extinción es débil y necesita apoyo.</li>
</ul>
<h3>Leerlo en una carta</h3>
<p>Mira la fase del <b>Maestro del Día</b> en cada rama de la carta. La rama del <b>mes</b> muestra su fuerza por la estación; la rama del <b>día</b> (su propio asiento) muestra cuánto apoyo interior tiene – un Maestro del Día sentado sobre Nacimiento, Mayoría de edad o Apogeo pisa suelo firme. Las fases fuertes dan raíz; las débiles indican que el Maestro del Día descansa allí. Como siempre, las fases son un factor entre muchos y nunca pesan más que el equilibrio general.</p>
<p class="tip">Tu carta muestra la fase de crecimiento del Maestro del Día en cada pilar (tarjeta «Tu pilar del día»).</p>`,
    quiz: [
      { q: '¿Dónde nace 甲 Madera?', options: ['亥 Cerdo', '寅 Tigre', '午 Caballo', '申 Mono'], answer: 0, explain: '甲 Madera nace en 亥 Cerdo y avanza desde ahí.' },
      { q: 'Los tallos Yin cuentan las fases …', options: ['Hacia delante', 'Hacia atrás', 'No las cuentan', 'Solo en verano'], answer: 1, explain: 'Los tallos Yang van hacia delante; los Yin, hacia atrás.' },
      { q: 'Nacimiento, Apogeo y Tumba de un tallo Yang forman una …', options: ['Seis Armonías', 'Triple Armonía', 'Choque', 'Castigo'], answer: 1, explain: 'Para 壬 Agua: 申 Mono, 子 Rata, 辰 Dragón – la Triple Armonía del Agua.' },
    ],
  },
];
