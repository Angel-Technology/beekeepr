import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine `clsx` (conditional / array class handling) with
 * `tailwind-merge` (Tailwind conflict resolution — later utilities of the
 * same family win over earlier ones).
 *
 * Use this in component defaults so the consumer's `className` override
 * actually replaces the default rather than appending to it:
 *
 *     cn('gap-6 p-6 rounded-5', className)
 *     // consumer passes 'gap-1 p-4' → 'rounded-5 gap-1 p-4'
 */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
