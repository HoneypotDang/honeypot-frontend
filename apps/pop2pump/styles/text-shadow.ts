import type { PluginAPI } from 'tailwindcss/types/config';

const createTextShadowStyles = (value: string) => ({
  'text-shadow': value.replace(/_/g, ' '),
});

export const textShadowPlugin = ({ matchUtilities }: Pick<PluginAPI, 'matchUtilities'>) => {
  matchUtilities({
    'text-shadow': (value: string) => createTextShadowStyles(value),
  });
}; 