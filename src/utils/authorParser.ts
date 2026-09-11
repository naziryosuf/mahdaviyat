import { TeamMember } from '@/types';

export interface ParsedAuthor {
  rawName: string;
  cleanName: string;
  member: TeamMember | null;
  role?: string;
  avatar?: string;
}

/**
 * Checks if a given member name is present/selected in the author string
 */
export function isMemberInAuthorString(authorStr?: string, memberName?: string): boolean {
  if (!authorStr || !memberName) return false;
  const tokens = authorStr
    .split(/[,،\n]|(?=@)|\s+و\s+/)
    .map((t) => t.replace(/^[@#\s]+/, '').trim())
    .filter(Boolean);
  const mName = memberName.trim().toLowerCase();
  return tokens.some((t) => {
    const tl = t.toLowerCase();
    return tl === mName || mName.includes(tl) || tl.includes(mName);
  });
}

/**
 * Toggles a member into or out of the author string
 * Supports adding multiple members with '@Name، @Name' syntax
 */
export function toggleMemberInAuthorString(currentAuthorStr: string = '', memberName: string): string {
  const cleanMemberName = memberName.replace(/^[@#\s]+/, '').trim();
  if (!cleanMemberName) return currentAuthorStr;

  const rawTokens = currentAuthorStr
    .split(/[,،\n]|(?=@)|\s+و\s+/)
    .map((t) => t.replace(/^[@#\s]+/, '').trim())
    .filter(Boolean);

  const mName = cleanMemberName.toLowerCase();
  const existingIdx = rawTokens.findIndex((t) => {
    const tl = t.toLowerCase();
    return tl === mName || mName.includes(tl) || tl.includes(mName);
  });

  if (existingIdx >= 0) {
    // Remove if already selected
    rawTokens.splice(existingIdx, 1);
  } else {
    // Add if not selected
    rawTokens.push(cleanMemberName);
  }

  if (rawTokens.length === 0) return '';
  return rawTokens.map((t) => `@${t}`).join('، ');
}

/**
 * Parses author string into an array of individual parsed author objects
 */
export function parseMultipleAuthors(
  authorString: string | undefined,
  teamMembers: TeamMember[] = [],
  defaultTitle?: string
): ParsedAuthor[] {
  if (!authorString || !authorString.trim()) {
    const defaultName = 'M. Nazir Yosuf';
    const matched = teamMembers.find((m) => m.name_fa.includes('نذیر') || m.name_fa.includes('Nazir'));
    return [{
      rawName: defaultName,
      cleanName: defaultName,
      member: matched || null,
      role: defaultTitle || matched?.role_fa || 'سردبیر ارشد / پژوهشگر',
      avatar: matched?.avatar_url || ''
    }];
  }

  // Split by comma, 'و', newline, or @
  const parts = authorString
    .split(/[,،\n]|(?=@)|\s+و\s+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const results: ParsedAuthor[] = [];

  for (const part of parts) {
    const clean = part.replace(/^[@#\s]+/, '').trim();
    if (!clean) continue;

    const matchedMember = teamMembers.find((m) => {
      if (!m?.name_fa) return false;
      const mName = m.name_fa.trim().toLowerCase();
      const cName = clean.toLowerCase();
      return mName === cName || mName.includes(cName) || cName.includes(mName);
    });

    results.push({
      rawName: part,
      cleanName: clean,
      member: matchedMember || null,
      role: matchedMember?.role_fa || defaultTitle,
      avatar: matchedMember?.avatar_url || ''
    });
  }

  if (results.length === 0) {
    const clean = authorString.replace(/^[@#\s]+/, '').trim();
    return [{
      rawName: authorString,
      cleanName: clean,
      member: null,
      role: defaultTitle,
      avatar: ''
    }];
  }

  return results;
}
