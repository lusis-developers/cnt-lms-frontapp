/**
 * Logic to determine if a course is related to gastronomy/business.
 * Filters out math, algebra, chemistry, etc. as they are not relevant for the CNT LMS Demo.
 */
export function isGastronomic(course: any): boolean {
  if (!course) return false;

  const name = (course.name || course.title || '').toLowerCase();
  const description = (course.heading || course.description || course.shortDescription || '').toLowerCase();

  // Strong gastronomic signals (these override almost anything)
  const strongGastronomicKeywords = [
    'ingeniería gastronómica', 'dark kitchen', 'restaurante', 'chef', 'cocina',
    'gastronomía', 'gastronómico', 'gastronómic', 'pastelería', 'panadería'
  ];

  const hasStrongSignal = strongGastronomicKeywords.some(keyword =>
    name.includes(keyword) || description.includes(keyword)
  );

  if (hasStrongSignal) return true;

  // Strictly blocked subjects (non-gastronomic academic subjects)
  const strictlyBlockedKeywords = [
    'física contemporánea', 'algebra', 'álgebra', 'razonamiento lógico',
    'ciencias ambientales', 'estadística descriptiva', 'trigonometría',
    'biología', 'historia universal', 'geografía', 'lenguaje', 'química'
  ];

  // If it's a pure academic subject with no gastronomic context, block it
  const isStrictlyAcademic = strictlyBlockedKeywords.some(keyword =>
    name.includes(keyword)
  );

  if (isStrictlyAcademic) return false;

  // General business/gastronomy keywords
  const gastronomicKeywords = [
    'receta', 'alimento', 'bebida', 'catering', 'menú',
    'repostería', 'barismo', 'vino', 'servicio', 'costeo',
    'inventario', 'marketing', 'negocio', 'lean startup', 'valida'
  ];

  return gastronomicKeywords.some(keyword =>
    name.includes(keyword) || description.includes(keyword)
  );
}

/**
 * Logic to completely hide certain courses from the UI.
 * Now it respects isGastronomic to allow courses like "Ingeniería Gastronómica".
 */
export function isHidden(course: any): boolean {
  if (!course) return true;

  // If it's identified as gastronomic, NEVER hide it.
  if (isGastronomic(course)) return false;

  const name = (course.name || course.title || '').toLowerCase();
  const description = (course.heading || course.description || course.shortDescription || '').toLowerCase();

  const strictlyBlockedKeywords = [
    'física contemporánea', 'álgebra', 'algebra', 'razonamiento lógico',
    'ciencias ambientales', 'estadística descriptiva', 'matemática', 'química'
  ];

  return strictlyBlockedKeywords.some(keyword =>
    name.includes(keyword) || description.includes(keyword)
  );
}

/**
 * Determines if a course should be blurred/blocked.
 */
export function isComingSoon(course: any): boolean {
  if (!course) return true;

  // Explicitly check for mock IDs
  if (String(course.id || '').startsWith('mock-')) return true;

  // Check if it's published in the system
  const isPublished = !!(course.is_published || course.published);
  if (!isPublished) return true;

  // If it's gastronomic, it's not "Coming Soon" (it's active)
  return !isGastronomic(course);
}
