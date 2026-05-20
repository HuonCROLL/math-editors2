import type { ChemStructureMode } from '../types/embeds';

type KetAtom = {
  label?: string;
  location?: [number, number, number];
  explicitValence?: number;
  implicitHCount?: number | null;
  [key: string]: unknown;
};

type KetBond = {
  type?: number | string;
  atoms?: [number, number];
  [key: string]: unknown;
};

type KetFragment = {
  atoms?: KetAtom[];
  bonds?: KetBond[];
  [key: string]: unknown;
};

const BOND_ORDER_BY_TYPE: Record<number, number> = {
  1: 1,
  2: 2,
  3: 3,
  // Aromatic/query bonds should not create missing hydrogens in teaching mode.
  4: 1,
};

const getBondOrder = (bond: KetBond): number => {
  if (typeof bond.type === 'number') return BOND_ORDER_BY_TYPE[bond.type] ?? 1;
  return 1;
};

const isCarbonAtom = (atom: KetAtom): boolean => atom.label === 'C';

const normalizeFragmentAtoms = (fragment: KetFragment) => {
  if (!Array.isArray(fragment.atoms)) return;

  const valenceByAtomIndex = new Map<number, number>();
  fragment.bonds?.forEach((bond) => {
    const atoms = bond.atoms;
    if (!Array.isArray(atoms) || atoms.length !== 2) return;

    const order = getBondOrder(bond);
    valenceByAtomIndex.set(atoms[0], (valenceByAtomIndex.get(atoms[0]) ?? 0) + order);
    valenceByAtomIndex.set(atoms[1], (valenceByAtomIndex.get(atoms[1]) ?? 0) + order);
  });

  fragment.atoms.forEach((atom, index) => {
    atom.implicitHCount = 0;
    atom.explicitValence = Math.min(12, Math.max(0, valenceByAtomIndex.get(index) ?? 0));
  });
};

const walkKet = (value: unknown) => {
  if (!value || typeof value !== 'object') return;

  const maybeFragment = value as KetFragment;
  if (
    Array.isArray(maybeFragment.atoms) &&
    maybeFragment.atoms.every((atom) => atom && typeof atom === 'object' && !Array.isArray(atom))
  ) {
    normalizeFragmentAtoms(maybeFragment);
  }

  Object.values(value).forEach((child) => {
    if (Array.isArray(child)) child.forEach(walkKet);
    else walkKet(child);
  });
};

export function normalizeTeachingDiagramKet(sourceValue: string): string {
  if (!sourceValue.trim()) return sourceValue;

  const parsed = JSON.parse(sourceValue);
  walkKet(parsed);
  return JSON.stringify(parsed, null, 4);
}

const removeTeachingDisplayAnnotations = (value: unknown) => {
  if (!value || typeof value !== 'object') return;

  const maybeFragment = value as KetFragment;
  if (
    Array.isArray(maybeFragment.atoms) &&
    maybeFragment.atoms.every((atom) => atom && typeof atom === 'object' && !Array.isArray(atom))
  ) {
    maybeFragment.atoms.forEach((atom) => {
      delete atom.explicitValence;
      delete atom.implicitHCount;
      delete atom.hCount;
    });
  }

  Object.values(value).forEach((child) => {
    if (Array.isArray(child)) child.forEach(removeTeachingDisplayAnnotations);
    else removeTeachingDisplayAnnotations(child);
  });
};

export function denormalizeTeachingDiagramKetForEditing(sourceValue: string): string {
  if (!sourceValue.trim()) return sourceValue;

  const parsed = JSON.parse(sourceValue);
  removeTeachingDisplayAnnotations(parsed);
  return JSON.stringify(parsed, null, 4);
}

export function normalizeChemStructureSource(sourceValue: string, mode: ChemStructureMode): string {
  if (mode !== 'teaching-diagram') return sourceValue;
  return normalizeTeachingDiagramKet(sourceValue);
}

const normalizeStructureModeFragmentAtoms = (fragment: KetFragment) => {
  if (!Array.isArray(fragment.atoms)) return;

  fragment.atoms.forEach((atom) => {
    if (isCarbonAtom(atom)) return;
    atom.implicitHCount = 0;
  });
};

