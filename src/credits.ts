export interface ArtworkCredit {
  readonly level: number;
  readonly source: string;
  readonly sourceUrl: string;
  readonly status: string;
}

export const ARTWORK_CREDITS: readonly ArtworkCredit[] = [
  { level: 1, source: 'Wikimedia Commons', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Claude_Monet,_Impression,_soleil_levant.jpg', status: 'Public Domain / Public Domain Mark' },
  { level: 2, source: 'Wikimedia Commons', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Edouard_Manet,_A_Bar_at_the_Folies-Berg%C3%A8re.jpg', status: 'Public Domain / PD-Art' },
  { level: 3, source: 'Wikimedia Commons', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Rouen_Cathedral,_West_Facade,_Sunlight.jpg', status: 'Public Domain / Public Domain Mark' },
  { level: 4, source: 'Wikimedia Commons', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Edgar_Germain_Hilaire_Degas_076.jpg', status: 'Public Domain / Public Domain Mark' },
  { level: 5, source: 'Wikimedia Commons', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Berthe_Morisot_-_Le_Berceau.jpg', status: 'Public Domain / PD-Art' },
  { level: 6, source: 'Wikimedia Commons', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_De_slaapkamer_-_Google_Art_Project.jpg', status: 'Public Domain / PD-Art' },
  { level: 7, source: 'Wikimedia Commons', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Terrace_of_a_Caf%C3%A9_at_Night_%28Place_du_Forum%29_1888.jpg', status: 'Public Domain / PD-Art' },
  { level: 8, source: 'Wikimedia Commons', sourceUrl: 'https://commons.wikimedia.org/wiki/File:A_Sunday_on_La_Grande_Jatte,_Georges_Seurat,_1884.jpg', status: 'Public Domain / PD-Art' },
  { level: 9, source: 'Wikimedia Commons', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Paul_Signac,_1909,_The_Pine_Tree_at_Saint_Tropez,_oil_on_canvas,_72_x_92_cm,_Pushkin_Museum,_Moscow.jpg', status: 'Public Domain / PD-Art' },
  { level: 10, source: 'Wikimedia Commons', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Paul_C%C3%A9zanne_-_The_Basket_of_Apples_-_1926.252_-_Art_Institute_of_Chicago.jpg', status: 'CC0 / Public Domain' },
] as const;
