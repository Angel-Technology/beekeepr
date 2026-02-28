/**
 * Tailwind CSS configuration for the Beekeepr React Native app
 *
 * This configuration extends Tailwind CSS with Beekeepr's app theme values and
 * provides React Native-specific styling through NativeWind.
 *
 * Structure notes:
 * - The file follows the grouped, documented theme structure you asked for
 * - All values are inlined directly in this file so it remains stable even after
 *   the token export files are removed
 * - Light mode is the default theme
 *
 * @type {import('tailwindcss').Config}
 */

module.exports = {
  /**
   * Content paths for Tailwind to scan for class usage
   * Includes all component files and source directories for purging unused styles
   */
  content: [
    /**
     * App directory - Expo Router file-based routing
     * @description All pages and layouts in the app directory
     */
    './app/**/*.{js,jsx,ts,tsx}',
    /**
     * Components directory
     * @description Reusable component files if they exist
     */
    './components/**/*.{js,jsx,ts,tsx}',
    /**
     * Source directory
     * @description Shared application logic and UI modules
     */
    './src/**/*.{js,jsx,ts,tsx}',
    /**
     * Storybook stories directory
     * @description Storybook files for future design system documentation
     */
    './.rnstorybook/**/*.{js,jsx,ts,tsx}',
  ],

  /**
   * Presets to extend base Tailwind functionality
   * NativeWind preset enables React Native compatibility
   */
  // eslint-disable-next-line global-require
  presets: [require('nativewind/preset')],

  theme: {
    extend: {
      /**
       * Color system for the app
       * Provides grouped color tokens for branding, surfaces, content, and state
       */
      colors: {
        /**
         * Brand colors - Primary brand identity colors
         * Used for key brand elements and high-emphasis actions
         */
        brand: {
          /**
           * Main brand color
           * @description Primary brand color used for buttons, links, and key brand elements
           * @example bg-brand-primary, text-brand-primary, border-brand-primary
           */
          primary: '#FFBF00',
          /**
           * Secondary brand accent
           * @description Lighter brand color for tinted brand surfaces and softer accents
           * @example bg-brand-secondary, text-brand-secondary
           */
          secondary: '#FFF8CB',
          /**
           * Tertiary brand accent
           * @description Darker brand color for hover states and stronger contrast accents
           * @example bg-brand-tertiary, text-brand-tertiary
           */
          tertiary: '#E5AC03',
          /**
           * Brand accent color
           * @description Additional accent color for supporting highlights and contrast moments
           * @example text-brand-accent, bg-brand-accent
           */
          accent: '#000000',
        },

        /**
         * Text colors - Typography color tokens
         * Provides semantic text colors for different content types and states
         */
        text: {
          /**
           * Inverse text color
           * @description High contrast text color for use on dark or branded backgrounds
           * @example text-text-inverse
           */
          inverse: '#FFFFFF',
          /**
           * Subtle inverse text
           * @description Lower-emphasis text color for secondary content on dark surfaces
           * @example text-text-inverseSubtle
           */
          inverseSubtle: 'rgba(0, 0, 0, 0.3)',
          /**
           * Weak text color
           * @description De-emphasized text color for supporting labels and lower-priority metadata
           * @example text-text-weak
           */
          weak: 'rgba(0, 0, 0, 0.5)',
          /**
           * Default text color
           * @description Standard body text color for primary reading content
           * @example text-text-default
           */
          default: '#000000',
          /**
           * Secondary text color
           * @description Medium-emphasis text color for support copy and less prominent labels
           * @example text-text-secondary
           */
          secondary: 'rgba(0, 0, 0, 0.7)',
          /**
           * Strong text color
           * @description Highest-emphasis text color for headings and key content
           * @example text-text-strong
           */
          strong: '#000000',
          /**
           * Primary action text
           * @description Brand-driven text color for links and emphasized actions
           * @example text-text-primary
           */
          primary: '#E5AC03',
          /**
           * Critical text color
           * @description Error or destructive text color for danger states and failures
           * @example text-text-critical
           */
          critical: '#FF0000',
          /**
           * Warning text color
           * @description Attention-drawing text color for warnings and caution states
           * @example text-text-warning
           */
          warning: '#FFBF00',
          /**
           * Success text color
           * @description Positive state text color for confirmations and completion states
           * @example text-text-success
           */
          success: '#00A93E',
          /**
           * Informational text color
           * @description Informational text color used for helper, hint, or neutral status messaging
           * @example text-text-informational
           */
          informational: '#1489E6',
          /**
           * Emphasized action text
           * @description Alternate action text treatment used for highlighted button and CTA states
           * @example text-text-actionEmphasis
           */
          actionEmphasis: '#E5AC03',
          /**
           * Disabled text color
           * @description Muted text color for disabled controls and inactive content
           * @example text-text-disabled
           */
          disabled: 'rgba(0, 0, 0, 0.35)',
        },

        /**
         * Background colors - Component background tokens
         * Used for buttons, form elements, and interactive components
         */
        bg: {
          /**
           * Default background
           * @description Standard neutral background color for components
           * @example bg-bg-default
           */
          default: '#FFFFFF',
          /**
           * Weak emphasis background
           * @description Light neutral background for low-emphasis surfaces
           * @example bg-bg-weak
           */
          weak: '#EEEEEE',
          /**
           * Medium emphasis background
           * @description Mid-level surface background for grouped or separated content
           * @example bg-bg-medium
           */
          medium: '#DDDDDD',
          /**
           * Strong emphasis background
           * @description High-emphasis neutral background for stronger contrast blocks
           * @example bg-bg-strong
           */
          strong: '#000000',
          /**
           * Primary action background
           * @description Solid branded background for primary actions
           * @example bg-bg-primary
           */
          primary: '#FFBF00',
          /**
           * Subtle primary background
           * @description Tinted brand background for lower-emphasis brand surfaces
           * @example bg-bg-primarySubtle
           */
          primarySubtle: '#FFF8CB',
          /**
           * Critical background
           * @description Error-state background for destructive alerts and attention states
           * @example bg-bg-critical
           */
          critical: '#FF0000',
          /**
           * Subtle critical background
           * @description Soft destructive background for less aggressive error emphasis
           * @example bg-bg-criticalSubtle
           */
          criticalSubtle: 'rgba(0, 0, 0, 0.08)',
          /**
           * Warning background
           * @description Warning-state background for cautionary messaging
           * @example bg-bg-warning
           */
          warning: '#FFBF00',
          /**
           * Subtle warning background
           * @description Softer warning background for supportive caution messaging
           * @example bg-bg-warningSubtle
           */
          warningSubtle: '#F7E6A7',
          /**
           * Success background
           * @description Success-state background for confirmation and completed states
           * @example bg-bg-success
           */
          success: '#00A93E',
          /**
           * Subtle success background
           * @description Soft positive background for low-emphasis confirmation states
           * @example bg-bg-successSubtle
           */
          successSubtle: 'rgba(0, 0, 0, 0.08)',
          /**
           * Informational background
           * @description Informational background for helper messaging and neutral status surfaces
           * @example bg-bg-informational
           */
          informational: '#1489E6',
          /**
           * Subtle informational background
           * @description Soft informational background for hints and secondary helper content
           * @example bg-bg-informationalSubtle
           */
          informationalSubtle: 'rgba(0, 0, 0, 0.08)',
          /**
           * Disabled background
           * @description Muted background for disabled interactive components
           * @example bg-bg-disabled
           */
          disabled: 'rgba(0, 0, 0, 0.08)',
          /**
           * Subtle disabled background
           * @description Very low-emphasis muted background for disabled or unavailable states
           * @example bg-bg-disabledSubtle
           */
          disabledSubtle: 'rgba(0, 0, 0, 0.08)',
          /**
           * Muted subtle background
           * @description Lightest muted background for faint grouping and separation
           * @example bg-bg-mutedSubtle
           */
          mutedSubtle: 'rgba(0, 0, 0, 0.08)',
          /**
           * Muted weak background
           * @description Light neutral background for quiet secondary content
           * @example bg-bg-mutedWeak
           */
          mutedWeak: '#EEEEEE',
          /**
           * Muted medium background
           * @description Medium neutral background for more visible grouping
           * @example bg-bg-mutedMedium
           */
          mutedMedium: '#DDDDDD',
          /**
           * Muted strong background
           * @description Strong neutral background for high-contrast surface treatment
           * @example bg-bg-mutedStrong
           */
          mutedStrong: '#000000',
        },

        /**
         * Border colors - Border and outline tokens
         * Used for component borders, dividers, and focus states
         */
        border: {
          /**
           * Inverse border color
           * @description High-contrast border color for use on dark or heavily branded surfaces
           * @example border-border-inverse
           */
          inverse: '#FFFFFF',
          /**
           * Subtle border color
           * @description Lightest border for minimal visual separation
           * @example border-border-subtle
           */
          subtle: 'rgba(0, 0, 0, 0.08)',
          /**
           * Weak border color
           * @description Low-emphasis border for soft separation between elements
           * @example border-border-weak
           */
          weak: 'rgba(0, 0, 0, 0.16)',
          /**
           * Default border color
           * @description Standard border color for inputs, cards, and separators
           * @example border-border-default
           */
          default: 'rgba(0, 0, 0, 0.32)',
          /**
           * Strong border color
           * @description High-emphasis border for stronger contrast and active states
           * @example border-border-strong
           */
          strong: '#000000',
          /**
           * Primary border color
           * @description Brand-aligned border used for emphasized or primary interactive components
           * @example border-border-primary
           */
          primary: '#FFBF00',
          /**
           * Subtle primary border color
           * @description Softer brand border for tinted buttons and quiet brand treatments
           * @example border-border-primarySubtle
           */
          primarySubtle: '#FFF8CB',
          /**
           * Critical border color
           * @description Destructive border color for error and danger states
           * @example border-border-critical
           */
          critical: '#FF0000',
          /**
           * Warning border color
           * @description Warning border color for cautionary messaging and controls
           * @example border-border-warning
           */
          warning: '#FFBF00',
          /**
           * Success border color
           * @description Positive border color for success and completion states
           * @example border-border-success
           */
          success: '#00A93E',
          /**
           * Informational border color
           * @description Informational border color for helper UI and neutral notices
           * @example border-border-informational
           */
          informational: '#1489E6',
          /**
           * Disabled border color
           * @description Muted border used for disabled form controls and inactive actions
           * @example border-border-disabled
           */
          disabled: 'rgba(0, 0, 0, 0.2)',
        },

        /**
         * Action colors - Interactive state tokens
         * Provides the exact exported action treatments for brand, dynamic brand, neutral, and disabled controls
         */
        action: {
          /**
           * Brand action tokens
           * @description Primary branded interaction colors for buttons, links, and CTA treatments
           */
          brand: {
            text: {
              default: '#000000',
              hover: 'rgba(0, 0, 0, 0.5)',
              onAction: '#FFFFFF',
            },
            background: {
              solid: '#FFBF00',
              solidHover: '#E5AC03',
              tinted: '#FFF8CB',
              tintedHover: '#F7E6A7',
            },
            border: {
              default: '#FFF8CB',
              hover: '#FFBF00',
            },
          },
          /**
           * Dynamic brand action tokens
           * @description Alternate branded interaction set exported separately by the design source
           */
          brandDynamic: {
            text: {
              default: '#000000',
              hover: 'rgba(0, 0, 0, 0.5)',
              onAction: '#FFFFFF',
            },
            background: {
              solid: '#FFBF00',
              solidHover: '#E5AC03',
              tinted: '#FFF8CB',
              tintedHover: '#F7E6A7',
            },
            border: {
              default: '#E5AC03',
              hover: '#FFBF00',
            },
          },
          /**
           * Neutral action tokens
           * @description Neutral interaction treatment for secondary controls and utility actions
           */
          neutral: {
            text: {
              default: 'rgba(0, 0, 0, 0.7)',
              hover: '#000000',
              onAction: '#FFFFFF',
            },
            background: {
              solid: '#000000',
              solidHover: 'rgba(0, 0, 0, 0.7)',
              tinted: 'rgba(0, 0, 0, 0.08)',
              tintedHover: 'rgba(0, 0, 0, 0.16)',
            },
            border: {
              default: 'rgba(0, 0, 0, 0.3)',
              hover: '#000000',
            },
          },
          /**
           * Disabled action tokens
           * @description Shared disabled-state colors across interaction types
           */
          disabled: {
            text: 'rgba(0, 0, 0, 0.35)',
            background: 'rgba(0, 0, 0, 0.08)',
            border: 'rgba(0, 0, 0, 0.2)',
          },
        },
      },

      /**
       * Spacing scale - Consistent spacing tokens
       * Provides a harmonious spacing system for layouts and components
       */
      spacing: {
        /**
         * Zero spacing
         * @description Removes spacing entirely for flush layouts and resets
         * @example p-0, m-0, gap-0
         */
        0: '0px',
        /**
         * Token spacing size 1
         * @description Direct token export matching the smallest positive base spacing value
         * @example p-1, m-1, gap-1
         */
        1: '4px',
        /**
         * Token spacing size 2
         * @description Direct token export for small spacing between tightly grouped UI elements
         * @example p-2, m-2, gap-2
         */
        2: '6px',
        /**
         * Token spacing size 3
         * @description Direct token export for compact general-purpose spacing
         * @example p-3, m-3, gap-3
         */
        3: '8px',
        /**
         * Token spacing size 4
         * @description Direct token export for slightly expanded compact spacing
         * @example p-4, m-4, gap-4
         */
        4: '12px',
        /**
         * Token spacing size 5
         * @description Direct token export matching the default body rhythm spacing
         * @example p-5, m-5, gap-5
         */
        5: '16px',
        /**
         * Token spacing size 6
         * @description Direct token export for section and component padding
         * @example p-6, m-6, gap-6
         */
        6: '24px',
        /**
         * Token spacing size 7
         * @description Direct token export for larger component and layout spacing
         * @example p-7, m-7, gap-7
         */
        7: '32px',
        /**
         * Token spacing size 8
         * @description Direct token export for large section spacing
         * @example p-8, m-8, gap-8
         */
        8: '56px',
        /**
         * Token spacing size 9
         * @description Direct token export for dramatic layout separation
         * @example p-9, m-9, gap-9
         */
        9: '80px',
        /**
         * Token spacing size 10
         * @description Direct token export for hero-level vertical spacing
         * @example p-10, m-10, gap-10
         */
        10: '120px',
        /**
         * Token spacing size 11
         * @description Direct token export for major page section separation
         * @example p-11, m-11, gap-11
         */
        11: '160px',
        /**
         * Token spacing size 12
         * @description Direct token export for the largest available spacing value
         * @example p-12, m-12, gap-12
         */
        12: '200px',
        /**
         * Specific 1px spacing
         * @description Direct pixel utility for hairline spacing adjustments
         * @example p-1px, m-1px
         */
        '1px': '1px',
        '2px': '2px',
        '3px': '3px',
        '5px': '5px',
        '10px': '10px',
        '14px': '14px',
        '20px': '20px',
        '44px': '44px',
        /**
         * Negative spacing token n1
         * @description Direct negative spacing export for pull layouts and offset adjustments
         * @example -m-n1
         */
        n1: '-4px',
        n2: '-6px',
        n3: '-8px',
        n4: '-12px',
        n5: '-16px',
        /**
         * Extra small spacing
         * @description Minimal spacing for tight layouts and fine adjustments
         * @example p-xs, m-xs, gap-xs
         */
        xs: '4px',
        /**
         * Small spacing
         * @description Compact spacing for dense layouts
         * @example p-sm, m-sm, gap-sm
         */
        sm: '8px',
        /**
         * Medium spacing
         * @description Standard spacing unit for most layout needs
         * @example p-md, m-md, gap-md
         */
        md: '16px',
        /**
         * Large spacing
         * @description Generous spacing for comfortable layouts
         * @example p-lg, m-lg, gap-lg
         */
        lg: '24px',
        /**
         * Extra large spacing
         * @description Spacious spacing for prominent layout sections
         * @example p-xl, m-xl, gap-xl
         */
        xl: '32px',
        /**
         * 2x extra large spacing
         * @description Larger section spacing for high-emphasis layout breaks
         * @example p-2xl, m-2xl, gap-2xl
         */
        '2xl': '56px',
        /**
         * 3x extra large spacing
         * @description Hero-level spacing for major visual separation
         * @example p-3xl, m-3xl, gap-3xl
         */
        '3xl': '80px',
        /**
         * 4x extra large spacing
         * @description Large page-level spacing for major sections
         * @example p-4xl, m-4xl, gap-4xl
         */
        '4xl': '120px',
        /**
         * 5x extra large spacing
         * @description Very large layout spacing for major page transitions
         * @example p-5xl, m-5xl, gap-5xl
         */
        '5xl': '160px',
        /**
         * 6x extra large spacing
         * @description Maximum exported spacing currently included in the app theme
         * @example p-6xl, m-6xl, gap-6xl
         */
        '6xl': '200px',
      },

      /**
       * Border radius scale - Consistent corner rounding
       * Provides consistent border radius values for components
       */
      borderRadius: {
        0: '0px',
        1: '4px',
        2: '6px',
        3: '8px',
        4: '12px',
        5: '16px',
        6: '32px',
        /**
         * No rounding
         * @description Sharp corners with no border radius
         * @example rounded-none
         */
        none: '0px',
        /**
         * Small rounding
         * @description Subtle corner rounding for restrained softness
         * @example rounded-sm
         */
        sm: '4px',
        /**
         * Medium rounding
         * @description Standard corner rounding for most controls and containers
         * @example rounded-md
         */
        md: '8px',
        /**
         * Large rounding
         * @description Generous corner rounding for cards and high-emphasis UI
         * @example rounded-lg
         */
        lg: '12px',
        /**
         * Extra large rounding
         * @description Very rounded corners for standout surfaces and media
         * @example rounded-xl
         */
        xl: '16px',
        /**
         * 2x extra large rounding
         * @description Strong rounded treatment for large cards and sheets
         * @example rounded-2xl
         */
        '2xl': '32px',
        /**
         * Fully rounded corners
         * @description Pill radius for chips, tags, and circular buttons
         * @example rounded-round
         */
        round: '1000px',
      },

      /**
       * Border width scale - Consistent border thickness
       * Provides standard border width values for components
       */
      borderWidth: {
        /**
         * No border
         * @description Removes border completely
         * @example border-none
         */
        none: '0px',
        /**
         * Extra thin border
         * @description Minimal border thickness for subtle outlines
         * @example border-xs
         */
        xs: '1px',
        /**
         * Thin border
         * @description Light border thickness for standard UI separation
         * @example border-sm
         */
        sm: '2px',
        /**
         * Medium border
         * @description Standard border thickness for forms and cards
         * @example border-md
         */
        md: '3px',
        /**
         * Thick border
         * @description High-emphasis border thickness for strong focus and accents
         * @example border-lg
         */
        lg: '5px',
      },

      /**
       * Font family definitions - Each font weight as separate family
       * Each font file is loaded as its own distinct font family for reliable React Native support
       */
      fontFamily: {
        /**
         * Design-system family aliases
         * @description Family aliases that preserve the source design token intent
         */
        display: ['Poppins', 'sans-serif'],
        title: ['Poppins', 'sans-serif'],
        body: ['Source Sans 3', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        code: ['Source Sans 3', 'monospace'],
        /**
         * Inter font families
         * @description Utility font families for Inter where explicit weight control is needed
         */
        'inter-regular': ['Inter-Regular', 'sans-serif'],
        'inter-semiBold': ['Inter-SemiBold', 'sans-serif'],
        'inter-bold': ['Inter-Bold', 'sans-serif'],

        /**
         * Source Sans font families
         * @description Primary body font family set for the app
         */
        'sourceSans-blackItalic': ['SourceSans3-BlackItalic', 'sans-serif'],
        'sourceSans-black': ['SourceSans3-Black', 'sans-serif'],
        'sourceSans-boldItalic': ['SourceSans3-BoldItalic', 'sans-serif'],
        'sourceSans-bold': ['SourceSans3-Bold', 'sans-serif'],
        'sourceSans-extraBoldItalic': [
          'SourceSans3-ExtraBoldItalic',
          'sans-serif',
        ],
        'sourceSans-extraBold': ['SourceSans3-ExtraBold', 'sans-serif'],
        'sourceSans-extraLightItalic': [
          'SourceSans3-ExtraLightItalic',
          'sans-serif',
        ],
        'sourceSans-extraLight': ['SourceSans3-ExtraLight', 'sans-serif'],
        'sourceSans-lightItalic': ['SourceSans3-LightItalic', 'sans-serif'],
        'sourceSans-light': ['SourceSans3-Light', 'sans-serif'],
        'sourceSans-mediumItalic': ['SourceSans3-MediumItalic', 'sans-serif'],
        'sourceSans-medium': ['SourceSans3-Medium', 'sans-serif'],
        'sourceSans-regular': ['SourceSans3-Regular', 'sans-serif'],
        'sourceSans-semiBoldItalic': [
          'SourceSans3-SemiBoldItalic',
          'sans-serif',
        ],
        'sourceSans-semiBold': ['SourceSans3-SemiBold', 'sans-serif'],

        /**
         * Poppins font families
         * @description Display and title font family set for brand-forward typography
         */
        'poppins-thinItalic': ['Poppins-ThinItalic', 'sans-serif'],
        'poppins-thin': ['Poppins-Thin', 'sans-serif'],
        'poppins-extraLight': ['Poppins-ExtraLight', 'sans-serif'],
        'poppins-extraLightItalic': ['Poppins-ExtraLightItalic', 'sans-serif'],
        'poppins-light': ['Poppins-Light', 'sans-serif'],
        'poppins-lightItalic': ['Poppins-LightItalic', 'sans-serif'],
        'poppins-regular': ['Poppins-Regular', 'sans-serif'],
        'poppins-medium': ['Poppins-Medium', 'sans-serif'],
        'poppins-mediumItalic': ['Poppins-MediumItalic', 'sans-serif'],
        'poppins-semiBold': ['Poppins-SemiBold', 'sans-serif'],
        'poppins-semiBoldItalic': ['Poppins-SemiBoldItalic', 'sans-serif'],
        'poppins-bold': ['Poppins-Bold', 'sans-serif'],
        'poppins-boldItalic': ['Poppins-BoldItalic', 'sans-serif'],
        'poppins-extraBold': ['Poppins-ExtraBold', 'sans-serif'],
        'poppins-extraBoldItalic': ['Poppins-ExtraBoldItalic', 'sans-serif'],
        'poppins-black': ['Poppins-Black', 'sans-serif'],
        'poppins-blackItalic': ['Poppins-BlackItalic', 'sans-serif'],

        /**
         * System fallback
         * @description Default sans-serif fallback when a specific custom family is not applied
         * @example font-sans
         */
        sans: ['SourceSans3-Regular', 'sans-serif'],
      },

      /**
       * Font size scale - Typography sizing system
       * Provides consistent text sizing from caption to display styles
       */
      fontSize: {
        'display-1-desktop': '96px',
        'display-1-tablet': '80px',
        'display-1-mobile': '48px',
        'display-2-desktop': '80px',
        'display-2-tablet': '64px',
        'display-2-mobile': '44px',
        'display-3-desktop': '64px',
        'display-3-tablet': '48px',
        'display-3-mobile': '40px',
        'title-1': '34px',
        'title-2': '28px',
        'title-3': '24px',
        'title-4': '20px',
        body: '16px',
        callout: '15px',
        subhead: '14px',
        footnote: '12px',
        caption: '11px',
        'button-xs': '12px',
        'button-sm': '14px',
        'button-default': '16px',
        'button-lg': '20px',
        /**
         * Smallest text
         * @description Caption-sized text for tiny labels and helper metadata
         * @example text-100
         */
        100: '11px',
        /**
         * Very small text
         * @description Footnote-sized text for secondary supporting content
         * @example text-200
         */
        200: '12px',
        /**
         * Small text
         * @description Subhead-sized text for labels and dense body support text
         * @example text-300
         */
        300: '14px',
        /**
         * Base body text
         * @description Standard text size for most body content
         * @example text-400
         */
        400: '16px',
        /**
         * Medium emphasis text
         * @description Slightly larger text used for prominent buttons and short callouts
         * @example text-500
         */
        500: '20px',
        /**
         * Small title text
         * @description Entry title size for compact headings
         * @example text-600
         */
        600: '20px',
        /**
         * Medium title text
         * @description Section heading size for major subsections
         * @example text-700
         */
        700: '24px',
        /**
         * Large title text
         * @description High-emphasis heading size for page and modal titles
         * @example text-800
         */
        800: '28px',
        /**
         * Hero title text
         * @description Largest title size used for high-emphasis screen headers
         * @example text-900
         */
        900: '34px',
        /**
         * Display text
         * @description Mobile display size for major onboarding headlines
         * @example text-1000
         */
        1000: '40px',
        /**
         * Large display text
         * @description Larger mobile display size for the most prominent hero copy
         * @example text-1100
         */
        1100: '44px',
      },

      /**
       * Font weight scale
       * Provides direct access to the app's typography weight values
       */
      fontWeight: {
        display: '600',
        'display-regular': '400',
        title: '600',
        'title-regular': '400',
        content: '400',
        'content-strong': '600',
        button: '600',
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },

      /**
       * Line height scale - Typography vertical rhythm
       * Provides a practical line-height ramp for headings and body text
       */
      lineHeight: {
        100: '14px',
        200: '16px',
        300: '20px',
        400: '24px',
        500: '28px',
        600: '32px',
        700: '36px',
        800: '40px',
        900: '44px',
        1000: '52px',
        1100: '60px',
        1200: '68px',
      },

      /**
       * Opacity scale - Transparency values
       * Provides consistent opacity values for layering and state treatment
       */
      opacity: {
        100: '0.1',
        200: '0.2',
        300: '0.3',
        400: '0.4',
        500: '0.5',
        600: '0.6',
        700: '0.7',
        800: '0.8',
        900: '0.9',
        1000: '1',
      },

      /**
       * Box shadow definitions - Elevation system
       * Provides consistent shadow styles for depth and focus states
       */
      boxShadow: {
        /**
         * Standard shadow
         * @description Default shadow for most elevated components
         * @example shadow-default
         */
        default:
          '0 0 15px 0 rgba(106, 115, 125, 0.16), 0 0 3px 0 rgba(106, 115, 125, 0.15)',
        /**
         * Small shadow
         * @description Subtle shadow for minimal elevation
         * @example shadow-sm
         */
        sm: '0 3px 8px -1px rgba(106, 115, 125, 0.05), 0 0 3px 0 rgba(106, 115, 125, 0.24)',
        /**
         * Medium shadow
         * @description Moderate shadow for standard elevation
         * @example shadow-md
         */
        md: '0 4px 12px -2px rgba(106, 115, 125, 0.16), 0 0 3px 0 rgba(106, 115, 125, 0.15)',
        /**
         * Large shadow
         * @description Prominent shadow for higher elevation surfaces
         * @example shadow-lg
         */
        lg: '0 10px 16px 0 rgba(106, 115, 125, 0.10), 0 0 3px 0 rgba(106, 115, 125, 0.15)',
        /**
         * Extra large shadow
         * @description Dramatic shadow for high-emphasis floating UI
         * @example shadow-xl
         */
        xl: '0 20px 24px 0 rgba(106, 115, 125, 0.10), 0 0 3px 0 rgba(106, 115, 125, 0.15)',
        /**
         * 2x extra large shadow
         * @description Maximum shadow depth for modal or hero-like elevation
         * @example shadow-2xl
         */
        '2xl':
          '0 30px 40px 0 rgba(106, 115, 125, 0.10), 0 0 3px 0 rgba(106, 115, 125, 0.15)',
        /**
         * Focus-visible shadow
         * @description Accessible focus ring treatment for keyboard and focus states
         * @example shadow-focus-visible
         */
        'focus-visible': '0 0 0 3px rgba(34, 139, 230, 0.6), 0 0 0 1px #228be6',
      },

      /**
       * Letter spacing scale - Typography character spacing
       * Provides basic tracking utilities until the app defines a dedicated tracking scale
       */
      letterSpacing: {
        /**
         * Tightest tracking
         * @description Minimal character spacing for dense headings
         * @example tracking-tighter
         */
        tighter: '-0.03em',
        /**
         * Tight tracking
         * @description Slightly reduced character spacing for compact headings
         * @example tracking-tight
         */
        tight: '-0.015em',
        /**
         * Normal tracking
         * @description Default character spacing for standard readability
         * @example tracking-normal
         */
        normal: '0em',
      },
    },
  },

  /**
   * Tailwind plugins array
   * Currently empty but available for future plugin integrations
   */
  plugins: [],
};