const walkKetForStructurePreview = (value: unknown) => {
  if (!value || typeof value !== 'object') return;

  const maybeFragment = value as KetFragment;
  if (
    Array.isArray(maybeFragment.atoms) &&
    maybeFragment.atoms.every((atom) => atom && typeof atom === 'object' && !Array.isArray(atom))
  ) {
    normalizeStructureModeFragmentAtoms(maybeFragment);
  }

  Object.values(value).forEach((child) => {
    if (Array.isArray(child)) child.forEach(walkKetForStructurePreview);
    else walkKetForStructurePreview(child);
  });
};

export function normalizeStructurePreviewKet(sourceValue: string): string {
  if (!sourceValue.trim()) return sourceValue;

  const parsed = JSON.parse(sourceValue);
  walkKetForStructurePreview(parsed);
  return JSON.stringify(parsed, null, 4);
}

type DrawableFragment = Required<Pick<KetFragment, 'atoms' | 'bonds'>>;

const collectDrawableFragments = (value: unknown, fragments: DrawableFragment[] = []): DrawableFragment[] => {
  if (!value || typeof value !== 'object') return fragments;

  const maybeFragment = value as KetFragment;
  if (
    Array.isArray(maybeFragment.atoms) &&
    Array.isArray(maybeFragment.bonds) &&
    maybeFragment.atoms.every((atom) => atom && typeof atom === 'object' && !Array.isArray(atom))
  ) {
    fragments.push({ atoms: maybeFragment.atoms, bonds: maybeFragment.bonds });
  }

  Object.values(value).forEach((child) => {
    if (Array.isArray(child)) child.forEach((item) => collectDrawableFragments(item, fragments));
    else collectDrawableFragments(child, fragments);
  });

  return fragments;
};

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export function renderTeachingDiagramSvg(sourceValue: string): string {
  const parsed = JSON.parse(sourceValue);
  const fragments = collectDrawableFragments(parsed);
  const atoms = fragments.flatMap((fragment) => fragment.atoms);
  const positionedAtoms = atoms.filter((atom): atom is KetAtom & { location: [number, number, number] } =>
    Array.isArray(atom.location),
  );

  if (!positionedAtoms.length) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1" viewBox="0 0 1 1"></svg>';
  }

  const scale = 40;
  const padding = 24;
  const xs = positionedAtoms.map((atom) => atom.location[0]);
  const ys = positionedAtoms.map((atom) => atom.location[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = Math.max(1, Math.round((maxX - minX) * scale + padding * 2));
  const height = Math.max(1, Math.round((maxY - minY) * scale + padding * 2));
  const pointFor = (atom: KetAtom) => {
    const [x, y] = atom.location ?? [0, 0, 0];
    return {
      x: (x - minX) * scale + padding,
      y: (maxY - y) * scale + padding,
    };
  };

  const bondElements = fragments.flatMap((fragment) =>
    fragment.bonds.map((bond) => {
      if (!bond.atoms) return '';
      const [startIndex, endIndex] = bond.atoms;
      const start = fragment.atoms[startIndex];
      const end = fragment.atoms[endIndex];
      if (!start?.location || !end?.location) return '';

      const p1 = pointFor(start);
      const p2 = pointFor(end);
      return `<line x1="${p1.x.toFixed(2)}" y1="${p1.y.toFixed(2)}" x2="${p2.x.toFixed(2)}" y2="${p2.y.toFixed(2)}" stroke="black" stroke-width="2" stroke-linecap="round" />`;
    }),
  );

  const atomElements = positionedAtoms.map((atom) => {
    const p = pointFor(atom);
    const label = escapeXml(atom.label || '');
    if (!label) return '';

    const labelWidth = Math.max(18, label.length * 9);
    return [
      `<rect x="${(p.x - labelWidth / 2).toFixed(2)}" y="${(p.y - 10).toFixed(2)}" width="${labelWidth}" height="16" fill="white" />`,
      `<text x="${p.x.toFixed(2)}" y="${(p.y + 4).toFixed(2)}" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="black">${label}</text>`,
    ].join('');
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${bondElements.join('')}${atomElements.join('')}</svg>`;
}
