// Na Yin (纳音, "the sound of the pillar"): each pair of the 60 Jiazi pillars shares one image element.
import { lang } from './i18n.js';

// [zh, element index (0 Wood, 1 Fire, 2 Earth, 3 Metal, 4 Water), English, German, Spanish]
const NAYIN = [
  ['海中金', 3, 'Gold in the sea', 'Gold im Meer', 'Oro en el mar'],
  ['炉中火', 1, 'Fire in the furnace', 'Feuer im Ofen', 'Fuego en el horno'],
  ['大林木', 0, 'Wood of the great forest', 'Holz des großen Waldes', 'Madera del gran bosque'],
  ['路旁土', 2, 'Earth by the roadside', 'Erde am Wegesrand', 'Tierra junto al camino'],
  ['剑锋金', 3, 'Metal of the sword blade', 'Metall der Schwertklinge', 'Metal del filo de la espada'],
  ['山头火', 1, 'Fire on the mountain top', 'Feuer auf dem Berggipfel', 'Fuego en la cima de la montaña'],
  ['涧下水', 4, 'Water in the ravine', 'Wasser in der Schlucht', 'Agua del barranco'],
  ['城头土', 2, 'Earth of the city wall', 'Erde der Stadtmauer', 'Tierra de la muralla'],
  ['白蜡金', 3, 'White wax metal', 'Weißes Wachsmetall', 'Metal de cera blanca'],
  ['杨柳木', 0, 'Willow wood', 'Weidenholz', 'Madera de sauce'],
  ['泉中水', 4, 'Water in the spring', 'Wasser in der Quelle', 'Agua de manantial'],
  ['屋上土', 2, 'Earth on the roof', 'Erde auf dem Dach', 'Tierra sobre el tejado'],
  ['霹雳火', 1, 'Thunderbolt fire', 'Feuer des Donnerkeils', 'Fuego del rayo'],
  ['松柏木', 0, 'Pine and cypress wood', 'Kiefern- und Zypressenholz', 'Madera de pino y ciprés'],
  ['长流水', 4, 'Long-flowing water', 'Lang fließendes Wasser', 'Agua que fluye lejos'],
  ['沙中金', 3, 'Gold in the sand', 'Gold im Sand', 'Oro en la arena'],
  ['山下火', 1, 'Fire at the foot of the mountain', 'Feuer am Fuß des Berges', 'Fuego al pie de la montaña'],
  ['平地木', 0, 'Wood of the plain', 'Holz der Ebene', 'Madera de la llanura'],
  ['壁上土', 2, 'Earth on the wall', 'Erde an der Wand', 'Tierra en la pared'],
  ['金箔金', 3, 'Gold leaf', 'Blattgold', 'Pan de oro'],
  ['覆灯火', 1, 'Lamp fire', 'Lampenfeuer', 'Fuego de lámpara'],
  ['天河水', 4, 'Water of the Milky Way', 'Wasser der Milchstraße', 'Agua de la Vía Láctea'],
  ['大驿土', 2, 'Earth of the great post road', 'Erde der großen Poststraße', 'Tierra del gran camino de postas'],
  ['钗钏金', 3, 'Hairpin and bracelet gold', 'Gold von Haarnadel und Armreif', 'Oro de horquilla y pulsera'],
  ['桑柘木', 0, 'Mulberry wood', 'Maulbeerholz', 'Madera de morera'],
  ['大溪水', 4, 'Water of the great stream', 'Wasser des großen Bachs', 'Agua del gran arroyo'],
  ['沙中土', 2, 'Earth in the sand', 'Erde im Sand', 'Tierra en la arena'],
  ['天上火', 1, 'Fire in the sky', 'Feuer am Himmel', 'Fuego en el cielo'],
  ['石榴木', 0, 'Pomegranate wood', 'Granatapfelholz', 'Madera de granado'],
  ['大海水', 4, 'Water of the great sea', 'Wasser des großen Meeres', 'Agua del gran mar'],
];
const COL = { de: 3, es: 4 }[lang] || 2;

/** Na Yin of a pillar index (0–59): { zh, el, name }. */
export function nayinOf(index) {
  const n = NAYIN[Math.floor((((index % 60) + 60) % 60) / 2)];
  return { zh: n[0], el: n[1], name: n[COL] };
}
